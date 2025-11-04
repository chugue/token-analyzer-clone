import handleTickerPick from "@/lib/helpers/handle-ticker-pick";
import { TickerMetaData } from "@/lib/types/ticker.t";

const SuggestionItem = ({ suggestion }: { suggestion: TickerMetaData }) => {
  return (
    <div
      className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer"
      onClick={() => handleTickerPick(suggestion)}
    >
      <div className="flex flex-row justify-between">
        <p className="text-sm font-medium whitespace-nowrap">
          {suggestion.ticker}
        </p>
        <p className="text-gray-500 text-xs">Rank #{suggestion.rank}</p>
      </div>
      <div className="text-xs">{suggestion.name}</div>
      <div className="text-[10px] text-gray-500">Slug: {suggestion.slug}</div>
    </div>
  );
};

export default SuggestionItem;
