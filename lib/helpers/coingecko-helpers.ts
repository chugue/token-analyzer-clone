import { CONFIG } from "@/config";
import { MarketChartData, MarketChartPoint } from "./../types/coinggecko.t";

const DEFAULT_INTERVAL_MINUTES =
  CONFIG.COINGECKO.MARKET_CHART.INTERVAL_MINUTES || 60;

export async function fetchHighResMarketChart24h(
  slug: string
): Promise<MarketChartData> {
  const nowMs = Date.now();
  const fromMs = nowMs - 24 * 60 * 60 * 1000;
  const fromSec = Math.floor(fromMs / 1000);
  const toSec = Math.floor(nowMs / 1000);
  const { points } = await fetchMarketChartRange(slug, fromSec, toSec);

  const merged = dedupeAndSortPoints(points).filter(
    (p) => p.timestamp >= fromMs && p.timestamp <= nowMs
  );

  if (merged.length < 2) {
    throw new Error(`Insufficient high-resolution points for 24h window`);
  }
  return {
    points: merged,
    intervalMinutes: inferIntervalMinutes(merged),
  };
}

export async function fetchMarketChartRange(
  slug: string,
  fromSec: number,
  toSec: number
): Promise<MarketChartData> {
  if (!slug || slug.trim().length === 0) {
    throw new Error("Coingecko market chart range requries a non-empty slug");
  }

  if (
    !Number.isFinite(fromSec) ||
    !Number.isFinite(toSec) ||
    toSec <= fromSec
  ) {
    throw new Error("Invalid range for Coingecko market chart");
  }

  const params = new URLSearchParams({
    vs_currency: CONFIG.COINGECKO.VS_CURRENCY,
    from: String(Math.floor(fromSec)),
    to: String(Math.floor(toSec)),
  });

  const url = `${CONFIG.COINGECKO.API_BASE}/coins/${encodeURIComponent(
    slug
  )}/market_chart/range?${params.toString()}`;
  const response = await fetch(url, { headers: buildCoingeckoHeaders() });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to fetch Coingecko range (${slug}): ${response.status} ${response.statusText} ${body}`
    );
  }

  const payload = await response.json();
  const points = parseMarketArraysToPoints(payload);

  if (points.length === 0) {
    throw new Error(`Coingecko range (${slug}) returned no usable data`);
  }

  return {
    points: dedupeAndSortPoints(points),
    intervalMinutes: inferIntervalMinutes(points),
  };
}

function buildCoingeckoHeaders(): Record<string, string> {
  const headers: Record<string, string> = { Accept: "application/json" };
  const apiKey = process.env.COINGECKO_API_KEY;
  if (apiKey && apiKey.trim().length > 0) {
    headers["x-cg-demo-api-key"] = apiKey.trim();
  }
  return headers;
}

function parseMarketArraysToPoints(payload: any): MarketChartPoint[] {
  const prices: unknown[] = Array.isArray(payload?.prices)
    ? payload.prices
    : [];
  const volumes: unknown[] = Array.isArray(payload?.total_volumes)
    ? payload.total_volumes
    : [];

  const points: MarketChartPoint[] = prices
    .map((entry, idx) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return undefined;
      }
      const [timestampRaw, priceRaw] = entry;
      const volumeEntry = Array.isArray(volumes[idx])
        ? volumes[idx]
        : undefined;
      const volumeRaw =
        Array.isArray(volumeEntry) && volumeEntry.length > 1
          ? volumeEntry[1]
          : undefined;
      const timestamp =
        typeof timestampRaw === "number" ? timestampRaw : Number(timestampRaw);
      const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw);
      const volume =
        typeof volumeRaw === "number" ? volumeRaw : Number(volumeRaw);

      if (!Number.isFinite(timestamp) || !Number.isFinite(price)) {
        return undefined;
      }

      return {
        timestamp,
        price,
        volume: Number.isFinite(volume) ? volume : 0,
      };
    })
    .filter((p): p is MarketChartPoint => Boolean(p));

  return points;
}
function dedupeAndSortPoints(points: MarketChartPoint[]): MarketChartPoint[] {
  const byTs = new Map<number, MarketChartPoint>();
  for (const p of points) {
    if (!p) continue;
    byTs.set(p.timestamp, p);
  }

  return Array.from(byTs.values()).sort((a, b) => a.timestamp - b.timestamp);
}
function inferIntervalMinutes(points: MarketChartPoint[]): number {
  if (!Array.isArray(points) || points.length < 2) {
    return DEFAULT_INTERVAL_MINUTES;
  }

  const recentPoints = points.slice(-6);
  const gaps = recentPoints
    .map((point, idx, arr) => {
      if (idx === 0) return undefined;
      const prev = arr[idx - 1];
      return point.timestamp - prev.timestamp;
    })
    .filter(
      (gap): gap is number =>
        typeof gap === "number" && Number.isFinite(gap) && gap > 0
    );

  if (gaps.length === 0) {
    return DEFAULT_INTERVAL_MINUTES;
  }

  const averageGapMs = gaps.reduce((sum, gap) => sum + gap, 0) / gaps.length;
  const inferredMinutes = Math.round(averageGapMs / 60_000);

  if (!Number.isFinite(inferredMinutes) || inferredMinutes <= 0) {
    return DEFAULT_INTERVAL_MINUTES;
  }
  return inferredMinutes;
}

export async function fetchMarketChartData(
  slug: string
): Promise<MarketChartData> {
  if (!slug || slug.trim().length === 0) {
    throw new Error("Coingecko market chart data requires a non-empty slug");
  }

  const params = new URLSearchParams({
    vs_currency: CONFIG.COINGECKO.VS_CURRENCY,
    days: String(CONFIG.COINGECKO.MARKET_CHART.DAYS),
  });

  const url = `${CONFIG.COINGECKO.API_BASE}/coins/${encodeURIComponent(
    slug
  )}/market_chart?${params.toString()}`;
  const response = await fetch(url, { headers: buildCoingeckoHeaders() });

  if (!response.ok) {
    const body = await response.text();
    throw new Error(
      `Failed to fetch Coingecko market chart (${slug}): ${response.status} ${response.statusText} ${body}`
    );
  }

  const payload = await response.json();
  const prices: unknown[] = Array.isArray(payload?.prices)
    ? payload.prices
    : [];

  const volumes: unknown[] = Array.isArray(payload?.total_volumes)
    ? payload.total_volumes
    : [];

  if (prices.length === 0) {
    throw new Error(`Coingecko market chart (${slug}) returned no prices data`);
  }

  const points: MarketChartPoint[] = prices
    .map((entry, idx) => {
      if (!Array.isArray(entry) || entry.length < 2) {
        return undefined;
      }

      const [timestampRaw, priceRaw] = entry;
      const volumeEntry = Array.isArray(volumes[idx])
        ? volumes[idx]
        : undefined;

      const volumeRaw =
        Array.isArray(volumeEntry) && volumeEntry.length > 1
          ? volumeEntry[1]
          : undefined;
      const timestamp =
        typeof timestampRaw === "number" ? timestampRaw : Number(timestampRaw);
      const price = typeof priceRaw === "number" ? priceRaw : Number(priceRaw);
      const volume =
        typeof volumeRaw === "number" ? volumeRaw : Number(volumeRaw);

      if (!Number.isFinite(timestamp) || !Number.isFinite(price)) {
        return undefined;
      }

      return {
        timestamp,
        price,
        volume: Number.isFinite(volume) ? volume : 0,
      };
    })
    .filter((point): point is MarketChartPoint => Boolean(point));

  if (points.length === 0) {
    throw new Error(`Coingecko market chart ${slug} return unusable data`);
  }

  const intervalMinutes = inferIntervalMinutes(points);
  return { points, intervalMinutes };
}
