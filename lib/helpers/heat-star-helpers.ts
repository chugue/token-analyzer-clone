interface HeatTierDescription {
  threshold: number;
  message: string;
}

export function heatToStarValue(
  heat: number | null | undefined,
  maxStars = 5
): number {
  const clamped = clampHeat(heat);
  const ten = clamped / 10;
  const bins = Math.floor(ten);
  const stars = 0.5 * (bins + 1);
  return Math.min(maxStars, Math.max(0, stars));
}

export function clampHeat(value: number | null | undefined): number {
  if (typeof value !== "number" || Number.isNaN(value)) return 0;

  if (value < 0) return 0;
  if (value > 100) return 100;
  return value;
}

export function formatStarValue(starValue: number, maxStars = 5): string {
  return `${starValue.toFixed(1)} / ${maxStars}`;
}

export function formatHeatTen(heat: number | null | undefined): string {
  return (clampHeat(heat) / 10).toFixed(1);
}

export function buildHeatTooltip(
  heat: number | null | undefined,
  maxStars = 5
): string {
  const stars = heatToStarValue(heat, maxStars);
  const tierMessage = describeHeatTier(heat);
  const base =
    "별점은 토픽 영향력이 상위 몇 % 구간에 속하는지를 0.5점 단위로 환산한 값입니다.";
  const guide =
    "상위 5% 이내 → ★5.0, 상위 10% 이내 → ★4.5, 상위 20% 이내 → ★4.0 순으로 내려갑니다.";
  return `${base}\n${tierMessage} 현재 점수는 ★${stars.toFixed(
    1
  )}/${maxStars}입니다.\n${guide}`;
}

export function describeHeatTier(heat: number | null | undefined): string {
  const clamped = clampHeat(heat);
  const tier =
    HEAT_TIERS.find((item) => clamped >= item.threshold) ??
    HEAT_TIERS[HEAT_TIERS.length - 1];
  return tier.message;
}

const HEAT_TIERS: HeatTierDescription[] = [
  { threshold: 95, message: "상위 5% 이내의 매우 강한 영향력입니다." },
  { threshold: 90, message: "상위 10% 이내의 높은 영향력입니다." },
  { threshold: 80, message: "상위 20% 수준의 주목을 받고 있습니다." },
  { threshold: 70, message: "상위 30% 수준으로 관심이 꾸준합니다." },
  { threshold: 60, message: "상위 40% 수준의 준수한 관심입니다." },
  { threshold: 50, message: "상위 50% 수준의 평균 이상의 반응입니다." },
  { threshold: 40, message: "평균적인 관심 수준입니다." },
  { threshold: 30, message: "평균 이하이지만 성장 여지가 보입니다." },
  { threshold: 20, message: "관심이 다소 낮은 편입니다." },
  { threshold: 10, message: "관심이 매우 낮은 편입니다." },
  { threshold: 0, message: "영향력이 거의 포착되지 않았습니다." },
];
