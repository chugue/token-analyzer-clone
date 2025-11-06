"use client";

import ReportHeroHeader from "@/components/report/ReportHeroHeader";
import useMemoReportData from "@/lib/hooks/use-memoised-report";
import useRequestReport from "@/lib/hooks/use-request-report";
import { reportMockData } from "@/lib/mock-data/report-mock-data";
import useReportStore from "@/lib/store/report-store";
import { DetailedReport } from "@/lib/types/report.t";
import { useParams } from "next/navigation";

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;

  const { report, isReportLoading, reportError } = useReportStore();
  const { timeline, sortedTopics } = useMemoReportData(report);
  useRequestReport(reportId);

  return (
    <main
      className="min-h-screen bg-[#0f172a] text-slate-100"
      style={{
        background: "radial-gradient(circle at top left, #1e293b, #0f172a 60%)",
      }}
    >
      {/* {isReportLoading ? (
        <ReportLoading />
      ) : reportError !== null ? (
        <ReportError error={reportError} />
      ) : // TODO: 이거 ui구현후에 report === null로 변경해야함
      report === null ? (
        <ReportNoResults />
      ) : ( */}
      <div className="bg-blue-500 max-w-6xl mx-auto min-h-screen py-10 px-4">
        <div className="grid grid-cols-[2fr,1fr] gap-6">
          <ReportHeroHeader
            report={report ?? (reportMockData as unknown as DetailedReport)}
          />
          <div></div>
        </div>
      </div>
      {/* )} */}
    </main>
  );
};

export default ReportDetailPage;
