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
