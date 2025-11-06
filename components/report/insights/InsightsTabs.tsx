import { DetailedReport } from "@/lib/types/report.t";
import { useState } from "react";
import InsightsHighllightPanel from "./InsightsHighllightPanel";
import InsightsSnapshotPanel from "./InsightsSnapshotPanel";

const InsightsTabs = ({ report }: { report: DetailedReport }) => {
  const [tab, setTab] = useState<"highlights" | "snapshot">("highlights");
  return (
    <div className="rounded-[18px] border border-white/5 bg-[rgba(15,23,42,0.85)] p-4 shadow-[0_20px_40px_rgba(8,11,19,0.45)] backdrop-blur">
      <div className="flex items-center gap-2 text-sm">
        <button
          type="button"
          onClick={() => {
            setTab("highlights");
          }}
          className={`rounded-md px-3 py-1.5 font-semibold ${
            tab === "highlights"
              ? "bg-white/15 text-slate-100"
              : "text-slate-300 hover:bg-white/10"
          }`}
        >
          하이라이트
        </button>
        <button
          type="button"
          onClick={() => {
            setTab("snapshot");
          }}
          className={`hidden lg:inline-flex rounded-md px-3 py-1.5 font-semibold ${
            tab === "snapshot"
              ? "bg-white/15 text-slate-100"
              : "text-slate-300 hover:bg-white/10"
          }`}
        >
          프로젝트 정보
        </button>
      </div>
      <div className="mt-3">
        {tab === "highlights" ? (
          <InsightsHighllightPanel report={report} variant="embedded" />
        ) : (
          <div className="hidden lg:block">
            <InsightsSnapshotPanel report={report} />
          </div>
        )}
      </div>
    </div>
  );
};

export default InsightsTabs;
