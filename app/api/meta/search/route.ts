import { ApiResult } from "@/lib/types/api-result.t";
import { TickerMetaData } from "@/lib/types/ticker.t";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  request: NextRequest
): Promise<NextResponse<ApiResult<TickerMetaData[]>>> {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("query") || searchParams.get("ticker")?.trim();

  if (!query)
    return NextResponse.json(
      { success: false, message: "Query is required" },
      { status: 400 }
    );

  return NextResponse.json({ success: true, data: [] });
}
