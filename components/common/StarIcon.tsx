const STAR_PATH =
  "M12 2.25l2.955 6.004 6.63.964-4.825 4.643 1.14 6.663L12 17.77l-5.9 3.754 1.14-6.663-4.825-4.643 6.63-.964z";

const StarIcon = ({ filled, size }: { filled: boolean; size: number }) => {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" aria-hidden="true">
      <path
        d={STAR_PATH}
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth={filled ? 0.6 : 1.3}
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default StarIcon;
