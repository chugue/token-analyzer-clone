import { FileX2, Home, RefreshCw } from "lucide-react";
import Link from "next/link";

const ReportNoResults = () => {
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative max-w-md w-full">
        {/* 배경 그라데이션 효과 */}
        <div className="absolute inset-0 bg-linear-to-r from-blue-500/20 via-cyan-500/20 to-teal-500/20 blur-3xl -z-10 animate-pulse" />

        {/* 메인 카드 */}
        <div className="relative backdrop-blur-xl bg-slate-900/80 border border-slate-800/50 rounded-2xl p-8 shadow-2xl">
          {/* 아이콘 */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl rounded-full" />
              <div className="relative bg-linear-to-br from-blue-500 to-cyan-600 rounded-full p-4">
                <FileX2 className="w-12 h-12 text-white" strokeWidth={2.5} />
              </div>
            </div>
          </div>

          {/* 텍스트 */}
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-white mb-3 tracking-tight">
              리포트를 생성하지 못했습니다.
            </h2>
            <p className="text-slate-400 leading-relaxed">
              아직 분석된 리포트가 없습니다.
              <br />
              홈으로 돌아가 토큰 분석을 다시 시작해보세요.
            </p>
          </div>

          {/* 버튼 그룹 */}
          <div className="flex flex-col gap-3">
            <Link href="/">
              <button className="group relative w-full overflow-hidden bg-linear-to-r from-blue-500 to-cyan-600 hover:from-blue-600 hover:to-cyan-700 text-white px-6 py-3.5 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/25 hover:scale-[1.02] active:scale-[0.98]">
                <span className="relative flex items-center justify-center gap-2">
                  <Home className="w-5 h-5 transition-transform group-hover:scale-110" />
                  홈으로 돌아가기
                </span>
              </button>
            </Link>

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
        <div className="absolute top-0 left-0 w-20 h-20 bg-blue-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
        <div className="absolute bottom-0 right-0 w-32 h-32 bg-cyan-500/10 rounded-full blur-2xl -z-10 animate-pulse" />
      </div>
    </div>
  );
};

export default ReportNoResults;
