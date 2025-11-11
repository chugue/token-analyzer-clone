import { Redis } from "@upstash/redis";

if (
  !process.env.UPSTASH_REDIS_REST_URL ||
  !process.env.UPSTASH_REDIS_REST_TOKEN
) {
  throw new Error(
    "Upstash Redis credentials not found in environment variables"
  );
}

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN,
});

export const cacheKeys = {
  report: (reportId: string) => `report:${reportId}`,

  reportEn: (reportId: string) => `report:en:${reportId}`,

  reportIndex: (symbol: string) => `report-index:${symbol.toLowerCase()}`,

  i2iImage: (hash: string) => `i2i:image:${hash}`,
};
