import useReportStore from "@/lib/store/report-store";
import { DetailedReport } from "@/lib/types/report.t";
import { formatUsd } from "@/lib/utils";
import { useMemo } from "react";

const ReportPriceInfo = ({ report }: { report: DetailedReport }) => {
  const price = report.metrics.price ?? {};
  const { marketData } = useReportStore();

  const latestPrice = useMemo(() => {
    if (marketData.length) return marketData[marketData.length - 1].price;
    return typeof price.latest === "number" ? price.latest : undefined;
  }, [marketData, price.latest]);

  return (
    <div className="text-sm text-slate-400">
      <div>업데이트 {new Date(report.createdAt).toLocaleString("ko-KR")}</div>
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
