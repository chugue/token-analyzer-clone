import { formatHeatTen } from "@/lib/helpers/heat-star-helpers";
import { DetailedReport } from "@/lib/types/report.t";
import { formatPercent } from "@/lib/utils";
import { useEffect, useState } from "react";
import HeatStarRating from "./heat-star/HeatStarRating";

const ReportSummaryBar = ({ report }: { report: DetailedReport }) => {
  const [visible, setVisible] = useState(false);

  const heroSelector = "#hero";

  useEffect(() => {
    if (typeof window === "undefined") return;
    const hero = document.querySelector(heroSelector);
    if (!hero) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setVisible(!entry.isIntersecting);
      },
      {
        rootMargin: "0px",
        threshold: 0,
      }
    );
    observer.observe(hero);
    return () => observer.disconnect();
  }, []);

  const price = report.metrics.price ?? {};
  const name = report.meta.name;
  const symbol = report.meta.symbol;
  const interestTen = formatHeatTen(report.metrics.totalHeat ?? 0);
  const change24h = formatPercent(price.change24hPct);
  const change3d = formatPercent(price.change3dPct);

  return (
    <div
      className={`hidden lg:block fixed left-0 right-0 top-0 z-40 transition-transform duration-200 ${
        visible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="backdrop-blur supports-backdrop-filter:bg-slate-900/75 bg-slate-900/90 border-b border-white/10">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <div className="flex flex-row items-center justify-between text-sm">
            <div className="min-w-0 truncate font-semibold text-slate-100">
              {symbol} · {name}
            </div>
            <div className="flex items-center gap-3 text-slate-100">
              <HeatStarRating heat={report.metrics.totalHeat ?? 0} size="sm" />
              <span className="font-medium">관심도 {interestTen}/10</span>
            </div>

            <div className="flex items-center gap-3 text-slate-200">
              <span className="whitespace-nowrap">24h {change24h}</span>
              <span className="whitespace-nowrap">3d {change3d}</span>
              <a
                href="#topics"
                className="ml-2 inline-flex items-center rounded-md border border-white/10 bg-white/10 px-3 py-1 font-semibold text-slate-100 hover:bg-white/15"
              >
                토픽 보기
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSummaryBar;
