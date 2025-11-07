import useMemoReportData from "@/lib/hooks/use-memoised-report";
import { DetailedReport } from "@/lib/types/report.t";
import TopicCard from "./TopicCard";

const TopicSection = ({ report }: { report: DetailedReport }) => {
  const { sortedTopics } = useMemoReportData(report);
  return (
    <section id="topics" className="space-y-4 scroll-mt-20 lg:scroll-mt-[72px]">
      <h2 className="text-xl font-semibold text-slate-100">핵심 토픽</h2>
      {sortedTopics.length ? (
        <div className="space-y-4">
          {sortedTopics.map((topic) => (
            <TopicCard
              key={`${topic.title}-${topic.influence}`}
              topic={topic}
              reportCreatedAt={report.createdAt}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-700/40 bg-slate-900/70 p-6 text-sm text-slate-300">
          분석 가능한 토픽이 없습니다.
        </div>
      )}
    </section>
  );
};

export default TopicSection;
