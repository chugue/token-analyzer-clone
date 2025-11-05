import { useEffect, useRef } from "react";

import useTickerStore from "../store/ticker-store";
import { TickerMetaData } from "../types/ticker.t";

const useDebouncedSearch = (ticker: string, delay: number = 500) => {
  const searchControllerRef = useRef<AbortController | null>(null);

  const {
    debouncedTicker,
    setIsSuggesting,
    setDebouncedTicker,
    setHasSuggestions,
    setSuggestionError,
    setSuggestions,
  } = useTickerStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTicker(ticker);
    }, delay);

    return () => clearTimeout(timer);
  }, [ticker]);

  useEffect(() => {
    if (!debouncedTicker || debouncedTicker.length === 0) return;
    if (searchControllerRef.current) {
      searchControllerRef.current.abort();
    }

    const controller = new AbortController();
    searchControllerRef.current = controller;

    const fetchSuggestions = async () => {
      try {
        setIsSuggesting(true);
        setHasSuggestions(false);
        setSuggestionError("");

        const response = await fetch(
          `/api/meta/search?query=${encodeURIComponent(debouncedTicker)}`,
          {
            signal: controller.signal,
          }
        );

        if (!response.ok) {
          const payload = await response.json().catch(() => ({}));
          const message =
            typeof payload?.message === "string"
              ? payload.message
              : "Failed to search token metadata";
          throw new Error(message);
        }

        const payload = await response.json();
        const items: TickerMetaData[] = Array.isArray(payload?.data)
          ? payload.data
          : [];

        setSuggestions(items);
        setHasSuggestions(items.length > 0);
      } catch (error: unknown) {
        if (error instanceof Error && error.name === "AbortError") return;

        const errorMessage =
          error instanceof Error
            ? error.message
            : "Failed to search token metadata";

        setSuggestionError(errorMessage);
        setSuggestions([]);
        setHasSuggestions(false);
        console.log(errorMessage);
      } finally {
        setIsSuggesting(false);
      }
    };

    fetchSuggestions();
  }, [debouncedTicker]);

  return;
};

export default useDebouncedSearch;
