import { BroadcastLocaleInfo, ChannelLocaleInfo } from "../types/coinggecko.t";
import {
  DetailedReport,
  ReportRequest,
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

  if (!response.ok) {
    const payload = await response.json().catch(() => {});
    throw new Error(payload.message || `HTTP ${response.status}`);
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.message || "Failed to fetch report data");
  }

  return result.data as DetailedReport;
}

export function exractChannelLocaleInfo(
  request: ReportRequest
): BroadcastLocaleInfo | null {
  if (!request.broadcast.enabled) return null;
  if (request.broadcast.channels.length === 0) return null;

  const channelLocales: ChannelLocaleInfo = new Map();
  const channels = request.broadcast.channels;

  for (const channel of channels) {
    if (!channel.startsWith("telegram:")) return null;

    const raw = channel.substring(9);
    const locale = raw.split(":")[0];
    const channelId = raw.split(":")[1];

    if (!channelId) return null;

    channelLocales.set(channelId, locale as "ko" | "en");
  }

  return {
    hasEnglishChannel: [...channelLocales.values()].includes("en"),
    channelLocales,
  };
}
