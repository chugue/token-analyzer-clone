import { DetailedReport } from "../types/report.t";
import { clampHeat } from "./heat-star-helpers";

export function buildSummary(report: DetailedReport): string | undefined {
  const topics = report.topics ?? [];
  const pos = topics
    .filter((t) => t.sentiment === "positive")
    .sort((a, b) => clampHeat(b.heat ?? 0) - clampHeat(a.heat ?? 0));

  const neg = topics
    .filter((t) => t.sentiment === "negative")
    .sort((a, b) => clampHeat(b.heat ?? 0) - clampHeat(a.heat ?? 0));

  let summary: string | undefined;
  const posTitles = pos.slice(0, 3).map((t) => t.title.trim());
  const negTitles = neg.slice(0, 3).map((t) => t.title.trim());

  if (posTitles.length && negTitles.length) {
    summary = `${posTitles.join(
      ", "
    )} 등 긍정 모멘텀이 관찰되며, ${negTitles.join(
      ", "
    )} 등 우려도 병존합니다.`;
  } else if (posTitles.length) {
    summary = `${posTitles.join(", ")} 등 긍정 모멘텀이 부각됩니다.`;
  } else if (negTitles.length) {
    summary = `${negTitles.join(", ")} 등 부정 이슈가 지배적입니다.`;
  }

  if (
    !summary &&
    Array.isArray(report.highlights) &&
    report.highlights.length > 0
  ) {
    summary = report.highlights[0];
  }

  if (!summary) return undefined;

  return summary.replace(/\s+/g, " ").trim();
}

export function extractChips(
  report: DetailedReport
): Array<{ text: string; sentiment: "positive" | "negative" | "neutral" }> {
  const topics = (report.topics ?? []).slice(0, 5);
  const chips: Array<{
    text: string;
    sentiment: "positive" | "negative" | "neutral";
  }> = [];

  for (const t of topics) {
    const base = (t.label && t.label.trim()) || t.title.trim();
    const text = base.length > 10 ? base.slice(0, 10) : base;
    if (text) chips.push({ text, sentiment: t.sentiment });
    if (chips.length >= 3) break;
  }

  return chips;
}
