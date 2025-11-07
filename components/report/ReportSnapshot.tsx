import { buildCtaLinks } from "@/lib/helpers/report-snapshot-helpers";
import { DetailedReport } from "@/lib/types/report.t";
import { useMemo, useState } from "react";

const ReportSnapshot = ({ report }: { report: DetailedReport }) => {
  const [expanded, setExpanded] = useState(false);

  const perplexity = report.perplexity;
  const website = report.resolvedMeta?.website ?? perplexity?.website;
  const features = perplexity?.features ?? [];
  const allCategories =
    report.resolvedMeta?.categories ??
    (perplexity?.category ? [perplexity.category] : []);

  const { visibleCategories, hiddenCount } = useMemo(() => {
    const maxVisible = 3;
    const arr = allCategories ?? [];
    if (expanded) return { visibleCategories: arr, hiddenCount: 0 };
    return {
      visibleCategories: arr.slice(0, maxVisible),
      hiddenCount: Math.max(0, arr.length - maxVisible),
    };
  }, [allCategories, expanded]);

  const ctas = buildCtaLinks(report);

  return (
    <div className="mt-8 lg:hidden">
      <section className="rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.85)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
        <h2 className="text-lg font-semibold text-slate-100">프로젝트 정보</h2>
        <div className="mt-4 grid gap-6 lg:grid-cols-[2fr_1fr_1fr]">
          <div>
            <p className="text-sm leading-relaxed text-slate-300">
              {perplexity?.overview ??
                "프로젝트 요약 정보가 제공되지 않았습니다."}
            </p>
            {website && (
              <div className="mt-3 text-sm">
                공식 링크:{" "}
                <a
                  href={website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sky-300 hover:text-sky-200"
                >
                  {website}
                </a>
              </div>
            )}
          </div>

          <div>
            {features.length > 0 && (
              <ul className="space-y-2 text-sm text-slate-300">
                {features.slice(0, 4).map((feature, idx) => (
                  <li key={`${feature}-${idx}`}>• {feature}</li>
                ))}
              </ul>
            )}
            {visibleCategories.length > 0 && (
              <div className="mt-4 text-sm text-slate-300">
                <p className="text-xs uppercase tracking-wide text-slate-500">
                  카테고리
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {visibleCategories.map((category) => (
                    <span
                      key={category}
                      className="rounded-full border border-white/10 bg-white-/5 px-3 py-1 text-xs text-slate-200"
                    >
                      {category}
                    </span>
                  ))}

                  {hiddenCount > 0 && (
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() => setExpanded((prev) => !prev)}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold text-slate-200 hover:bg-white/10"
                    >
                      {expanded ? "접기" : `더보기 + ${hiddenCount}`}
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
          <div>
            <div className="flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <a
                  key={cta.type}
                  href={cta.href}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-xl bg-linear-to-r from-sky-400 via-blue-400 to-teal-300 px-4 py-3 text-sm font-semibold text-slate-950 shadow-[0_12px_24px_rgba(37,99,235,0.25)] transition hover:brightness-105"
                >
                  {cta.label}
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ReportSnapshot;
