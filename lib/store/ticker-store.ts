import { create } from "zustand";
import { ProgressState, TickerMetaData } from "../types/ticker.t";

interface TickerStore {
  ticker: string;
  pickedTicker: TickerMetaData | null;
  suggestions: TickerMetaData[];
  debouncedTicker: string;
  isSuggesting: boolean;
  hasSuggestions: boolean;
  suggestionError: string;
  progress: ProgressState | null;
  isAnalyzing: boolean;
  analysisError: string;
  displayProgress: number;
  source: "coingecko" | "coinmarketcap";
  name: string;
  slug: string;
  sourceId: string;
  rank: string;

  setIsAnalyzing: (isAnalyzing: boolean) => void;
  setAnalysisError: (analysisError: string) => void;
  setSuggestionError: (suggestionError: string) => void;
  setIsSuggesting: (isSuggesting: boolean) => void;
  setHasSuggestions: (hasSuggestions: boolean) => void;
  setDebouncedTicker: (debouncedTicker: string) => void;
  setSuggestions: (suggestions: TickerMetaData[]) => void;
  setPickedTicker: (ticker: TickerMetaData) => void;
  setTicker: (ticker: string) => void;
  setProgress: (progress: ProgressState | null) => void;
  setDisplayProgress: (
    displayProgress: number | ((prev: number) => number)
  ) => void;
  setSource: (source: "coingecko" | "coinmarketcap") => void;
  setName: (name: string) => void;
  setSlug: (slug: string) => void;
  setSourceId: (sourceId: string) => void;
  setRank: (rank: string) => void;
}

const useTickerStore = create<TickerStore>((set) => ({
  ticker: "",
  pickedTicker: null,
  suggestions: [],
  debouncedTicker: "",
  isSuggesting: false,
  suggestionError: "",
  hasSuggestions: false,
  progress: null,
  isAnalyzing: false,
  analysisError: "",
  displayProgress: 0,
  source: "coingecko",
  name: "",
  slug: "",
  sourceId: "",
  rank: "",
  setName: (name: string) => set({ name }),
  setSlug: (slug: string) => set({ slug }),
  setSourceId: (sourceId: string) => set({ sourceId }),
  setRank: (rank: string) => set({ rank }),
  setAnalysisError: (analysisError: string) => set({ analysisError }),
  setIsAnalyzing: (isAnalyzing: boolean) => set({ isAnalyzing }),
  setSuggestionError: (suggestionError: string) => set({ suggestionError }),
  setIsSuggesting: (isSuggesting: boolean) => set({ isSuggesting }),
  setHasSuggestions: (hasSuggestions: boolean) => set({ hasSuggestions }),
  setDebouncedTicker: (debouncedTicker: string) => set({ debouncedTicker }),
  setSuggestions: (searchResults: TickerMetaData[]) =>
    set({ suggestions: searchResults }),
  setPickedTicker: (ticker: TickerMetaData) => set({ pickedTicker: ticker }),
  setTicker: (ticker: string) => set({ ticker }),
  setProgress: (progress: ProgressState | null) => set({ progress }),
  setDisplayProgress: (displayProgress: number | ((prev: number) => number)) =>
    set((state) => ({
      displayProgress:
        typeof displayProgress === "function"
          ? displayProgress(state.displayProgress)
          : displayProgress,
    })),
  setSource: (source: "coingecko" | "coinmarketcap") => set({ source }),
}));

export default useTickerStore;
