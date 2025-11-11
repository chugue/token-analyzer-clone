import { GeneratedImage } from "@/lib/types/i2i-image.t";

export interface AnalysisModule {
  readonly name: string;
  readonly version: string;
  readonly description: string;

  execute(params: AnalysisParams): Promise<AnalysisResult>;
  validate(params: AnalysisParams): boolean;
  getRequiredEnvVars(): string[];
}

export interface AnalysisParams {
  symbol: string;
  timeRange?: {
    startTime: Date;
    endTime: Date;
  };
  locale?: "ko" | "en";
}

export interface AnalysisResult {
  success: boolean;
  data?: ModuleData;
  error?: string;
  metadata: {
    executionTime: number;
    dataSource: string;
    recordCount?: number;
    isEmpty?: boolean;
  };
}

export interface ModuleData {
  type: "twitter-topics" | "perplexity-summary" | "price-data" | "i2i-image";
  content: unknown | GeneratedImage;
  influence?: number;
  timestamp: string;
  isEmpty?: boolean;
  reason?: string;
  coverage?: {
    windowHours: number;
    collected: number;
    analyzed: number;
  };
}
