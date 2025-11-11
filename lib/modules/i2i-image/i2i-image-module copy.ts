import { BaseModule } from "../base-module";
import {
  AnalysisParams,
  AnalysisResult,
} from "../core/analysis-module.interface";
import { I2IImageService } from "./i2i-image-service copy";

export class I2IImageModule extends BaseModule {
  readonly name = "i2i-image";
  readonly version = "1.0.0";
  readonly description = "Gemini I2I 기반 토큰 심볼 이미지 생성";
  private readonly i2iService: I2IImageService;

  constructor() {
    super();
    this.i2iService = new I2IImageService();
  }

  async execute(params: AnalysisParams): Promise<AnalysisResult> {
    const start = Date.now();
    const { symbol, locale } = params;
    try {
      console.log(`🎨 [I2IImageModule] ${symbol} 이미지 생성 시작`);

      const image = await this.i2iService.generateSymbolI2I(
        symbol,
        locale ?? "ko"
      );

      if (!image) {
        throw new Error(`Failed to generate image for ${symbol}`);
      }

      console.log(`✅ [I2IImageModule] ${symbol} 이미지 생성 완료`);

      return {
        success: true,
        data: {
          type: "i2i-image",
          content: image,
          timestamp: new Date().toISOString(),
        },
        metadata: {
          executionTime: Date.now() - start,
          dataSource: "Gemini I2I",
        },
      };
    } catch (error) {
      console.log(error);
      throw new Error(`Failed to generate image for ${symbol}`);
    }
  }

  getRequiredEnvVars(): string[] {
    return ["GOOGLE_API_KEY"];
  }
}
