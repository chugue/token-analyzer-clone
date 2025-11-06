import { LoadingSpinner } from "../common/LoadingSpinner";

const ReportLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center h-screen gap-4">
      <LoadingSpinner />
      <span className="ml-3 text-lg font-bold text-slate-400">
        리포트를 불러오는 중입니다…
      </span>
    </div>
  );
};

export default ReportLoading;
