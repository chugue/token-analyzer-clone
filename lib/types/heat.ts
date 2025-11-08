export const HEAT_STATS_KEY = "heat:stats";
export const HEAT_HIST_KEY = "heat:hist";

export interface HeatStats {
  total: number;
  min: number;
  max: number;
  buckets: Map<number, number>;
}
