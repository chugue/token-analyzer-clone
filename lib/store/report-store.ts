import { create } from "zustand";
import { DetailedReport } from "../types/report.t";

interface ReportStore {
  report: DetailedReport | null;
  isReportLoading: boolean;
  reportError: string | null;

  setReport: (report: DetailedReport | null) => void;
  setIsReportLoading: (isLoading: boolean) => void;
  setReportError: (error: string | null) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  report: null,
  isReportLoading: false,
  reportError: null,

  setReport: (report: DetailedReport | null) => set({ report }),
  setIsReportLoading: (isLoading: boolean) =>
    set({ isReportLoading: isLoading }),
  setReportError: (error: string | null) => set({ reportError: error }),
}));

export default useReportStore;
