import { TwitterAnalysisModule } from "./analysis/twitter-analysis.module";
import { moduleRegistry } from "./core/module-registry";

export function boostrapModules() {
  console.log("🚀 분석 모듈들을 등록하는 중...");

  const twitterModule = new TwitterAnalysisModule();
  moduleRegistry.register(twitterModule);
}
