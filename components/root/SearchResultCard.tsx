import { TickerMetaData } from "@/lib/types/ticker";

const SearchResultCard = ({
  ticker,
  onSelect,
}: {
  ticker: TickerMetaData;
  onSelect: () => void;
}) => {
  return (
    <div
      className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer"
      onClick={onSelect}
    >
      <div className="flex flex-row justify-between">
        <p className="text-sm font-medium">{ticker.ticker}</p>
        <p className="text-gray-500 text-xs">Rank #{ticker.rank}</p>
      </div>
      <div className="text-xs">{ticker.name}</div>
      <div className="text-[10px] text-gray-500">Slug: {ticker.slug}</div>
    </div>
  );
};

export default SearchResultCard;
