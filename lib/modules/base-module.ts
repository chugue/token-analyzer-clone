import {
  AnalysisModule,
  AnalysisParams,
  AnalysisResult,
  ModuleData,
} from "./core/analysis-module.interface";

export abstract class BaseModule implements AnalysisModule {
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly description: string;

  abstract execute(params: AnalysisParams): Promise<AnalysisResult>;
  abstract getRequiredEnvVars(): string[];

  validate(params: AnalysisParams): boolean {
    return !!params.symbol;
  }

  protected createSuccessResult(
    data: ModuleData,
    metadata: Partial<{
      executionTime: number;
      dataSource: string;
      recordCount: number;
      isEmpty: boolean;
    }>
  ): AnalysisResult {
    return {
      success: true,
      data,
      metadata: {
        executionTime: 0,
        dataSource: "unknown",
        ...metadata,
      },
    };
  }

  protected createErrorResult(
    error: string,
    executionTime: number
  ): AnalysisResult {
    return {
      success: false,
      error,
      metadata: {
        executionTime,
        dataSource: "error",
      },
    };
  }
}
