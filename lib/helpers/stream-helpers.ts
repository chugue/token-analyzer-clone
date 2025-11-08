import { RequestHandler } from "../core/request-handler";
import { TrendingMeta } from "../types/report.t";

export const runtime = "nodejs";

export const progressMap = new Map<
  string,
  {
    status: string;
    progress: number;
    details?: string;
    completed?: boolean;
    reportId?: string;
    error?: string;
  }
>();

export function updateProgress(
  sessionId: string,
  status: string,
  progress: number,
  details?: string
) {
  progressMap.set(sessionId, {
    status,
    progress,
    details,
    completed: false,
  });
}

export function completeProgress(sessionId: string, reportId: string) {
  progressMap.set(sessionId, {
    status: "completed",
    progress: 100,
    details: "Report generated successfully",
    completed: true,
    reportId,
  });
}

export function errorProgress(sessionId: string, error: string) {
  progressMap.set(sessionId, {
    status: "error",
    progress: 0,
    details: error,
    completed: true,
    error,
  });
}

export async function startAnalysis(sessionId: string, meta: TrendingMeta) {
  try {
    updateProgress(sessionId, "collecting", 35, "Collecting Twitter data...");

    const requestHandler = new RequestHandler();

    updateProgress(sessionId, "analyzing", 80, "Analyzing twwets with AI...");

    const result = await requestHandler.handleReportRequest({
      ...meta,
      broadcast: {
        enabled: process.env.BROADCAST_ENABLED === "true",
        channels: process.env.TELEGRAM_CHANNELS?.split(",") || [],
      },
      modules: ["twitter-topic-exraction", "perplexity-summary"],
    });

    updateProgress(
      sessionId,
      "processing",
      90,
      "Processing insights and topics..."
    );

    await new Promise((resolve) => setTimeout(resolve, 1000));

    updateProgress(sessionId, "finalizing", 100, "Finalizing report...");

    await new Promise((resolve) => setTimeout(resolve, 500));

    if (result.success && result.reportId) {
      completeProgress(sessionId, result.reportId);
    } else {
      errorProgress(sessionId, result.error || "Failed to generate report");
    }
  } catch (error) {
    console.log(error);
    errorProgress(
      sessionId,
      error instanceof Error ? error.message : String(error)
    );
  }
}

export const dynamic = "force-dynamic";
