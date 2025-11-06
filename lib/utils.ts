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
