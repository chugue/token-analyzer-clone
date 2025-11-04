import { useEffect, useState } from "react";
import { tickerSearchResultMockData } from "../mock-data/ticker-meta-data";
import { TickerMetaData } from "../types/ticker";

const useDebouncedSearch = (ticker: string, delay: number = 500) => {
  const [debouncedTicker, setDebouncedTicker] = useState("");
  const [searchResults, setSearchResults] = useState<TickerMetaData[]>([]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTicker(ticker);
      setSearchResults(tickerSearchResultMockData);
    }, delay);

    return () => clearTimeout(timer);
  }, [ticker, delay]);

  return { debouncedTicker, searchResults, setSearchResults };
};

export default useDebouncedSearch;
