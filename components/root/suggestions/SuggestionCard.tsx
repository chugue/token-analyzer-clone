import LoadingDots from "@/components/common/LoadingDots";
import useTickerStore from "@/lib/store/ticker-store";
import SuggestionError from "./SuggestionError";
import SuggestionItem from "./SuggestionItem";
import SuggestionNoResults from "./SuggestionNoResults";

const SuggestionCard = () => {
  const {
    suggestions,
    pickedTicker,
    isSuggesting,
    debouncedTicker,
    suggestionError,
  } = useTickerStore();

  return (
    <>
      {debouncedTicker.length > 0 && !pickedTicker && (
        <div className="gap-2 absolute top-10 flex flex-col w-full max-h-64 overflow-y-auto bg-white z-10 border border-gray-200 rounded-md shadow-lg">
          {isSuggesting ? (
            <LoadingDots />
          ) : suggestionError ? (
            <SuggestionError error={suggestionError} />
          ) : suggestions.length === 0 ? (
            <SuggestionNoResults />
          ) : (
            suggestions.map((suggestion) => (
              <SuggestionItem
                key={suggestion.sourceId}
                suggestion={suggestion}
              />
            ))
          )}
        </div>
      )}
    </>
  );
};

export default SuggestionCard;
