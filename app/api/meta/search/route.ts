import { searchCoingeckoCoins } from "@/lib/meta/coingecko-search";
import { Result } from "@/lib/types/result";
import { TickerMetaData } from "@/lib/types/ticker.t";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<Result<TickerMetaData[]>>> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || searchParams.get("ticker")?.trim();

  if (!query) {
    return NextResponse.json({
      success: false,
      message: "Query is required",
      status: 400,
    });
  }

  try {
    const results = await searchCoingeckoCoins(query);
    return NextResponse.json({ success: true, data: results });
  } catch (error: Error | unknown) {
    console.error(
      "Coingecko search failed",
      (error as Error)?.message || (error as string)
    );

    return NextResponse.json({
      success: false,
      message: (error as Error)?.message || (error as string),
      status: 502,
    });
  }
}
