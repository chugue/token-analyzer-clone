import { useEffect, useRef } from "react";

const useRootpageRefs = () => {
  const eventSourceRef = useRef<EventSource | null>(null);
  const smoothProgressRef = useRef<NodeJS.Timeout | null>(null);
  const searchControllerRef = useRef<AbortController | null>(null);
  const lastSelectedSymbolRef = useRef<string | null>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    return () => {
      if (eventSourceRef.current) {
        eventSourceRef.current.close();
      }
      if (smoothProgressRef.current) {
        clearInterval(smoothProgressRef.current);
      }
      if (searchControllerRef.current) {
        searchControllerRef.current.abort();
      }
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  return {
    eventSourceRef,
    smoothProgressRef,
    searchControllerRef,
    lastSelectedSymbolRef,
    searchTimeoutRef,
  };
};

export default useRootpageRefs;
