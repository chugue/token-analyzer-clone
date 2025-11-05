import { TopicDetail, TopicTimelinePoint } from "../types/report.t";

export function deriveTimelineFromTopics(
  topics: TopicDetail[] | undefined
): TopicTimelinePoint[] {
  if (!topics?.length) return [];

  const derived = topics.map((topic) => {
    if (!Array.isArray(topic.sourceTweets) || topic.sourceTweets.length === 0)
      return null;

    const earliest = topic.sourceTweets.reduce((earliestTweet, current) => {
      if (!earliestTweet) return current;
      return new Date(current.createdAt).getTime() <
        new Date(earliestTweet.createdAt).getTime()
        ? current
        : earliestTweet;
    }, topic.sourceTweets[0]);
  });
}
