import { DetailedReport } from "@/lib/types/report.t";
import { useMemo, useState } from "react";

const InsightsSnapshotPanel = ({ report }: { report: DetailedReport }) => {
  const [expanded, setExpanded] = useState(false);

  const perplexity = report.perplexity;
  const website = report.resolvedMeta?.website ?? perplexity?.website;
  const categories =
    report.resolvedMeta?.categories ??
    (perplexity?.category ? [perplexity?.category] : []);

  const coingeckoId = report.resolvedMeta?.coingeckoId ?? report.meta.slug;
  const visCats = useMemo(
    () => (expanded ? categories : categories.slice(0, 3)),
    [categories, expanded]
  );

  return (
    <div className="rounded-[14px] border border-white/10 bg-white/5 p-4">
      <div className="text-sm text-slate-300">
        {perplexity?.overview ?? "프로젝트 요약 정보가 제공되지 않았습니다."}
      </div>
      {categories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {visCats.map((cat) => (
            <span
              key={cat}
              className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs text-slate-200"
            >
              {cat}
            </span>
          ))}
          {categories.length > 3 && (
            <button
              type="button"
              className="text-xs font-semibold text-slate-200 hover:text-slate-100"
              onClick={() => setExpanded((prev) => !prev)}
            >
              {expanded ? "접기" : `더보기 +${categories.length - 3}`}
            </button>
          )}
        </div>
      )}

      <div className="mt-3 text-xs">
        {coingeckoId && (
          <a href={`https://www.coingecko.com/en/coins/${coingeckoId}`}>
            Coingecko
          </a>
        )}
        <br />
        <a
          href={`https://dexscreener.com/search?q=${encodeURIComponent(
            report.meta.symbol
          )}`}
          target="_black"
          rel="noreferrer"
          className="text-sky-300 hover:text-sky-200"
        >
          DexScreener
        </a>
        <br />

        {website && (
          <span className="ml-4 text-slate-400">
            공식 링크:{" "}
            <a
              href={website}
              target="_blank"
              rel="noreferrer"
              className="text-sky-300 hover:text-sky-200"
            >
              {website}
            </a>
          </span>
        )}
      </div>
    </div>
  );
};

export default InsightsSnapshotPanel;
