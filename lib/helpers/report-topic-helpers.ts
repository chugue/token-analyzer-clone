import { TopicDetail } from "../types/report.t";

export const SENTIMENT_LABELS: Record<TopicDetail["sentiment"], string> = {
  positive: "긍정",
  neutral: "중립",
  negative: "부정",
};

export const SENTIMENT_ALIASES: Record<TopicDetail["sentiment"], string[]> = {
  positive: ["positive", "positiv", "긍정"],
  negative: ["negative", "negativ", "부정"],
  neutral: ["neutral", "중립"],
};

export function sentimentStyles(sentiment: TopicDetail["sentiment"]) {
  switch (sentiment) {
    case "positive":
      return {
        badge:
          "bg-[rgba(34,197,94,0.15)] text-emerald-100 border border-[rgba(16,185,129,0.35)]",
        card: "border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.12)]",
      };
    case "negative":
      return {
        badge:
          "bg-[rgba(248,113,113,0.18)] text-rose-100 border border-[rgba(248,113,113,0.35)]",
        card: "border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)]",
      };
    default:
      return {
        badge:
          "bg-[rgba(56,189,248,0.18)] text-sky-100 border border-[rgba(56,189,248,0.35)]",
        card: "border-[rgba(56,189,248,0.3)] bg-[rgba(56,189,248,0.12)]",
      };
  }
}
