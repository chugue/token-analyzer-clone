import { CONFIG } from "@/config";
import {
  CoingeckoCacheEntry,
  CoingeckoSearchCandidate,
  RawCoinEntry,
  RawSearchResponse,
} from "../types/coinggecko.t";

const CACHE_TTL_MS = 60 * 1000; // 1 minute
const cache = new Map<string, CoingeckoCacheEntry>();

export async function searchCoingeckoCoins(
  query: string
): Promise<CoingeckoSearchCandidate[]> {
  const normalizedQuery = normalizeQuery(query);
  if (!normalizedQuery) return [];

  const cached = cache.get(normalizedQuery);
  if (isCacheValid(cached)) return cached!.results;

  const url = new URL(buildCoingeckoUrl("/search"));
  url.searchParams.set("query", query.trim());

  const response = await fetch(url.toString(), {
    headers: buildCoingeckoHeaders(),
    next: { revalidate: 0 },
  });

  if (!response.ok) {
    const body = await response.text().catch(() => "");
    throw new Error(
      `Failed to fetch from Coingecko: ${response.status} ${body}`
    );
  }

  const payload: RawSearchResponse = await response.json();
  const coins = Array.isArray(payload?.coins) ? payload.coins : [];

  const candidates = coins
    .map((entry) => toCoingeckoSearchCandidate(entry as RawCoinEntry))
    .filter(
      (candidate): candidate is CoingeckoSearchCandidate =>
        candidate !== undefined
    );

  const sortedCandidates = sortCandidates(candidates, query).slice(0, 10);

  cache.set(normalizedQuery, {
    fetchedAt: Date.now(),
    query,
    results: sortedCandidates,
  });

  return sortedCandidates;
}

function normalizeQuery(query: string): string {
  return query.trim().toLowerCase();
}

function isCacheValid(entry: CoingeckoCacheEntry | undefined) {
  if (!entry) return false;
  return Date.now() - entry.fetchedAt < CACHE_TTL_MS;
}

function buildCoingeckoUrl(path: string) {
  const base = CONFIG.COINGECKO.API_BASE.replace(/\/$/, "");
  const normalizedPath = path.startsWith("/") ? path : `/${path}`;

  return `${base}${normalizedPath}`;
}

function buildCoingeckoHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "applicaiton/json" };
  const apiKey = process.env.COINGECKO_API_KEY;

  if (apiKey && apiKey.trim().length > 0) {
    headers["x-cg-demo-api-key"] = apiKey.trim();
  }
  return headers;
}

function toCoingeckoSearchCandidate(
  entry: RawCoinEntry
): CoingeckoSearchCandidate | undefined {
  const slug = typeof entry.id === "string" ? entry.id.trim() : undefined;
  const symbolRaw =
    typeof entry.symbol === "string" ? entry.symbol.trim() : undefined;
  const nameRaw =
    typeof entry.name === "string" ? entry.name.trim() : undefined;

  if (!slug || !symbolRaw || !nameRaw) return undefined;

  const rankValueRaw = entry.market_cap_rank as number | string | undefined;
  const rankNumber = Number(rankValueRaw ?? NaN);
  const rank = Number.isFinite(rankNumber) && rankNumber > 0 ? rankNumber : 0;

  const sourceId = rank;

  return {
    source: "coingecko",
    ticker: symbolRaw.toUpperCase(),
    name: nameRaw,
    slug,
    sourceId,
    rank,
  };
}

function sortCandidates(
  results: CoingeckoSearchCandidate[],
  query: string
): CoingeckoSearchCandidate[] {
  const normalized = normalizeQuery(query);

  return results
    .map((candidate) => {
      const symbolLower = candidate.ticker.toLocaleLowerCase();
      const nameLower = candidate.name.toLowerCase();
      const exactSymbol = symbolLower === normalized;
      const startsWithSymbol = symbolLower.startsWith(normalized);
      const containsSymbol = symbolLower.includes(normalized);
      const exactName = nameLower === normalized;
      const startsWithName = nameLower.startsWith(normalized);
      const rankScore =
        Number.isFinite(candidate.rank) && candidate.rank > 0
          ? candidate.rank
          : Number.POSITIVE_INFINITY;
      let score = 0;

      if (exactSymbol) score += 5;
      else if (startsWithSymbol) score += 4;
      else if (containsSymbol) score += 2;

      if (exactName) score += 3;
      else if (startsWithName) score += 1;

      return { candidate, score, rankScore };
    })
    .sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }
      if (b.rankScore !== a.rankScore) {
        return b.rankScore - a.rankScore;
      }

      return a.candidate.ticker.localeCompare(b.candidate.ticker);
    })
    .map(({ candidate }) => candidate);
}
