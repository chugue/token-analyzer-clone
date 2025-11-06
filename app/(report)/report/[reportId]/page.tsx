"use client";

import ReportError from "@/components/report/ReportError";
import ReportHeroHeader from "@/components/report/ReportHeroHeader";
import ReportLoading from "@/components/report/ReportLoading";
import ReportNoResults from "@/components/report/ReportNoResults";
import ReportSummaryBar from "@/components/report/ReportSummaryBar";
import InsightsTabs from "@/components/report/insights/InsightsTabs";
import useMemoReportData from "@/lib/hooks/use-memoised-report";
import useReportStore from "@/lib/store/report-store";
import { useParams } from "next/navigation";

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;

  const { report, isReportLoading, reportError } = useReportStore();

  // const reportData = reportMockData as DetailedReport;

  const { timeline, sortedTopics } = useMemoReportData(report);
  // useRequestReport(reportId);

  return (
    <main>
      {isReportLoading ? (
        <ReportLoading />
      ) : reportError ? (
        <ReportError error={reportError} />
      ) : !report ? (
        <ReportNoResults />
      ) : (
        <div className="mx-auto max-w-6xl px-4 py-10 md:px-8">
          <ReportSummaryBar report={report} />
          <div className="grid grid-cols-[2fr_1fr] gap-6">
            <ReportHeroHeader report={report} />
            <InsightsTabs report={report} />
          </div>
        </div>
      )}
    </main>
  );
};

export default ReportDetailPage;
