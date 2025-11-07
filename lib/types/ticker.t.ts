export type TickerSource = "coingecko" | "coinmarketcap";

export interface TickerMetaData {
  source: TickerSource;
  sourceId: number;
  ticker: string;
  rank: number;
  name: string;
  slug: string;
}

export interface ProgressState {
  status: string;
  progress: number;
  details?: string;
  completed?: boolean;
  reportId?: string;
  error?: string;
}
