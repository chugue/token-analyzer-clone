import { redis } from "../redis";
import {
  DetailedReport,
  TopicDetail,
  TopicTimelinePoint,
} from "../types/report.t";

export const cacheKeys = {
  report: (reportId: string) => `report:${reportId}`,
};

// 토픽별 타임라인 정렬
export function deriveTimelineFromTopics(
  topics: TopicDetail[] | undefined
): TopicTimelinePoint[] {
  if (!topics?.length) return [];

  const derived = topics
    .map((topic) => {
      if (!Array.isArray(topic.sourceTweets) || topic.sourceTweets.length === 0)
        return null;

      const earliest = topic.sourceTweets.reduce((earliestTweet, current) => {
        if (!earliestTweet) return current;
        return new Date(current.createdAt).getTime() <
          new Date(earliestTweet.createdAt).getTime()
          ? current
          : earliestTweet;
      }, topic.sourceTweets[0]);

      if (!earliest) return null;

      return {
        title: topic.title,
        heat: topic.heat,
        tweetId: earliest.id,
        createdAt: earliest.createdAt,
        metrics: {
          retweets: earliest.retweetCount,
          likes: earliest.likeCount,
          quotes: earliest.quoteCount,
          replies: earliest.replyCount,
        },
      } as TopicTimelinePoint;
    })
    .filter((item): item is TopicTimelinePoint => item !== null);

  return derived.sort(
    (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
  );
}

export function sortTopics(topics: TopicDetail[] | undefined): TopicDetail[] {
  if (!topics) return [];

  return [...topics].sort((a, b) => {
    const heatA = a.heat ?? 0;
    const heatB = b.heat ?? 0;
    if (heatA === heatB) {
      return (b.influence ?? 0) - (a.influence ?? 0);
    }
    return heatB - heatA;
  });
}

export async function requestReport(reportId: string): Promise<DetailedReport> {
  const response = await fetch(`/api/reports/${reportId}`, {
    cache: "no-store",
  });
}

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
