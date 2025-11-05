import useTickerStore from "../store/ticker-store";
import { TickerMetaData } from "../types/ticker.t";

const handleTickerPick = (pickedTicker: TickerMetaData) => {
  const {
    setPickedTicker,
    setTicker,
    setSuggestions: setSearchResults,
  } = useTickerStore.getState();

  setPickedTicker(pickedTicker);
  setSearchResults([]);
  setTicker(pickedTicker.ticker);
};

export default handleTickerPick;
