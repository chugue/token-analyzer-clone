import useTickerStore from "@/lib/store/ticker-store";
import { TickerMetaData } from "@/lib/types/ticker.t";

const SuggestionItem = ({
  suggestion,
  lastSelectedSymbolRef,
}: {
  suggestion: TickerMetaData;
  lastSelectedSymbolRef: React.RefObject<string | null>;
}) => {
  const {
    setPickedTicker,
    setSuggestions,
    setSource,
    setTicker,
    setName,
    setSlug,
    setSourceId,
    setRank,
    setSuggestionError,
    setHasSuggestions,
    setAnalysisError,
  } = useTickerStore();

  const handleSuggestionSelect = (suggestion: TickerMetaData) => {
    setSource("coingecko");
    setName(suggestion.name);
    setSlug(suggestion.slug);
    setSourceId(suggestion.sourceId.toString());
    setRank(suggestion.rank.toString());
    setPickedTicker(suggestion);
    setSuggestions([]);
    setTicker(suggestion.ticker);
    setSuggestionError("");
    setHasSuggestions(false);
    setAnalysisError("");
    lastSelectedSymbolRef.current = suggestion.ticker;
  };

  return (
    <div
      className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer"
      onClick={() => handleSuggestionSelect(suggestion)}
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
