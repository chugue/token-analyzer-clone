import { redis } from "../redis";
import { DetailedReport } from "../types/report.t";
import { cacheKeys } from "./report-helpers.client";

export async function getReportData(
  reportId: string
): Promise<DetailedReport | null> {
  const key = cacheKeys.report(reportId);
  const data = await redis.get(key);

  if (!data) return null;

  if (typeof data === "object") {
    console.log(`✅ Redis에서 파싱된 객체 반환: ${key}`);
    return data as DetailedReport;
  }

  try {
    console.log(`🔧 문자열 데이터 파싱 시도: ${key}`);
    return JSON.parse(data as string);
  } catch (error) {
    console.warn(`❌ Redis 리포트 데이터 파싱 실패 (${key}):`, error);
    console.warn("데이터 타입:", typeof data);
    console.warn("데이터 샘플:", String(data).substring(0, 100));
    await redis.del(key);
    return null;
  }
}
