export interface DetailedReport {
  reportId: string;
  createdAt: string;
  metrics: {
    totalHeat: number;
    totalInfluence?: number;
    interestLevel?: "high" | "medium" | "low";
    price?: PriceSnapshot;
  };
  meta: TrendingMeta;
  resolvedMeta?: ResolvedMeta;
  topics: TopicDetail[];
  keywords: KeywordCount[];
  sourceTweets: TweetData[];
  reliability: {
    timeRange: string;
  };
  /** @deprecated 기존 구조 호환용 */
  symbol?: string;
  /** @deprecated 기존 구조 호환용 */
  totalInfluence?: number;
  isEmpty?: boolean;
  dataStatus?: DataStatus;
  coverage?: ReportCoverage;
  highlights?: string[];
  perplexity?: PerplexitySummary;
  chart?: {
    image?: ChartImage;
    image24h?: ChartImage;
    points: ChartPoint[];
    intervalMinutes: number;
  };
  topicsTimeline?: TopicTimelinePoint[];
}

export interface PriceSnapshot {
  currency?: string;
  latest?: number;
  change1hPct?: number;
  change3hPct?: number;
  change24hPct?: number;
  change3dPct?: number;
  change7dPct?: number;
}

export interface TrendingMeta {
  source: TrendingSource;
  sourceId: number;
  slug: string;
  rank: number;
  name: string;
  symbol: string;
}

export type TrendingSource = "coingecko" | "coinmarketcap";

export interface ResolvedMeta {
  website?: string;
  contract?: string;
  chain?: string;
  categories?: string[];
  imageSmall?: string;
  marketCapRank?: number;
  priceUsd?: number;
  priceChange1hPct?: number;
  priceChange24hPct?: number;
  priceChange7dPct?: number;
  /** Coingecko 고유 식별자(id). 차트/링트 등에서 정규화된 ID로 사용 */
  coingeckoId?: string;
}

export interface TopicDetail {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  influence: number;
  heat?: number;
  label?: string;
  analysis: string;
  entities: {
    protocols: string[];
    people: string[];
    tokens: string[];
  };
  sourceTweets: SourceTweet[];
}

export interface SourceTweet {
  id: string;
  text: string;
  author: string;
  influence: number;
  url: string;
  createdAt: string;
  profileImageUrl?: string;
  retweetCount?: number;
  likeCount?: number;
  quoteCount?: number;
  replyCount?: number;
}

export interface KeywordCount {
  keyword: string;
  count: number;
  influence: number;
}

export type TweetData = SourceTweet;

export interface DataStatus {
  hasData: boolean;
  reason?: string;
  suggestions: string[];
}

export interface ReportCoverage {
  windowHours: number;
  collected: number;
  analyzed: number;
  topics?: number;
}

export interface PerplexitySummary {
  overview?: string;
  category?: string;
  features?: string[];
  website?: string;
  ecosystem?: string;
  marketData?: {
    currentPrice?: string;
    marketCap?: string;
    volume24h?: string;
    priceChange24h?: string;
    allTimeHigh?: string;
    allTimeLow?: string;
  };
}

export interface ChartImage {
  mimeType: string;
  base64: string;
}

export interface ChartPoint {
  timestamp: number;
  price: number;
  volume: number;
}

export interface TopicTimelinePoint {
  title: string;
  heat?: number;
  tweetId: string;
  createdAt: string;
  metrics?: {
    retweets?: number;
    likes?: number;
    quotes?: number;
    replies?: number;
  };
}

export type ReportStatus = "pending" | "processing" | "completed" | "error";

export interface ReportRequest extends TrendingMeta {
  modules: string[];
  broadcast: BroadcastDirective;
}

export interface BroadcastDirective {
  enabled: boolean;
  channels: string[];
  sendPhoto?: boolean;
}

export interface ReportResponse {
  success: boolean;
  reportId: string;
  reportUrl: string;
  totalInfluence: number;
  topics: TopicSummary[];
  broadcast: {
    sent: boolean;
    channels: string[];
  };
  acceptedMeta?: TrendingMeta;
  resolvedMeta?: ResolvedMeta;
  dataStatus?: DataStatus;
  error?: string;
}

export interface TopicSummary {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  influence: number;
}
