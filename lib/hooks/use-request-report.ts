import { useEffect } from "react";
import { requestReport } from "../helpers/report-helpers.client";
import useReportStore from "../store/report-store";

const useRequestReport = (reportId: string | undefined) => {
  const { report, setReport, setIsReportLoading, setReportError } =
    useReportStore();

  useEffect(() => {
    if (!reportId) {
      setReportError("Report ID is required");
      setIsReportLoading(false);
      // setReport(null);
      return;
    }

    let cancelled = false;

    const fetchReport = async () => {
      setReport(report ?? null);
      setIsReportLoading(true);
      setReportError(null);

      try {
        const data = await requestReport(reportId);
        if (cancelled) return;

        setReport(data);
        setIsReportLoading(false);
        setReportError(null);
      } catch (error) {
        if (cancelled) return;

        setReportError((error as Error).message);
        setIsReportLoading(false);
        setReport(null);
      }
    };

    fetchReport();

    return () => {
      cancelled = true;
    };
  }, [reportId]);

  return;
};

export default useRequestReport;
