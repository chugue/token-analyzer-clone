import { useEffect, useState } from "react";

const useDebounced = (ticker: string, delay: number) => {
  const [debouncedTicker, setDebouncedTicker] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedTicker(ticker);
    }, delay);

    return () => clearTimeout(timer);
  }, [ticker]);

  return debouncedTicker;
};

export default useDebounced;
