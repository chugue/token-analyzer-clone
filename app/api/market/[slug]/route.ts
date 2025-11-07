import {
  fetchCoingeckoMarketChart,
  fetchCoingeckoOhlc,
} from "@/lib/helpers/report-market-data-helpers";
import { Result } from "@/lib/types/result";
import { NextRequest, NextResponse } from "next/server";

interface MarketDataPayload {
  window: string;
  source: string;
  updatedAt: number;
  points: { t: number; c: number; v?: number }[];
}

type CacheEntry = { data: unknown; expires: number };
const memoryCache: Map<string, CacheEntry> = new Map();
const TTL_MS = 60 * 1000;

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
): Promise<NextResponse<Result<MarketDataPayload>>> {
  try {
    const { slug } = await params;

    if (!slug) {
      return NextResponse.json(
        { success: false, message: "slug is requried" },
        { status: 400 }
      );
    }
    console.log(`🔍 마켓 데이터 요청: ${slug}`);

    const window = "7d";
    const cacheKey = `${window}:${slug}`;
    const now = Date.now();
    const cached = memoryCache.get(cacheKey);
    if (cached && cached.expires > now) {
      return NextResponse.json(
        { success: true, data: cached.data as MarketDataPayload },
        { status: 200 }
      );
    }

    let points: { t: number; c: number; v?: number }[] = [];
    try {
      const ohlc = await fetchCoingeckoOhlc(slug);
      points = ohlc.map(([t, _o, _h, _l, c]) => ({ t, c }));
    } catch (ohlcError) {
      console.warn(`OHLC 실패, market_chart로 폴백: ${slug}`, ohlcError);
      const cg = await fetchCoingeckoMarketChart(slug);
      const prices: [number, number][] = Array.isArray(cg?.prices)
        ? cg.prices
        : [];
      const volumes: [number, number][] = Array.isArray(cg?.total_volumes)
        ? cg.total_volumes
        : [];

      if (prices.length && prices.length === volumes.length) {
        points = prices.map((p, i) => ({
          t: p[0],
          c: p[1],
          v: typeof volumes[i]?.[1] === "number" ? volumes[i][1] : undefined,
        }));
      } else if (prices.length) {
        const volMap = new Map<number, number>();
        for (const v of volumes) volMap.set(v[0], v[1]);
        points = prices.map((p) => ({ t: p[0], c: p[1], v: volMap.get(p[0]) }));
      }
    }

    const payload = {
      window,
      source: "coingecko" as const,
      updatedAt: now,
      points,
    };

    memoryCache.set(cacheKey, { data: payload, expires: now + TTL_MS });
    return NextResponse.json({ success: true, data: payload }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, message: "Failed to fetch market data" },
      { status: 500 }
    );
  }
}
