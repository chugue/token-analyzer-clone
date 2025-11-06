import { TooltipProps } from "recharts";

type ChartTooltipPayload = TooltipProps<number, string> & {
  payload?: Array<{
    payload: { time: number; price: number; volume?: number };
  }>;
};

const ChartTooltip = ({ active, payload }: ChartTooltipPayload) => {
  if (!active || !payload || payload.length === 0) {
    return null;
  }

  const { time, price, volume } = payload[0].payload as {
    time: number;
    price: number;
    volume: number;
  };
  const date = new Date(time);
  const timeLabel = date.toLocaleString("ko-KR", {
    month: "numeric",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="rounded-lg border border-white/10 bg-slate-900/90 px-3 py-2 text-xs text-slate-100 shadow-xl">
      <div className="font-semibold text-slate-200">{timeLabel}</div>
      <div className="mt-1 text-sky-200">
        가격 {price.toLocaleString("ko-KR", { maximumFractionDigits: 4 })} USD
      </div>
      <div className="text-slate-300">
        거래량 {volume.toLocaleString("ko-KR")}
      </div>
    </div>
  );
};

export default ChartTooltip;
