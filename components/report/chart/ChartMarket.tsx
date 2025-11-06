import useReportStore from "@/lib/store/report-store";
import { DetailedReport } from "@/lib/types/report.t";
import { priceTickFormatter } from "@/lib/utils";
import { useEffect, useMemo } from "react";
import {
  Area,
  Bar,
  CartesianGrid,
  ComposedChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import ChartTooltip from "./ChartTooltip";

const ChartMarket = ({ report }: { report: DetailedReport }) => {
  const { marketData, setMarketData } = useReportStore();

  const hasChart = marketData.length >= 2;

  const latestChartTimestamp = marketData.length
    ? marketData[marketData.length - 1].time
    : undefined;

  const earliestChartTimestamp = marketData.length
    ? marketData[0].time
    : undefined;

  const dayMs = 24 * 60 * 60 * 1000;

  const fixedAxisTicks = useMemo(() => {
    if (!latestChartTimestamp) return [] as number[];
    const ticks: number[] = [];
    for (let daysAgo = 6; daysAgo >= 0; daysAgo -= 1) {
      const t = latestChartTimestamp - daysAgo * dayMs;
      if (earliestChartTimestamp && t < earliestChartTimestamp) continue;
      ticks.push(t);
    }
    return ticks;
  }, [latestChartTimestamp, earliestChartTimestamp]);

  const volumeDomain = useMemo(() => {
    if (!marketData.length) {
      return [0, 0];
    }
    const volumes = marketData.map((point) => point.volume ?? 0);
    const max = Math.max(...volumes, 0);
    return [0, max === 0 ? 1 : max * 1.2];
  }, [marketData]);

  const priceDomain = useMemo(() => {
    if (!marketData.length) {
      return [0, 0];
    }
    const prices = marketData.map((point) => point.price);
    const min = Math.min(...prices);
    const max = Math.max(...prices);
    const padding = (max - min) * 0.05 || min * 0.05 || 1;
    return [min - padding, max + padding];
  }, [marketData]);

  useEffect(() => {
    let active = true;
    const slug = report.resolvedMeta?.coingeckoId ?? report.meta.slug;

    const load = async () => {
      try {
        const res = await fetch(
          `/api/market/${encodeURIComponent(slug)}?window=7d`,
          { cache: "no-store" }
        );

        if (!res.ok) return;

        const json = await res.json();
        console.log(`🔍 마켓 데이터 응답: ${slug}`, json.data);
        const pts = Array.isArray(json?.data?.points) ? json.data.points : [];
        const mapped = pts.map((p: { t: number; c: number; v?: number }) => ({
          time: p.t,
          price: p.c,
          volume: p.v ?? 0,
        }));
        if (active) setMarketData(mapped);
      } catch (error) {
        console.log(error);
      }
    };
    load();
    const id = setInterval(load, 60_000);

    return () => {
      active = false;
      clearInterval(id);
    };
  }, [report.resolvedMeta?.coingeckoId, report.meta?.slug]);

  return (
    <div className="mt-6">
      <div className="rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.75)] p-4 shadow-inner shadow-[rgba(15,23,42,0.35)]">
        {hasChart ? (
          <div className="relative h-[200px] w-full overflow-hidden rounded-[14px] bg-[#0f172a]">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={marketData}
                margin={{ top: 10, right: 12, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient
                    id="priceGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#38bdf8" stopOpacity={0.45} />
                    <stop
                      offset="100%"
                      stopColor="#38bdf8"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                  <linearGradient
                    id="volumeGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="0%" stopColor="#6366f1" stopOpacity={0.6} />
                    <stop
                      offset="100%"
                      stopColor="#6366f1"
                      stopOpacity={0.05}
                    />
                  </linearGradient>
                </defs>
                <CartesianGrid
                  stroke="rgba(148,163,184,0.12)"
                  vertical={false}
                />
                <XAxis
                  dataKey="time"
                  type="number"
                  domain={["dataMin", "dataMax"]}
                  ticks={fixedAxisTicks.length ? fixedAxisTicks : undefined}
                />
                <YAxis yAxisId="volume" domain={volumeDomain} hide />
                <YAxis
                  yAxisId="price"
                  orientation="right"
                  domain={priceDomain}
                  stroke="#94a3b8"
                  tickFormatter={priceTickFormatter}
                  tick={{ fontSize: 12 }}
                  width={70}
                />
                <Tooltip
                  content={<ChartTooltip />}
                  cursor={{ stroke: "rgba(148,163,184,0.25)" }}
                />
                <Bar
                  yAxisId="volume"
                  dataKey="volume"
                  fill="url(#volumeGradient)"
                  barSize={6}
                  radius={[6, 6, 0, 0]}
                />
                <Area
                  yAxisId="price"
                  type="monotone"
                  dataKey="price"
                  stroke="#38bdf8"
                  strokeWidth={2}
                  fill="url(#priceGradient)"
                  dot={false}
                />
              </ComposedChart>
            </ResponsiveContainer>

            <div className="pointer-events-none absolute right-2 top-2 rounded-full border border-white/10 bg-white/10 px-2 py-0.5 text-[11px] font-semibold text-slate-100">
              7D
            </div>
          </div>
        ) : (
          <div className="flex h-64 items-center justify-center text-sm text-slate-500">
            차트 데이터가 충분하지 않습니다.
          </div>
        )}
      </div>
    </div>
  );
};

export default ChartMarket;
