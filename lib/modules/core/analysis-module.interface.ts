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
  type: "twitter-topics" | "perplexity-summary" | "price-data";
  content: unknown;
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
