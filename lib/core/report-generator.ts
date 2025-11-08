import {
  fetchHighResMarketChart24h,
  fetchMarketChartData,
} from "../helpers/coingecko-helpers";
import { loadHeatStats } from "../helpers/heat-helpers";
import {
  AnalysisParams,
  AnalysisResult,
} from "../modules/core/analysis-module.interface";
import { ModuleRegistry } from "../modules/core/module-registry";
import { MarketChartPoint } from "../types/coinggecko.t";
import { DetailedReport, ReportRequest } from "../types/report.t";
import { PriceSnapshot } from "./../types/report.t";
import { BroadcastManager } from "./broadcast-manager";

export class ReportGenerator {
  private readonly moduleRegistry: ModuleRegistry;
  private readonly broadcastManager: BroadcastManager;

  constructor(
    moduleRegistry: ModuleRegistry,
    broadcastManager: BroadcastManager
  ) {
    this.moduleRegistry = moduleRegistry;
    this.broadcastManager = broadcastManager;
  }

  async generateReport(
    request: ReportRequest,
    reportId: string
  ): Promise<DetailedReport> {
    const startTime = Date.now();

    try {
      console.log(`🔧 리포트 생성 시작: ${reportId}`);

      const analysisParams: AnalysisParams = {
        symbol: request.symbol,
      };

      console.log(`⚡ ${request.modules.length}개 모듈 병렬 실행 중...`);

      const moduleResults = await this.executeModules(
        request.modules,
        analysisParams
      );

      const successResults = Array.from(moduleResults.entries())
        .filter(([_, result]) => result.success && result.data)
        .map(([moduleName, result]) => ({ moduleName, result }));

      const failedModules = request.modules.filter((moduleName) => {
        const result = moduleResults.get(moduleName);
        return !result || !result.success;
      });

      if (failedModules.length > 0) {
        throw new Error(`Required modules failed: ${failedModules.join(", ")}`);
      }

      console.log(
        `✅ ${successResults.length}/${request.modules.length}개 모듈 성공`
      );

      const detailedReport = await this.createDetailedReport(
        request,
        reportId,
        successResults
      );
    } catch (error) {
      console.log(error);
    }
  }

  private async executeModules(moduleNames: string[], params: AnalysisParams) {
    const requests = moduleNames.map((name) => ({ name, params }));

    const results = await this.moduleRegistry.executeMultiple(requests);

    const resultMap = new Map<string, AnalysisResult>();
    moduleNames.forEach((name, idx) => {
      resultMap.set(name, results[idx]);
    });

    return resultMap;
  }

  private async createDetailedReport(
    request: ReportRequest,
    reportId: string,
    successResults: { moduleName: string; result: AnalysisResult }[]
  ): Promise<DetailedReport> {
    const symbol = request.symbol;
    const createdAt = new Date().toISOString();
    const heatStats = await loadHeatStats();

    const heatSamples: number[] = [];

    let marketChart: { points: MarketChartPoint[]; intervalMinutes: number } = {
      points: [],
      intervalMinutes: 60,
    };

    try {
      marketChart = await fetchHighResMarketChart24h(request.slug);
      console.log("📈 High-res 24h market data loaded", {
        points: marketChart.points.length,
        intervalMinutes: marketChart.intervalMinutes,
      });
    } catch (e1) {
      console.warn(
        "⚠️ High-res 24h fetch failed, falling back to days endpoint:",
        (e1 as Error).message
      );

      try {
        marketChart = await fetchMarketChartData(request.slug);
      } catch (e2) {
        console.warn(
          "⚠️ Coingecko 시장 데이터 조회 실패:",
          (e2 as Error).message
        );
      }
    }

    let priceSnapshot: PriceSnapshot | undefined;

    try {
      const lognRange = await fetchMarketChartData(request.slug);
      if (lognRange.points.length > 0) {
        priceSnapshot = this.buildPriceSnapshotFromMarketChart(
          longRange.points
        );
      }
    } catch (error) {
      console.log(error);
    }
  }
  private buildPriceSnapshotFromMarketChart(
    points: MarketChartPoint[]
  ): PriceSnapshot {
    if (!points.length) {
      throw new Error(
        "Coingecko market chart data is required for price snapshot"
      );
    }

    const latestPoint = points[points.length - 1];
    const latest = latestPoint.price;
    if (!Number.isFinite(latest)) {
      throw new Error(
        "Coingecko market chart did not provide a valid latest price"
      );
    }

    const calculateChange = (hors: number): number | undefined => {
      if (!Number.isFinite(latest)) {
        return undefined;
      }
      const targetTimestamp = latestPoint.timestamp - hours * 60 * 60 * 1000;
      if (!Number.isFinite(targetTimestamp)) {
        return undefined;
      }

      const findBaseline = (): number | undefined => {
        for (let i = points.length - 1; i >= 0; i -= 1) {
          const point = points[i];
          if (!point || !Number.isFinite(point.price) || point.price === 0) {
            continue;
          }

          if (point.timestamp <= targetTimestamp) {
            return point.price;
          }
        }
        for (let i = 0; i < points.length; i += 1) {
          const candidate = points[i]?.price;
          if (
            typeof candidate === "number" &&
            Number.isFinite(candidate) &&
            candidate !== 0
          ) {
            return candidate;
          }
        }
        return undefined;
      };

      const baseLine = findBaseline();
      if (baseLine === undefined || baseLine === 0) {
        return undefined;
      }

      return ((latest - baseLine) / baseLine) * 100;
    };

    return {
      currency: "USD",
      latest,
      change1hPct: calculateChange(1),
      change3hPct: calculateChange(3),
      change24hPct: calculateChange(24),
      change3dPct: calculateChange(72),
      change7dPct: calculateChange(168),
    };
  }
}
