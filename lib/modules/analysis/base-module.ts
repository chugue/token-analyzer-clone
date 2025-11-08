import {
  AnalysisModule,
  AnalysisParams,
  AnalysisResult,
} from "../core/analysis-module.interface";

export abstract class BaseModule implements AnalysisModule {
  abstract readonly name: string;
  abstract readonly version: string;
  abstract readonly description: string;

  abstract execute(params: AnalysisParams): Promise<AnalysisResult>;
  abstract getRequiredEnvVars(): string[];

  validate(params: AnalysisParams): boolean {
    return !!params.symbol;
  }
}
