import {
  buildSummary,
  extractChips,
} from "@/lib/helpers/report-insights-helpers";
import { DetailedReport } from "@/lib/types/report.t";
import { useMemo } from "react";
interface HighlightsPanelProps {
  report: DetailedReport;
  variant?: "standalone" | "embedded";
}

const InsightsHighllightPanel = ({
  report,
  variant = "standalone",
}: HighlightsPanelProps) => {
  const summary = useMemo(() => buildSummary(report), [report]);
  const chips = useMemo(() => extractChips(report), [report]);

  if (!summary) {
    return variant === "standalone" ? (
      <section className="'rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.85)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-100">하이라이트</h2>
        <p className="mt-3 text-sm text-slate-300">
          요약 가능한 하이라이트가 없습니다.
        </p>
      </section>
    ) : (
      <div className="text-sm text-slate-400">
        요약 가능한 하이라이트가 없습니다.{" "}
      </div>
    );
  }

  const chipClass = (s: "positive" | "negative" | "neutral") =>
    s === "positive"
      ? "bg-[rgba(34,197,94,0.15)] text-emerald-100 border border-[rgba(16,185,129,0.35)]"
      : s === "negative"
      ? "bg-[rgba(248,113,113,0.18)] text-rose-100 border border-[rgba(248,113,113,0.35)]"
      : "bg-[rgba(148,163,184,0.15)] text-slate-100 border border-[rgba(148,163,184,0.35)]";

  if (variant === "embedded") {
    return (
      <div>
        <p className="text-sm leading-relaxed text-slate-200">{summary}</p>
        {chips.length ? (
          <div className="mt-3 flex flex-wrap gap-2">
            {chips.map((chip, idx) => (
              <span
                key={`${chip.text}-${idx}`}
                className={`rounded-full px-3 py-1 text-xs ${chipClass(
                  chip.sentiment
                )}`}
              >
                {chip.text}
              </span>
            ))}
          </div>
        ) : null}
        <div className="mt-4">
          <a
            href="#topics"
            className="text-xs font-semibold text-sky-300 hover:text-sky-200"
          >
            자세히 보기
          </a>
        </div>
      </div>
    );
  }
  return (
    <section className="rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.85)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-100">하이라이트</h2>
      <p className="mt-3 text-sm leading-relaxed text-slate-200">{summary}</p>
      {chips.length ? (
        <div className="mt-3 flex flex-wrap gap-2">
          {chips.map((chip, idx) => (
            <span
              key={`${chip.text}-${idx}`}
              className={`rounded-full px-3 py-1 text-xs ${chipClass(
                chip.sentiment
              )}`}
            >
              {chip.text}
            </span>
          ))}
        </div>
      ) : null}
      <div className="mt-4">
        <a
          href="#topics"
          className="text-xs font-semibold text-sky-300 hover:text-sky-200"
        >
          자세히 보기 →
        </a>
      </div>
    </section>
  );
};

export default InsightsHighllightPanel;
