import { DetailedReport } from "../types/report.t";

interface ReportStore {
  report: DetailedReport | null;
  isReportLoading: boolean;
  hasReportError: string | null;
}
