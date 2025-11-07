import { Button } from "@/components/ui/button";
import { startSmoothProgress } from "@/lib/helpers/progress-helpers";
import useTickerStore from "@/lib/store/ticker-store";
import { ProgressState } from "@/lib/types/ticker.t";
import { useRouter } from "next/navigation";

const GenerateReportButton = ({
  eventSourceRef,
  smoothProgressRef,
}: {
  eventSourceRef: React.RefObject<EventSource | null>;
  smoothProgressRef: React.RefObject<NodeJS.Timeout | null>;
}) => {
  const {
    name,
    rank,
    source,
    sourceId,
    slug,
    isAnalyzing,
    pickedTicker,
    progress,
    displayProgress,
    setProgress,
    setDisplayProgress,
    ticker,
    setAnalysisError,
    setIsAnalyzing,
  } = useTickerStore();
  const router = useRouter();

  const handleGenerateReport = async () => {
    if (!ticker.trim()) {
      setAnalysisError("Please enter a token symbol");
      return;
    }

    if (!pickedTicker) {
      setAnalysisError("Select a token from the suggestions to continue");
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError("");
    setProgress(null);
    setDisplayProgress(0);

    try {
      const sessionId = Date.now().toString();

      const params = new URLSearchParams({
        sessionId,
        ticker: pickedTicker.ticker.toUpperCase(),
        slug: slug.trim(),
        source,
        sourceId: sourceId.trim(),
        name: name.trim(),
        rank: rank.trim(),
      });

      const eventSource = new EventSource(
        `/api/reports/stream?${params.toString()}`
      );
      eventSourceRef.current = eventSource;

      eventSource.onmessage = (event) => {
        const data: ProgressState = JSON.parse(event.data);
        setProgress(data);

        startSmoothProgress(
          data.progress,
          smoothProgressRef,
          setDisplayProgress
        );

        if (data.completed) {
          eventSource.close();
          setIsAnalyzing(false);

          if (data.reportId) {
            setTimeout(() => {
              router.push(`/report/${data.reportId}`);
            }, 1500);
          } else if (data.error) {
            console.log("에러 발생", data.error);
            setAnalysisError(data.error);
          }
        }
      };
      eventSource.onerror = () => {
        eventSource.close();
        setIsAnalyzing(false);
        setAnalysisError("Connection error occurred");
        if (smoothProgressRef.current) {
          clearInterval(smoothProgressRef.current);
        }
      };
    } catch (error) {
      console.log(error);
      setAnalysisError("An error occurred while generating the report");
      setIsAnalyzing(false);
    }
  };

  return (
    <div>
      <Button
        className="w-full"
        disabled={
          isAnalyzing ||
          !pickedTicker ||
          !ticker.trim() ||
          (progress?.completed && !!progress.reportId)
        }
        onClick={handleGenerateReport}
      >
        {progress?.completed && progress.reportId
          ? "Redirecting..."
          : isAnalyzing
          ? "Analyzing..."
          : "Generate Report"}
      </Button>
      {(isAnalyzing || progress?.completed) && progress && (
        <div className="mt-6 sapce-y-3">
          <div className="flex justify-between items-center text-sm">
            <span
              className={
                progress.completed && progress.reportId
                  ? "text-green-600"
                  : "text-gray-600"
              }
            >
              {progress.details}
            </span>
            <span
              className={`font-medium ${
                progress.completed && progress.reportId
                  ? "text-green-600"
                  : "text-blue-600"
              }`}
            >
              {Math.round(displayProgress)}%
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                progress.completed && progress.reportId
                  ? "bg-green-600"
                  : "bg-blue-600"
              }`}
              style={{
                width: `${displayProgress}%`,
              }}
            />
          </div>
          <div className="text-center text-xs text-gray-500">
            {progress.completed && progress.reportId ? (
              <span className="text-green-600">
                ✅ Redirecting to report...
              </span>
            ) : (
              <span>Status: {progress.status}</span>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default GenerateReportButton;
