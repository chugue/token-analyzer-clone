export type TickerSource = "coingecko" | "coinmarketcap";

export interface TickerMetaData {
  source: TickerSource;
  sourceId: number;
  ticker: string;
  rank: number;
  name: string;
  slug: string;
}
