import { useEffect } from "react";
import { tickerMetaData } from "../mock-data/ticker-meta-data";

import useTickerStore from "../store/ticker-store";

const useDebouncedSearch = (ticker: string, delay: number = 500) => {
  const { setDebouncedTicker, setSuggestions: setSearchResults } =
    useTickerStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTicker(ticker);
      setSearchResults(tickerMetaData);
    }, delay);

    return () => clearTimeout(timer);
  }, [ticker, delay, setDebouncedTicker, setSearchResults]);

  return;
};

export default useDebouncedSearch;
