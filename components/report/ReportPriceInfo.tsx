import useReportStore from "@/lib/store/report-store";
import { DetailedReport } from "@/lib/types/report.t";
import { formatUsd } from "@/lib/utils";
import { useMemo } from "react";

const ReportPriceInfo = ({ report }: { report: DetailedReport }) => {
  const price = report.metrics.price ?? {};
  const { marketData } = useReportStore();

  const chartData = marketData;

  const latestPrice = useMemo(() => {
    if (chartData.length) return chartData[chartData.length - 1].price;
    return typeof price.latest === "number" ? price.latest : undefined;
  }, [chartData, price.latest]);

  return (
    <div className="text-sm text-slate-400">
      <div>업데이트 {new Date(report.createdAt).toLocaleString()}</div>
      <div className="mt-1 text-slate-300">
        현재가{" "}
        <span className="font-semibold text-slate-100">
          {formatUsd(latestPrice)}
        </span>
      </div>
    </div>
  );
};

export default ReportPriceInfo;
