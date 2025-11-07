export const startSmoothProgress = (
  targetProgress: number,
  smoothProgressRef: React.RefObject<NodeJS.Timeout | null>,
  setDisplayProgress: (
    displayProgress: number | ((prev: number) => number)
  ) => void
) => {
  if (smoothProgressRef.current) {
    clearInterval(smoothProgressRef.current);
  }

  smoothProgressRef.current = setInterval(() => {
    setDisplayProgress((current) => {
      const diff = targetProgress - current;
      if (Math.abs(diff) < 0.5) {
        if (smoothProgressRef.current) {
          clearInterval(smoothProgressRef.current);
        }
        return targetProgress;
      }

      // 천천히 목표값으로 수렴 (절대 초과하지 않음)
      const increment = Math.max(0.3, diff * 0.1);
      return Math.min(current + increment, targetProgress);
    });
  }, 50);
};
