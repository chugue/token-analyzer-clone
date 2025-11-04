import { create } from "zustand";
import { tickerMetaData } from "../mock-data/ticker-meta-data";
import { TickerMetaData } from "../types/ticker.t";

interface TickerStore {
  ticker: string;
  pickedTicker: TickerMetaData | null;
  suggestions: TickerMetaData[];
  debouncedTicker: string;
  isSuggesting: boolean;
  suggestionError: Error | null;
  setSuggestionError: (error: Error | null) => void;
  setIsSuggesting: (isSuggesting: boolean) => void;
  setDebouncedTicker: (debouncedTicker: string) => void;
  setSuggestions: (suggestions: TickerMetaData[]) => void;
  setPickedTicker: (ticker: TickerMetaData) => void;
  setTicker: (ticker: string) => void;
}

const useTickerStore = create<TickerStore>((set) => ({
  ticker: "",
  pickedTicker: null,
  // TODO: API 구현되면 바꿔야 됨
  suggestions: tickerMetaData,
  debouncedTicker: "",
  isSuggesting: false,
  suggestionError: null,
  setSuggestionError: (error: Error | null) => set({ suggestionError: error }),
  setIsSuggesting: (isSuggesting: boolean) => set({ isSuggesting }),
  setDebouncedTicker: (debouncedTicker: string) => set({ debouncedTicker }),
  setSuggestions: (searchResults: TickerMetaData[]) =>
    set({ suggestions: searchResults }),
  setPickedTicker: (ticker: TickerMetaData) => set({ pickedTicker: ticker }),
  setTicker: (ticker: string) => set({ ticker }),
}));

export default useTickerStore;
