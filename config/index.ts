export const CONFIG = {
  COINGECKO: {
    API_BASE:
      process.env.COINGECKO_API_BASE || "https://api.coingecko.com/api/v3",
    VS_CURRENCY: "usd",
    MARKET_CHART: {
      DAYS: 7,
      INTERVAL_MINUTES: 60,
      CHART_WINDOW_HOURS: 72,
    },
  },
};
