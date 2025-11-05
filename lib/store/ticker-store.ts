import { create } from "zustand";
import { TickerMetaData } from "../types/ticker.t";

interface TickerStore {
  ticker: string;
  pickedTicker: TickerMetaData | null;
  suggestions: TickerMetaData[];
  debouncedTicker: string;
  isSuggesting: boolean;
  hasSuggestions: boolean;
  suggestionError: string;

  setSuggestionError: (suggestionError: string) => void;
  setIsSuggesting: (isSuggesting: boolean) => void;
  setHasSuggestions: (hasSuggestions: boolean) => void;
  setDebouncedTicker: (debouncedTicker: string) => void;
  setSuggestions: (suggestions: TickerMetaData[]) => void;
  setPickedTicker: (ticker: TickerMetaData) => void;
  setTicker: (ticker: string) => void;
}

const useTickerStore = create<TickerStore>((set) => ({
  ticker: "",
  pickedTicker: null,
  // TODO: API 구현되면 바꿔야 됨
  suggestions: [],
  debouncedTicker: "",
  isSuggesting: false,
  suggestionError: "",
  hasSuggestions: false,

  setSuggestionError: (suggestionError: string) => set({ suggestionError }),
  setIsSuggesting: (isSuggesting: boolean) => set({ isSuggesting }),
  setHasSuggestions: (hasSuggestions: boolean) => set({ hasSuggestions }),
  setDebouncedTicker: (debouncedTicker: string) => set({ debouncedTicker }),
  setSuggestions: (searchResults: TickerMetaData[]) =>
    set({ suggestions: searchResults }),
  setPickedTicker: (ticker: TickerMetaData) => set({ pickedTicker: ticker }),
  setTicker: (ticker: string) => set({ ticker }),
}));

export default useTickerStore;
