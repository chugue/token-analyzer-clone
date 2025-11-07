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
        <div className="text-center text-slate-400">
          <p>토픽이 없습니다.</p>
        </div>
      )}
    </section>
  );
};

export default TopicSection;
