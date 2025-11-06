import { create } from "zustand";
import { reportMockData } from "../mock-data/report-mock-data";
import { DetailedReport } from "../types/report.t";

interface ReportStore {
  report: DetailedReport | null;
  isReportLoading: boolean;
  reportError: string | null;
  marketData: { time: number; price: number; volume?: number }[];

  setReport: (report: DetailedReport | null) => void;
  setIsReportLoading: (isLoading: boolean) => void;
  setReportError: (error: string | null) => void;
  setMarketData: (
    marketData: { time: number; price: number; volume?: number }[]
  ) => void;
}

const useReportStore = create<ReportStore>((set) => ({
  report: reportMockData as DetailedReport,
  isReportLoading: false,
  reportError: null,
  marketData: [],

  setReport: (report: DetailedReport | null) => set({ report }),
  setIsReportLoading: (isLoading: boolean) =>
    set({ isReportLoading: isLoading }),
  setReportError: (error: string | null) => set({ reportError: error }),
  setMarketData: (
    marketData: { time: number; price: number; volume?: number }[]
  ) => set({ marketData }),
}));

export default useReportStore;
