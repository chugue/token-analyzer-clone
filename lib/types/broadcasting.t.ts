export interface Broadcaster {
  name: string;
  send(
    message: BroadcastMessage,
    channel: string
  ): Promise<BroadcastChannelResult>;
  validate(channel: string): boolean;
}

export interface BroadcastMessage {
  symbol: string;
  name: string;
  reportId: string;
  reportUrl: string;
  totalHeat: number;
  interestLevel: "high" | "medium" | "low";
  totalInfluence: number;
  price?: BroadcastPriceStats;
  coverage?: BroadcastCoverage;
  sector?: string;
  rank?: number;
  perplexityOverview?: string;
  highlights?: string[];
  chart: BroadcastChart;
  topics: BroadcastTopicSummary[];
  rawTweets?: Array<{
    id?: string;
    text: string;
    author?: string;
    createdAt: string;
    influence?: number;
  }>;
}

export interface BroadcastChannelResult {
  channel: string;
  success: boolean;
  messageId?: string;
  error?: string;
}

export interface BroadcastPriceStats {
  currency?: string;
  latest?: number;
  change1hPct?: number;
  change24hPct?: number;
  change3dPct?: number;
  change7dPct?: number;
}

export interface BroadcastCoverage {
  windowHours: number;
  collected: number;
  analysis?: string;
}

export interface BroadcastChart {
  mimeType: string;
  base64: string;
}

export interface BroadcastTopicSummary extends TopicSummary {
  heat: number;
  label?: string;
  analysis?: string;
}
export interface TopicSummary {
  title: string;
  sentiment: "positive" | "negative" | "neutral";
  influence: number;
}

export interface BroadcastRequest {
  enabled: boolean;
  channels: string[];
  message?: BroadcastMessage;
}

export interface BroadcastResult {
  success: boolean;
  channels: BroadcastChannelResult[];
  error?: string;
}
