import { create } from "zustand";
import { TickerMetaData } from "../types/ticker";

interface TickerStore {
  ticker: string;
  pickedTicker: TickerMetaData | null;
  searchResults: TickerMetaData[];
  debouncedTicker: string;
  isSearching: boolean;
  setIsSearching: (isSearching: boolean) => void;
  setDebouncedTicker: (debouncedTicker: string) => void;
  setSearchResults: (searchResults: TickerMetaData[]) => void;
  setPickedTicker: (ticker: TickerMetaData) => void;
  setTicker: (ticker: string) => void;
}

const useTickerStore = create<TickerStore>((set) => ({
  ticker: "",
  pickedTicker: null,
  searchResults: [],
  debouncedTicker: "",
  isSearching: false,
  setIsSearching: (isSearching: boolean) => set({ isSearching }),
  setDebouncedTicker: (debouncedTicker: string) => set({ debouncedTicker }),
  setSearchResults: (searchResults: TickerMetaData[]) => set({ searchResults }),
  setPickedTicker: (ticker: TickerMetaData) => set({ pickedTicker: ticker }),
  setTicker: (ticker: string) => set({ ticker }),
}));

export default useTickerStore;
