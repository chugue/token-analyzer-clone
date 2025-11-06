import { useEffect } from "react";
import { requestReport } from "../helpers/report-helpers";
import useReportStore from "../store/report-store";

const useRequestReport = ({ reportId }: { reportId: string }) => {
  const { report, setReport, setIsReportLoading, setReportError } =
    useReportStore();

  useEffect(() => {
    if (!reportId) {
      setReportError("Report ID is required");
      setIsReportLoading(false);
      setReport(null);
      return;
    }

    const cancelled = false;

    const fetchReport = async () => {
      setReport(report ? { ...report } : null);
      setIsReportLoading(true);
      setReportError(null);

      try {
        const data = await requestReport(reportId);
        if (!cancelled) {
        }
      } catch (error) {
        console.log(error);
      }
    };
  });

  return;
};

export default useRequestReport;
