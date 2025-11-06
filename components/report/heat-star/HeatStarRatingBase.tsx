import { formatStarValue } from "@/lib/helpers/heat-star-helpers";
import clsx from "clsx";
import StarIcon from "../../common/StarIcon";
import { StarSize } from "./HeatStarRating";
const SIZE_MAP: Record<StarSize, number> = {
  xs: 14,
  sm: 18,
  md: 22,
  lg: 26,
};

interface StarRatingBaseProps {
  value: number;
  max?: number;
  size?: StarSize;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  label?: string;
}

const HeatStarRatingBase = ({
  value,
  max = 5,
  size = "sm",
  showValue = false,
  className,
  valueClassName,
  label,
}: StarRatingBaseProps) => {
  const clamped = Math.max(0, Math.min(value, max));
  const starSize = SIZE_MAP[size];
  const stars = Array.from({ length: max }, (_, index) => {
    const remaining = clamped - index;
    const fraction = Math.max(0, Math.min(1, remaining));

    return (
      <span
        key={index}
        className="relative inline-flex"
        style={{ width: starSize, height: starSize }}
      >
        <span className="text-slate-600/40">
          <StarIcon filled={false} size={starSize} />
        </span>
        {fraction > 0 ? (
          <span
            className="absolute inset-0 overflow-hidden text-amber-300 drop-shadow-[0_0_6px_rgba(251,191,36,0.35)]"
            style={{ width: `${fraction * 100}` }}
          >
            <StarIcon filled size={starSize} />
          </span>
        ) : null}
      </span>
    );
  });

  return (
    <div
      className={clsx("inline-flex items-center gap-2", className)}
      aria-label={label ?? `별점 ${formatStarValue(clamped, max)}`}
    >
      <span className="inline-flex items-center gap-[2px]">{stars}</span>
      {showValue ? (
        <span
          className={clsx(
            "font-medium text-slate-200/90",
            size === "lg"
              ? "text-sm"
              : size === "md"
              ? "text-xs"
              : "text-[11px]",
            valueClassName
          )}
        >
          {formatStarValue(clamped, max)}
        </span>
      ) : null}
    </div>
  );
};

export default HeatStarRatingBase;
