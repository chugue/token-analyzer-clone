"use client";

import ReportError from "@/components/report/ReportError";
import ReportHeroHeader from "@/components/report/ReportHeroHeader";
import ReportLoading from "@/components/report/ReportLoading";
import ReportNoResults from "@/components/report/ReportNoResults";
import useMemoReportData from "@/lib/hooks/use-memoised-report";
import useReportStore from "@/lib/store/report-store";
import { useParams } from "next/navigation";

const ReportDetailPage = () => {
  const params = useParams();
  const reportId = params?.reportId as string | undefined;

  const { report, isReportLoading, reportError } = useReportStore();
  const { timeline, sortedTopics } = useMemoReportData(report);

  return (
    <main
      className="min-h-screen bg-[#0f172a] text-slate-100"
      style={{
        background: "radial-gradient(circle at top left, #1e293b, #0f172a 60%)",
      }}
    >
      {isReportLoading ? (
        <ReportLoading />
      ) : reportError !== null ? (
        <ReportError error={reportError} />
      ) : report ? (
        <ReportNoResults />
      ) : (
        <div className="bg-blue-500 max-w-6xl mx-auto min-h-screen py-10 px-4">
          <div className="grid grid-cols-[2fr,1fr] gap-6">
            <ReportHeroHeader report={report} />
            <div></div>
          </div>
        </div>
      )}
    </main>
  );
};

export default ReportDetailPage;
