import { AlertCircle, ArrowLeft, RefreshCw } from "lucide-react";

const ReportError = ({ error }: { error: string | null }) => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-linear-to-r from-red-500/20 via-pink-500/20 to-purple-500/20 blur-3xl -z-10 animate-pulse" />

        {/* 메인 카드 */}
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
          {/* 에러 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-red-500/20 blur-xl rounded-full animate-pulse" />
              <div className="relative bg-linear-to-br from-red-500 to-pink-600 rounded-full p-4">
                <AlertCircle
                  className="w-12 h-12 text-white"
                  strokeWidth={2.5}
                />
              </div>
            </div>
          </div>

          {/* 텍스트 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              리포트를 찾을 수 없습니다
            </h2>
            <p className="text-slate-400 leading-relaxed">
              {error || "요청하신 리포트가 존재하지 않거나 삭제되었습니다"}
            </p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col gap-3">
            <button
              onClick={() => window.history.back()}
              className="group relative overflow-hidden bg-linear-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-red-500/25 hover:scale-[1.02] active:scale-[0.98]"
            >
              <span className="relative flex items-center justify-center gap-2">
                <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                이전 페이지로 돌아가기
              </span>
            </button>

            <button
              onClick={() => window.location.reload()}
              className="group flex items-center justify-center gap-2 text-slate-400 hover:text-white px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:bg-slate-800/50"
            >
              <RefreshCw className="w-4 h-4 transition-transform group-hover:rotate-180 duration-500" />
              페이지 새로고침
            </button>
          </div>
        </div>

        {/* 장식 요소 */}
        <div className="absolute top-0 left-0 w-20 h-20 bg-red-500/10 rounded-full blur-2xl -z-10" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-pink-500/10 rounded-full blur-2xl -z-10" />
      </div>
    </div>
  );
};

export default ReportError;
