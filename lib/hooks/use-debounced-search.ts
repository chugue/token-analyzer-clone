import { useEffect } from "react";

import useTickerStore from "../store/ticker-store";
import { TickerMetaData } from "../types/ticker.t";

const useDebouncedSearch = (
  delay: number = 500,
  searchControllerRef: React.RefObject<AbortController | null>,
  searchTimeoutRef: React.RefObject<NodeJS.Timeout | null>,
  lastSelectedSymbolRef: React.RefObject<string | null>
) => {
  const {
    pickedTicker,
    ticker,
    setIsSuggesting,
    setHasSuggestions,
    setSuggestionError,
    setSuggestions,
  } = useTickerStore();

  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (pickedTicker) {
      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
        searchControllerRef.current = null;
      }
      setIsSuggesting(false);
      setHasSuggestions(false);
      return;
    }

    const trimmed = ticker.trim();

    if (
      lastSelectedSymbolRef.current &&
      trimmed === lastSelectedSymbolRef.current
    ) {
      lastSelectedSymbolRef.current = null;
      setSuggestions([]);
      setSuggestionError("");
      setIsSuggesting(false);
      setHasSuggestions(false);

      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
        searchControllerRef.current = null;
      }
      return;
    }

    if (!trimmed) {
      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
        searchControllerRef.current = null;
      }
      setSuggestions([]);
      setSuggestionError("");
      setIsSuggesting(false);
      setHasSuggestions(false);
      return;
    }

    searchTimeoutRef.current = setTimeout(async () => {
      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
      }
      const controller = new AbortController();
      searchControllerRef.current = controller;
      setIsSuggesting(true);
      setHasSuggestions(false);
      setSuggestionError("");

      try {
        const response = await fetch(
          `/api/meta/search?query=${encodeURIComponent(trimmed)}`,
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
      } finally {
        setIsSuggesting(false);
      }
    }, delay);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [ticker, pickedTicker]);
};
export default useDebouncedSearch;
