import { moduleRegistry } from "../modules/core/module-registry";
import { boostrapModules } from "../modules/module-boostrap";
import {
  DetailedReport,
  ReportRequest,
  ReportResponse,
  TrendingSource,
} from "../types/report.t";
import { BroadcastManager } from "./broadcast-manager";
import { ReportGenerator } from "./report-generator";

export class RequestHandler {
  private reportGenerator: ReportGenerator;
  private broadcastManager: BroadcastManager;

  constructor() {
    boostrapModules();

    this.broadcastManager = new BroadcastManager();
    this.reportGenerator = new ReportGenerator(
      moduleRegistry,
      this.broadcastManager
    );
  }

  async handleReportRequest(request: ReportRequest): Promise<ReportResponse> {
    try {
      // 1. 요청 검증
      this.validateRequest(request);

      // 2. ReportId 생성
      const reportId = this.generateReportId(request.symbol);
      console.log(`📊 리포트 생성 시작: ${reportId} (${request.symbol})`);

      const detailedReport = await this.reportGenerator.generateReport(
        request,
        reportId
      );

      const broadcastResult = await this.handleBroadcasting(
        request,
        detailedReport,
        reportId
      );

      const totalInfluence = detailedReport.metrics.totalInfluence ?? 0;
      const response: ReportResponse = {
        success: true,
        reportId,
        reportUrl: `/report/${reportId}`,
        totalInfluence,
        topics: detailedReport.topics.map((topic) => ({
          title: topic.title,
          sentiment: topic.sentiment,
          influence: topic.influence,
        })),
        broadcast: {
          sent: broadcastResult.success,
          channels: request.broadcast.enabled ? request.broadcast.channels : [],
        },
        acceptedMeta: {
          source: request.source,
          sourceId: request.sourceId,
          slug: request.slug,
          rank: request.rank,
          name: request.name,
          symbol: request.symbol,
        },
        resolvedMeta: detailedReport.resolvedMeta,
        dataStatus: detailedReport.dataStatus
          ? {
              hasData: detailedReport.dataStatus.hasData,
              reason: detailedReport.dataStatus.reason,
              suggestions: detailedReport.dataStatus.suggestions,
            }
          : {
              hasData: true,
              reason: undefined,
              suggestions: [],
            },
      };
      console.log(`✅ 리포트 생성 완료: ${reportId} (${request.symbol})`);
      return response;
    } catch (error) {
      console.error("❌ 리포트 생성 오류:", (error as Error).message);
      throw error;
    }
  }

  private async handleBroadcasting(
    request: ReportRequest,
    detailedReport: DetailedReport,
    reportId: string
  ) {
    if (!request.broadcast.enabled) {
      console.log("🔔 브로드캐스팅 비활성화됨");
      return { success: true, channels: [] };
    }

    if (!request.broadcast.enabled || request.broadcast.channels.length === 0) {
      console.log("🔔 브로드캐스팅 채널이 없음");
      return { success: true, channels: [] };
    }

    console.log(
      `📡 브로드캐스팅 시작: ${request.broadcast.channels.length}개 채널`
    );

    const chartImage = detailedReport.chart?.image;
    if (!chartImage || !chartImage.base64 || !chartImage.mimeType)
      throw new Error(
        "Broadcast requires a chart image but none was generated"
      );

    const maxTopics = Math.max(1, Math.min(6, detailedReport.topics.length));
    const topics = detailedReport.topics.slice(0, maxTopics).map((topic) => ({
      title: topic.title,
      sentiment: topic.sentiment,
      influence: topic.influence,
      heat:
        typeof topic.heat === "number"
          ? topic.heat
          : Math.max(0, Math.min(100, Math.round(topic.influence || 0))),
      label: topic.label,
      analysis: topic.analysis,
    }));

    const rawTweets = Array.isArray(detailedReport.sourceTweets)
      ? detailedReport.sourceTweets.map((tweet) => ({
          id: tweet.id,
          text: String(tweet.text || "").trim(),
          author: tweet.author,
          createdAt: tweet.createdAt,
          influence: tweet.influence,
        }))
      : [];

    return await this.broadcastManager.broadcast({
      enabled: request.broadcast.enabled,
      channels: request.broadcast.channels,
      message: {
        symbol: request.symbol,
        name: request.name,
        reportId,
        reportUrl: `/report/${reportId}`,
        totalHeat: detailedReport.metrics.totalHeat,
        interestLevel: detailedReport.metrics.interestLevel ?? "medium",
        totalInfluence: detailedReport.metrics.totalInfluence ?? 0,
        price: detailedReport.metrics.price,
        coverage: detailedReport.coverage,
        sector: detailedReport.resolvedMeta?.categories?.[0],
        rank: detailedReport.meta.rank,
        perplexityOverview: detailedReport.perplexity?.overview,
        highlights: detailedReport.highlights,
        chart: {
          mimeType: chartImage.mimeType,
          base64: chartImage.base64,
        },
        topics,
        rawTweets,
      },
    });
  }

  private validateRequest(request: ReportRequest): void {
    if (!(request.symbol && request.symbol.trim())) {
      throw new Error("Symbol field is required");
    }

    if (!(request.name && request.name.trim())) {
      throw new Error("Name field is required");
    }

    if (
      !(
        request.slug &&
        typeof request.slug === "string" &&
        request.slug.trim().length > 0
      )
    ) {
      throw new Error("Slug field is required");
    }

    if (!request.modules || request.modules.length === 0) {
      throw new Error("Modules array cannot be empty");
    }

    if (
      request.broadcast.enabled &&
      (!request.broadcast.channels || request.broadcast.channels.length === 0)
    ) {
      throw new Error(
        "Channels array is required when broadcasting is enabled"
      );
    }

    this.assertSourceValid(request.source);

    const parsedSourceId = Number(
      typeof (request.sourceId as unknown) === "string"
        ? String(request.sourceId).trim()
        : request.sourceId
    );

    if (!Number.isFinite(parsedSourceId)) {
      throw new Error("SourceId must be a number");
    }

    request.sourceId = parsedSourceId;

    this.assertSourceIdValid(request.sourceId);
    this.assertNumeric("rank", request.rank);

    request.symbol = request.symbol.toUpperCase();
    request.slug = request.slug.trim();

    console.log("✅ 요청 검증 통과:", {
      symbol: request.symbol,
      name: request.name,
      slug: request.slug,
      source: request.source,
      sourceId: request.sourceId,
      rank: request.rank,
      modules: request.modules,
      broadcastEnabled: request.broadcast.enabled,
    });
  }

  private assertSourceValid(source: string): asserts source is TrendingSource {
    const allowed: TrendingSource[] = ["coingecko", "coinmarketcap"];
    if (!allowed.includes(source as TrendingSource)) {
      throw new Error(`source must be on of ${allowed.join(", ")}`);
    }
  }

  private assertSourceIdValid(value: unknown): void {
    if (typeof value === "number" && Number.isFinite(value)) {
      return;
    }
    throw new Error("SourceId must be a number");
  }

  private assertNumeric(field: string, value: unknown): void {
    if (typeof value === "number" && Number.isFinite(value)) {
      return;
    }

    if (
      typeof value === "string" &&
      value.trim().length > 0 &&
      !Number.isNaN(Number(value))
    ) {
      return;
    }
    throw new Error(`${field} must be a valid number`);
  }

  private generateReportId(symbol: string): string {
    const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
    const sequence = Math.floor(Math.random() * 999) + 1;
    return `${symbol.toLowerCase()}-${date}-${sequence
      .toString()
      .padStart(3, "0")}`;
  }
}
