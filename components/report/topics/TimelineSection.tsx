import { clampHeat } from "@/lib/helpers/heat-star-helpers";
import useMemoReportData from "@/lib/hooks/use-memoised-report";
import { DetailedReport } from "@/lib/types/report.t";
import { formatNumber, formatTimeDistance } from "@/lib/utils";

const TimelineSection = ({ report }: { report: DetailedReport }) => {
  const { timeline } = useMemoReportData(report);

  if (!timeline || timeline.length === 0) {
    return (
      <section className="rounded-[18px] border border-white/5 bg-[rgba(30,41,59,0.72)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-100">최신순 나열</h2>
        <p className="mt-2 text-sm text-slate-400">
          토픽 근거 트윗이 제공되지 않았습니다.
        </p>
      </section>
    );
  }

  const sorted = [...timeline].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  return (
    <section className="rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.82)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
      <h2 className="text-lg font-semibold text-slate-100">최신순 나열</h2>
      <p className="mt-2 text-sm text-slate-400">
        토픽 발생 시점과 반응을 시간 순으로 확인하세요.
      </p>
      <ul className="mt-4 space-y-3 text-sm">
        {sorted.map((item, idx) => (
          <li
            key={`${item.tweetId}-${idx}`}
            className="rounded-[14px] border border-white/5 bg-slate-950/70 px-4 py-3 shadow-inner shadow-[rgba(15,23,42,0.25)]"
          >
            <div className="flex flex-wrap items-center justify-between text-xs uppercase tracking-wide text-slate-500">
              <span>
                {formatTimeDistance(item.createdAt, report.createdAt)}
              </span>
              <div className="rounded-full border border-[rgba(147,197,253,0.25)] bg-[rgba(59,130,246,0.12)] px-2 py-1 text-[11px] text-slate-200">
                관심도{" "}
                {(() => {
                  if (item.heat === undefined || item.heat === null) return "—";
                  const ten = (clampHeat(item.heat) / 10).toFixed(1);
                  return `${ten}/10`;
                })()}
              </div>
            </div>
            <p className="mt-2 text-sm font-semibold text-slate-100">
              {item.title}
            </p>
            <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-slate-400">
              <span>♻️ {formatNumber(item.metrics?.retweets ?? 0)}</span>
              <span>❤️ {formatNumber(item.metrics?.likes ?? 0)}</span>
              <span>💬 {formatNumber(item.metrics?.replies ?? 0)}</span>
              <span>🔁 {formatNumber(item.metrics?.quotes ?? 0)}</span>
              <a
                href={`https://twitter.com/i/status/${item.tweetId}`}
                target="_blank"
                rel="noreferrer"
                className="ml-auto inline-flex items-center gap-1 rounded-full border border-white/10 bg-white/10 px-3 py-1 text-xs font-semibold text-slate-100 hover:border-white/20"
              >
                원문 보기 →
              </a>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
};

export default TimelineSection;
