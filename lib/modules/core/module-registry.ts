import {
  AnalysisModule,
  AnalysisParams,
  AnalysisResult,
} from "@/lib/modules/core/analysis-module.interface";

export class ModuleRegistry {
  private modules: Map<string, AnalysisModule> = new Map();

  register(analysisModule: AnalysisModule): void {
    const missingVars = analysisModule
      .getRequiredEnvVars()
      .filter((varName) => !process.env[varName]);

    if (missingVars.length > 0) {
      throw new Error(
        `Module ${
          analysisModule.name
        } missing required env vars: ${missingVars.join(", ")}`
      );
    }

    this.modules.set(analysisModule.name, analysisModule);
    console.log(
      `Module registered: ${analysisModule.name} v${analysisModule.version}`
    );
  }

  get(name: string): AnalysisModule | null {
    return this.modules.get(name) || null;
  }

  async execute(name: string, params: AnalysisParams): Promise<AnalysisResult> {
    const analysisModule = this.get(name);

    if (!analysisModule) {
      return {
        success: false,
        error: `Module '${name}' not found`,
        metadata: {
          executionTime: 0,
          dataSource: "none",
        },
      };
    }

    if (!analysisModule.validate(params)) {
      return {
        success: false,
        error: `Invalid parameters for module '${name}'`,
        metadata: {
          executionTime: 0,
          dataSource: "none",
        },
      };
    }

    const startTime = Date.now();

    try {
      const result = await analysisModule.execute(params);
      result.metadata.executionTime = Date.now() - startTime;
      return result;
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : String(error),
        metadata: {
          executionTime: Date.now() - startTime,
          dataSource: "none",
        },
      };
    }
  }

  async executeMultiple(
    requests: Array<{
      name: string;
      params: AnalysisParams;
    }>
  ): Promise<Array<AnalysisResult>> {
    return Promise.all(
      requests.map((req) => this.execute(req.name, req.params))
    );
  }
}

export const moduleRegistry = new ModuleRegistry();
