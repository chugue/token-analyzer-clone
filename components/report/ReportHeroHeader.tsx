import { reportMockData } from "@/lib/mock-data/report-mock-data";
import { DetailedReport } from "@/lib/types/report.t";
import ReportChangeMetrics from "./ReportChangeMetrics";
import ReportPriceInfo from "./ReportPriceInfo";
import ReportTooltipButton from "./ReportTooltipButton";
import ChartMarket from "./chart/ChartMarket";

const HeroHeader = ({ report }: { report: DetailedReport }) => {
  return (
    <section
      id="hero"
      className="rounded-[20px] border border-white/5 bg-[rgba(15,23,42,0.85)] p-6 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur"
    >
      <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
        <div>
          <h1 className="text-3xl font-semibold text-slate-100">
            {report.meta.symbol} · {report.meta.name}
          </h1>
          <ReportTooltipButton
            report={report ?? (reportMockData as unknown as DetailedReport)}
          />
        </div>
        <ReportPriceInfo report={report} />
      </div>
      <ReportChangeMetrics report={report} />
      <ChartMarket report={report} />
    </section>
  );
};

export default HeroHeader;
