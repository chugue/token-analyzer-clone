const vercelUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : undefined;
const publicBaseDefault =
  process.env.NEXT_PUBLIC_PUBLIC_BASE_URL ||
  "https://report.beam.dcentwallet.com";

export const CONFIG = {
  APP: {
    PUBLIC_BASE_URL: vercelUrl || publicBaseDefault,
    INTERNAL_BASE_URL: vercelUrl || process.env.INTERNAL_BASE_URL,
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || publicBaseDefault,
    GTM_ID: process.env.NEXT_PUBLIC_GTM_ID,
    DEFAULT_LOCALE: "ko",
  },
  CACHE_TTL: {
    REPORT_DATA: 60 * 60 * 24 * 30, // 30일
    I2I_IMAGE: 60 * 60 * 24 * 30, // 30일 캐시 (기본)
    LLM_TWO_LINE_SUMMARY: 60 * 60 * 24 * 7, // 7일
  },

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
  I2I: {
    BASE_DIR: process.env.I2I_BASE_DIR || "public/i2i/base",
    EN_DIR: process.env.I2I_EN_DIR || "public/i2i/en",
    GOOGLE_API_KEY: process.env.GOOGLE_API_KEY,
    MODEL: process.env.I2I_MODEL || "gemini-2.5-flash-image",
  },
};
