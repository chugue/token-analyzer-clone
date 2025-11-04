import { TickerMetaData } from "./ticker.t";

export interface CoingeckoSearchCandidate
  extends Omit<TickerMetaData, "source"> {
  source: "coingecko";
}

export interface CoingeckoCacheEntry {
  fetchedAt: number;
  query: string;
  results: CoingeckoSearchCandidate[];
}

export interface RawSearchResponse {
  coins?: Array<{ [key: string]: unknown }>;
}

export interface RawCoinEntry {
  id?: unknown;
  symbol?: unknown;
  name?: unknown;
  market_cap_rank?: unknown;
}
