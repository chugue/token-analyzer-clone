import { getReportData } from "@/lib/helpers/report-helpers.server";
import { DetailedReport } from "@/lib/types/report.t";
import { Result } from "@/lib/types/result";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reportId: string }> }
): Promise<NextResponse<Result<DetailedReport>>> {
  const { reportId } = await params;

  if (!reportId) {
    return NextResponse.json({
      success: false,
      message: "Report ID is required",
      status: 400,
    });
  }

  console.log(`🔍 리포트 조회 요청: ${reportId}`);

  try {
    const reportData = await getReportData(reportId);

    if (!reportData) {
      console.log(`❌ 리포트를 찾을 수 없음: ${reportId}`);
      return NextResponse.json({
        success: false,
        message: "Report not found",
        status: 404,
      });
    }

    console.log(`✅ 리포트 조회 성공: ${reportId}`);

    return NextResponse.json({
      success: true,
      data: reportData,
    });
  } catch (error) {
    console.error("❌ 리포트 조회 오류:", error);

    return NextResponse.json({
      success: false,
      message: `Failed to fetch report data: ${(error as Error).message}`,
      status: 500,
      error: error as Error,
    });
  }
}
