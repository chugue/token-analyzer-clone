import { redis } from "../redis";
import { HEAT_HIST_KEY, HEAT_STATS_KEY, HeatStats } from "../types/heat";

export async function loadHeatStats(): Promise<HeatStats | null> {
  const histData = await redis.hgetall<Record<string, unknown>>(HEAT_HIST_KEY);

  if (!histData || Object.keys(histData).length === 0) {
    return null;
  }

  const bucketMap = new Map<number, number>();
  let sum = 0;

  for (const [field, raw] of Object.entries(histData)) {
    const match = field.match(/^b(-?\d+)$/);

    if (!match) continue;
    const index = Number(match[1]);
    const count = toNumber(raw);
    if (typeof index === "number" && typeof count === "number") {
      if (count <= 0) continue;
      bucketMap.set(index, count);
      sum += count;
    }
  }

  if (bucketMap.size === 0) {
    return null;
  }

  const statsData = await redis.hgetall<Record<string, unknown>>(
    HEAT_STATS_KEY
  );
  const min = toNumber(statsData?.min) ?? Number.POSITIVE_INFINITY;
  const max = toNumber(statsData?.max) ?? 0;
  const total = toNumber(statsData?.total) ?? sum;

  return {
    total,
    min: Number.isFinite(min) ? min : 0,
    max,
    buckets: bucketMap,
  };
}

function toNumber(value: unknown): number | undefined {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }

  return undefined;
}
