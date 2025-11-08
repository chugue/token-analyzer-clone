import {
  progressMap,
  startAnalysis,
  updateProgress,
} from "@/lib/helpers/stream-helpers";
import { TrendingMeta, TrendingSource } from "@/lib/types/report.t";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");
  const ticker = searchParams.get("ticker");
  const slug = searchParams.get("slug");
  const source = searchParams.get("source");
  const sourceId = searchParams.get("sourceId");
  const name = searchParams.get("name");
  const rank = searchParams.get("rank");

  if (
    !sessionId ||
    !ticker ||
    !slug ||
    !source ||
    !sourceId ||
    !name ||
    !rank
  ) {
    return new Response("Missing required parameters", { status: 400 });
  }

  const headers = new Headers({
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Cache-Control",
  });

  const stream = new ReadableStream({
    start(controller) {
      let isClosed = false;

      updateProgress(sessionId, "initializing", 5, "Starting analysis...");

      const sendProgress = () => {
        if (isClosed) return;

        const progress = progressMap.get(sessionId);
        if (progress) {
          try {
            const data = JSON.stringify(progress);
            controller.enqueue(`data: ${data}\n\n`);

            if (progress.completed) {
              setTimeout(() => {
                if (!isClosed) {
                  isClosed = true;
                  controller.close();
                  progressMap.delete(sessionId);
                }
              }, 1000);
            }
          } catch (error) {
            console.log("SSE 전송 오류:", error);
            if (!isClosed) {
              isClosed = true;
              controller.close();
            }
          }
        }
      };

      const meta: TrendingMeta = {
        symbol: ticker.toUpperCase(),
        source: source as TrendingSource,
        sourceId: parseInt(sourceId),
        slug,
        rank: parseInt(rank),
        name,
      };

      startAnalysis(sessionId, meta);

      const interval = setInterval(() => {
        if (isClosed) {
          clearInterval(interval);
          return;
        }
        sendProgress();

        const progress = progressMap.get(sessionId);
        if (progress?.completed) {
          clearInterval(interval);
        }
      }, 100);

      sendProgress();
    },
  });

  return new Response(stream, { headers });
}
