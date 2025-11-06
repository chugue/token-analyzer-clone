import useReportStore from "@/lib/store/report-store";
import { DetailedReport } from "@/lib/types/report.t";
import { formatPercent, formatPriceShort } from "@/lib/utils";
import { useMemo } from "react";

const ReportChangeMetrics = ({ report }: { report: DetailedReport }) => {
  const price = report.metrics.price ?? {};

  const { marketData } = useReportStore();

  const latestPrice = useMemo(() => {
    if (marketData.length) return marketData[marketData.length - 1].price;
    return typeof price.latest === "number" ? price.latest : undefined;
  }, [marketData, price.latest]);

  const findBasePrice = (hoursAgo: number): number | undefined => {
    if (!marketData.length) return undefined;
    const target =
      marketData[marketData.length - 1].time - hoursAgo * 60 * 60 * 1000;
    for (let i = marketData.length - 1; i >= 0; i -= 1) {
      if (marketData[i].time <= target) return marketData[i].price;
    }
    return marketData[0]?.price;
  };

  // 변화도 계산 (명확한 UI용 구조화 데이터)
  const computeDelta = (hoursAgo: number, fallbackPct?: number | null) => {
    if (typeof latestPrice === "number") {
      const base = findBasePrice(hoursAgo);
      if (typeof base === "number" && base > 0) {
        const abs = latestPrice - base;
        const pct = (abs / base) * 100;
        return { base, latest: latestPrice, abs, pct } as const;
      }
    }
    return {
      base: undefined,
      latest: latestPrice,
      abs: undefined,
      pct: typeof fallbackPct === "number" ? fallbackPct : undefined,
    } as const;
  };

  const changes = useMemo(
    () => [
      { key: "1h", hours: 1, data: computeDelta(1, price.change1hPct) },
      { key: "3h", hours: 3, data: computeDelta(3, price.change3hPct) },
      { key: "24h", hours: 24, data: computeDelta(24, price.change24hPct) },
      { key: "3d", hours: 72, data: computeDelta(72, price.change3dPct) },
    ],
    [
      computeDelta,
      marketData,
      latestPrice,
      price.change1hPct,
      price.change3hPct,
      price.change24hPct,
      price.change3dPct,
    ]
  );
  return (
    <div className="mt-6">
      <div className="mb-2 text-xs uppercase tracking-wide text-slate-400 ">
        변화도
      </div>
      <div className="flex flex-wrap gap-2">
        {changes.map(({ key, data }) => {
          const sign =
            typeof data.pct === "number"
              ? data.pct > 0
                ? "pos"
                : data.pct < 0
                ? "neg"
                : "neutral"
              : "neutral";
          const color =
            sign === "pos"
              ? "border-[rgba(16,185,129,0.35)] bg-[rgba(16,185,129,0.12)] text-emerald-100"
              : sign === "neg"
              ? "border-[rgba(248,113,113,0.35)] bg-[rgba(248,113,113,0.12)] text-rose-100"
              : "border-[rgba(148,163,184,0.25)] bg-[rgba(148,163,184,0.12)] text-slate-200";
          const arrow = sign === "pos" ? "▲" : sign === "neg" ? "▼" : "■";
          const pctStr =
            typeof data.pct === "number" ? formatPercent(data.pct) : "—";
          const absStr =
            typeof data.abs === "number"
              ? `${data.abs >= 0 ? "+" : "-"}${Math.abs(
                  data.abs
                ).toLocaleString("en-US", {
                  maximumFractionDigits: (data.latest ?? 0) >= 1 ? 3 : 6,
                })} USD`
              : undefined;
          const baseLatestStr =
            typeof data.base === "number" && typeof data.latest === "number"
              ? `${formatPriceShort(data.base)} → ${formatPriceShort(
                  data.latest
                )}`
              : undefined;
          return (
            <div
              key={key}
              className={`inline-flex items-baseline gap-2 rounded-full border px-3 py-2 text-sm ${color}`}
            >
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-300">
                {key}
              </span>
              <span className="font-semibold">
                {arrow} {pctStr}
              </span>
              {baseLatestStr ? (
                <span className="text-xs text-slate-300">
                  · {baseLatestStr}
                </span>
              ) : null}
              {absStr ? (
                <span className="text-xs text-slate-300"> ({absStr})</span>
              ) : null}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ReportChangeMetrics;
