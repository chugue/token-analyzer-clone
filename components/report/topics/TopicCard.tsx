import { formatHeatTen } from "@/lib/helpers/heat-star-helpers";
import {
  SENTIMENT_ALIASES,
  SENTIMENT_LABELS,
  sentimentStyles,
} from "@/lib/helpers/report-topic-helpers";
import { TopicDetail } from "@/lib/types/report.t";
import { formatCompactNumber, formatTimeDistance } from "@/lib/utils";
import { useMemo } from "react";
import HeatStarRating from "../heat-star/HeatStarRating";

const TopicCard = ({
  topic,
  reportCreatedAt,
}: {
  topic: TopicDetail;
  reportCreatedAt: string;
}) => {
  const styles = useMemo(
    () => sentimentStyles(topic.sentiment),
    [topic.sentiment]
  );

  const topTweet = useMemo(() => {
    if (!Array.isArray(topic.sourceTweets) || topic.sourceTweets.length === 0) {
      return undefined;
    }
    return topic.sourceTweets.reduce((best, current) => {
      const bestScore = (best?.retweetCount ?? 0) + (best?.likeCount ?? 0);
      const currentScore =
        (current.retweetCount ?? 0) + (current.likeCount ?? 0);
      return currentScore > bestScore ? current : best;
    }, topic.sourceTweets[0]);
  }, [topic.sourceTweets]);

  const normalizedLabel = topic.label?.trim();

  const showLabel = useMemo(() => {
    if (!normalizedLabel) return false;
    return !SENTIMENT_ALIASES[topic.sentiment]?.some(
      (alias) =>
        alias.toLocaleLowerCase() === normalizedLabel.toLocaleLowerCase()
    );
  }, [normalizedLabel, topic.sentiment]);

  const entities = useMemo(
    () =>
      [
        ...(topic.entities.protocols ?? []),
        ...(topic.entities.tokens ?? []),
        ...(topic.entities.people ?? []),
      ].filter(Boolean),
    [topic.entities]
  );

  return (
    <article className="rounded-[16px] border border-[rgba(148,163,184,0.12)] bg-[rgba(30,41,59,0.72)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.35)] backdrop-blur">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${styles.badge}`}
            >
              {SENTIMENT_LABELS[topic.sentiment]}
            </span>
            {showLabel && (
              <span className="rounded-full border border-white/10 px-2 py-0.5 text-[11px] uppercase tracking-wide text-slate-300">
                {normalizedLabel}
              </span>
            )}
          </div>
          <h3 className="mt-3 text-xl font-semibold text-slate-100">
            {topic.title}
          </h3>
        </div>
        <div className="shrink-0 rounded-full border border-[rgba(147,197,253,0.3)] bg-[rgba(59,130,246,0.12)] px-3 py-1">
          <div className="flex items-center gap-2">
            <HeatStarRating heat={topic.heat} size="xs" />
            <span className="text-[11px] font-semibold text-slate-100">
              {`관심도 ${formatHeatTen(topic.heat ?? 0)}/10`}
            </span>
          </div>
        </div>
      </header>

      <p className="mt-3 text-sm leading-relaxed text-slate-200">
        {topic.analysis}
      </p>

      {entities.length > 0 && (
        <div className="mt-4 flex flex-wrap gap-2">
          {entities.slice(0, 6).map((entity) => (
            <span
              key={entity}
              className="rounded-full bg-[rgba(148,163,184,0.15)] px-3 py-1 text-xs text-slate-200"
            >
              #{entity}
            </span>
          ))}
        </div>
      )}

      {topTweet && (
        <div
          className={`mt-5 rounded-[14px] border ${styles.card} p-4 text-sm text-slate-100 shadow-inner shadow-[rgba(15,23,42,0.25)]`}
        >
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs text-slate-300">
            <span className="font-semibold text-slate-100">
              {topTweet.author}
            </span>
            <span>
              {formatTimeDistance(topTweet.createdAt, reportCreatedAt)}
            </span>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-slate-100/95">
            {topTweet.text}
          </p>
          <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-200/80">
            <span>♻️ {formatCompactNumber(topTweet.retweetCount ?? 0)}</span>
            <span>❤️ {formatCompactNumber(topTweet.likeCount ?? 0)}</span>
            <span>💬 {formatCompactNumber(topTweet.replyCount ?? 0)}</span>
            <span>🔁 {formatCompactNumber(topTweet.quoteCount ?? 0)}</span>
            <a
              href={topTweet.url}
              target="_blank"
              rel="noreferrer"
              className="ml-auto inline-flex items-center gap-1 rounded-full bg-[rgba(148,163,184,0.2)] px-3 py-1 text-xs font-semibold text-slate-900 hover:bg-[rgba(148,163,184,0.3)]"
            >
              원문보기
            </a>
          </div>
        </div>
      )}
    </article>
  );
};

export default TopicCard;
