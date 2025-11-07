import { DetailedReport } from "../types/report.t";
import { formatNumber, formatPercent } from "../utils";

const DEFAULT_WINDOW_HOURS = 3;
const DEFAULT_TWEET_COUNT = 1000;

export interface CoverageLike {
  windowHours?: number | null;
  collected?: number | null;
  analyzed?: number | null;
}

export function buildCtaLinks(report: DetailedReport) {
  const origin =
    typeof window !== "undefined" && window.location
      ? window.location.origin
      : process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "");

  const baseReportUrl = origin
    ? `${origin}/report/${report.reportId}`
    : `/report/${report.reportId}`;

  const symbol = report.meta.symbol;
  const slug = report.resolvedMeta?.coingeckoId ?? report.meta.slug;
  const metrics = report.metrics;
  const priceSnapshot = metrics.price ?? {};
  const latestPrice =
    typeof priceSnapshot.latest === "number"
      ? priceSnapshot.latest.toFixed(priceSnapshot.latest >= 100 ? 2 : 3)
      : undefined;

  const interestLevel = (() => {
    switch (metrics.interestLevel) {
      case "high":
        return "관심도 HIGH";
      case "low":
        return "관심도 LOW";
      default:
        return "관심도 MEDIUM";
    }
  })();

  const heatLine = () => {
    const totalHeat = metrics.totalHeat ?? 0;
    return `Heat ${Math.round(totalHeat)}  · ${interestLevel}`;
  };

  const priceLine = latestPrice
    ? `가격 ${latestPrice} USD · 24h ${formatPercent(
        priceSnapshot.change24hPct
      )} · 3d ${formatPercent(priceSnapshot.change3dPct)}`
    : `24h ${formatPercent(priceSnapshot.change24hPct)} · 3d ${formatPercent(
        priceSnapshot.change3dPct
      )}`;

  const coverageTopics = report.coverage?.topics ?? report.topics?.length ?? 0;
  const coverageLine = `${formatCoverageSummary(
    report.coverage
  )} · 토픽 ${formatNumber(coverageTopics)}개`;

  return [
    {
      type: "coingecko",
      label: "📊 전체 차트 보기",
      href: `https://www.coingecko.com/en/coins/${slug}`,
    },
    {
      type: "dexscreener",
      label: "🔎 DexScreener",
      href: `https://dexscreener.com/search?q=${encodeURIComponent(symbol)}`,
    },
    {
      type: "share",
      label: "📣 텔레그램 공유",
      href: `https://t.me/share/url?url=${encodeURIComponent(
        baseReportUrl
      )}&text=${encodeURIComponent(
        [
          `${symbol} · ${report.meta.name} 상세 리포트`,
          heatLine,
          priceLine,
          coverageLine,
          "",
          baseReportUrl,
        ].join("\n")
      )}`,
    },
  ];
}

export function formatCoverageSummary(coverage?: CoverageLike | null): string {
  const windowHours =
    typeof coverage?.windowHours === "number" &&
    Number.isFinite(coverage.windowHours)
      ? coverage.windowHours
      : DEFAULT_WINDOW_HOURS;

  const count = (() => {
    if (typeof coverage?.collected === "number" && coverage.collected > 0) {
      return coverage.collected;
    }

    if (typeof coverage?.analyzed === "number" && coverage.analyzed > 0) {
      return coverage.analyzed;
    }
    return DEFAULT_TWEET_COUNT;
  })();

  return `최근 ${toLocaleNumber(windowHours)}시간 내 ${toLocaleNumber(
    count
  )}건의 트윗을 분석했습니다`;
}

function toLocaleNumber(value: number): string {
  return value.toLocaleString();
}
