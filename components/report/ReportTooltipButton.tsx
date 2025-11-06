import {
  buildHeatTooltip,
  formatHeatTen,
} from "@/lib/helpers/heat-star-helpers";
import { DetailedReport } from "@/lib/types/report.t";
import { useId, useMemo, useRef, useState } from "react";
import HeatStarRating from "./heat-star/HeatStarRating";

const ReportTooltipButton = ({ report }: { report: DetailedReport }) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  const tooltipId = useId();
  const heatTooltipLines = useMemo(
    () => buildHeatTooltip(report.metrics.totalHeat ?? 0).split("\n"),
    [report.metrics.totalHeat]
  );

  const handleMouseEnter = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches
    ) {
      setTooltipOpen(true);
    }
  };

  const handleMouseLeave = () => {
    if (
      typeof window !== "undefined" &&
      window.matchMedia("(hover: hover)").matches
    ) {
      setTooltipOpen(false);
    }
  };

  return (
    <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
      <div ref={tooltipRef} className="relative">
        <button
          type="button"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onClick={() => setTooltipOpen((prev) => !prev)}
          onFocus={() => setTooltipOpen(true)}
          onBlur={(event) => {
            if (
              !event.currentTarget.contains(event.relatedTarget as Node | null)
            ) {
              setTooltipOpen(false);
            }
          }}
          aria-describedby={tooltipOpen ? tooltipId : undefined}
          aria-expanded={tooltipOpen}
          aria-haspopup="dialog"
          className="flex min-w-[220px] max-w-full flex-col items-start gap-1 rounded-2xl border  border-[rgba(147,197,253,0.45)] bg-[rgba(59,130,246,0.18)] px-4 py-3 text-left text-[13px] font-medium text-[#bfdbfe] shadow-[0_12px_24px_rgba(37,99,235,0.22)] transition hover:border-[rgba(147,197,253,0.7)] focus:outline-none focus:ring-2 focus:ring-sky-300/40"
        >
          <div className="flex items-center gap-2">
            {/* TODO: Star Rating 컴포넌트 수정 필요 6.3이 반영이 안되고 있음 별 4개가 나옴 */}
            <HeatStarRating heat={report.metrics.totalHeat ?? 0} size="md" />
            <span className="text-sm font-medium text-slate-100">
              관심도 {formatHeatTen(report.metrics.totalHeat ?? 0)}/10
            </span>
          </div>
        </button>

        {tooltipOpen ? (
          <div
            id={tooltipId}
            role="tooltip"
            className="absolute left-1/2 top-[calc(100%+10px)] z-20 w-72 -translate-x-12 rounded-xl border border-white/10 bg-slate-900/95 p-4 text-xs text-slate-200 shadow-[0_12px_30px_rgba(8,11,19,0.55)]"
          >
            {heatTooltipLines.map((line, idx) => (
              <p
                key={`${line}-${idx}`}
                className={
                  idx === 0
                    ? "font-semibold text-slate-100"
                    : "mt-1 leading-relaxed"
                }
              >
                {line}
              </p>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default ReportTooltipButton;
