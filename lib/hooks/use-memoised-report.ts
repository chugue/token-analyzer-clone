import { useMemo } from "react";
import { DetailedReport } from "../types/report.t";

const useMemoisedReport = ({ report }: { report: DetailedReport | null }) => {
  


  const timeline = useMemo(() => {
    if (!report) return [];
    if (Array.isArray(report.topicsTimeline) && report.topicsTimeline.length > 0) {
      return report.topicsTimeline;
    }
    return deriveTimelineFromTopics(report.topics);
    

}, [report]);

export default useMemoisedReport;


