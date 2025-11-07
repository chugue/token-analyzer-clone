import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatUsd(v?: number) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 3 : 6;
  return `${v.toLocaleString("en-US", {
    maximumFractionDigits: digits,
  })} USD`;
}

export function formatPercent(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  const fixed = value.toFixed(2).replace(/-0\.00/, "0.00");
  return value > 0 ? `+${fixed}%` : `${fixed}%`;
}

export function formatPriceShort(v?: number) {
  if (typeof v !== "number" || Number.isNaN(v)) return "—";
  const abs = Math.abs(v);
  const digits = abs >= 100 ? 2 : abs >= 1 ? 3 : 6;
  return v.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export const priceTickFormatter = (value: number) =>
  value.toLocaleString("ko-KR", { maximumFractionDigits: 2 });

export function formatTimeDistance(target: string, baseline: string): string {
  const targetTime = new Date(target).getTime();
  const baselineTime = new Date(baseline).getTime();
  const diffMs = Math.max(0, baselineTime - targetTime);

  const totalMinutes = Math.floor(diffMs / (1000 * 60));
  const hours = Math.floor(totalMinutes / 60);
  const minutes = totalMinutes % 60;

  if (hours === 0 && minutes === 0) {
    return "방금 전";
  }
  if (hours === 0) {
    return `${minutes}분 전`;
  }
  if (minutes === 0) {
    return `${hours}시간 전`;
  }
  return `${hours}시간 ${minutes}분 전`;
}

export function formatCompactNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "0";
  }
  if (value >= 1000) {
    const divisor = value >= 100_000 ? 1 : 10;
    const compact = (value / 1000).toFixed(value >= 100_000 ? 0 : 1);
    return `${compact}K`;
  }
  return value.toString();
}

export function formatNumber(value?: number | null): string {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return "—";
  }
  return value.toLocaleString("ko-KR");
}
