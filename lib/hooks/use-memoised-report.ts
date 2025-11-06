import { useMemo } from "react";
import {
  deriveTimelineFromTopics,
  sortTopics,
} from "../helpers/report-helpers";
import { DetailedReport } from "../types/report.t";

const useMemoReportData = (report: DetailedReport | null) => {
  const timeline = useMemo(() => {
    if (!report) return [];
    if (
      Array.isArray(report.topicsTimeline) &&
      report.topicsTimeline.length > 0
    ) {
      return report.topicsTimeline;
    }
    return deriveTimelineFromTopics(report.topics);
  }, [report]);

  const sortedTopics = useMemo(
    () => sortTopics(report?.topics),
    [report?.topics]
  );

  return { timeline, sortedTopics };
};

export default useMemoReportData;
