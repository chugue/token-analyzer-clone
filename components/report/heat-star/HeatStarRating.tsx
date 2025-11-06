import { heatToStarValue } from "@/lib/helpers/heat-star-helpers";
import HeatStarRatingBase from "./HeatStarRatingBase";

export type StarSize = "xs" | "sm" | "md" | "lg";

export interface StarRatingBaseProps {
  value: number;
  max?: number;
  size?: StarSize;
  showValue?: boolean;
  className?: string;
  valueClassName?: string;
  label?: string;
}

interface HeatStarRatingProps extends Omit<StarRatingBaseProps, "value"> {
  heat: number | null | undefined;
}

const HeatStarRating = ({
  heat,
  max = 5,
  size = "sm",
  showValue,
  className,
  valueClassName,
  label,
}: HeatStarRatingProps) => {
  const starValue = heatToStarValue(heat, max);
  return (
    <HeatStarRatingBase
      value={starValue}
      max={max}
      size={size}
      showValue={showValue}
      className={className}
      valueClassName={valueClassName}
      label={label}
    />
  );
};

export default HeatStarRating;
