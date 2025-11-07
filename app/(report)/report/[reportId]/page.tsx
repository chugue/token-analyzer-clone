"use client";

import ReportError from "@/components/report/ReportError";
import ReportHeroHeader from "@/components/report/ReportHeroHeader";
import ReportLoading from "@/components/report/ReportLoading";
import ReportNoResults from "@/components/report/ReportNoResults";
import ReportSnapshot from "@/components/report/ReportSnapshot";
import ReportSummaryBar from "@/components/report/ReportSummaryBar";
import InsightsTabs from "@/components/report/insights/InsightsTabs";
import TimelineSection from "@/components/report/topics/TimelineSection";

import TopicSection from "@/components/report/topics/TopicSection";

import useReportStore from "@/lib/store/report-store";
import { useParams } from "next/navigation";

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;

  const { report, isReportLoading, reportError } = useReportStore();

  // const reportData = reportMockData as DetailedReport;

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
          <div className="mt-8 grid gap-6 grid-cols-[3fr_2fr]">
            <TopicSection report={report} />
            <TimelineSection report={report} />
          </div>
          <ReportSnapshot report={report} />
        </div>
      )}
    </main>
  );
};

export default ReportDetailPage;
