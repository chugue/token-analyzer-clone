import {
  AnalysisParams,
  AnalysisResult,
} from "../core/analysis-module.interface";
import { BaseModule } from "./base-module";

export class TwitterAnalysisModule extends BaseModule {
  readonly name = "twitter-topic-exraction";
  readonly version = "1.0.0";
  readonly description = "Claude Ai 기반 Twitter 토픽 추출";

  async execute(params: AnalysisParams): Promise<AnalysisResult> {
    return null;
  }

  getRequiredEnvVars(): string[] {
    return ["TWITTER_BEARER_TOKEN", "CLAUDE_API_KEY"];
  }
}
