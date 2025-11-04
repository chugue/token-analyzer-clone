const SearchResultCard = () => {
  return (
    <div className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer">
      <div className="flex flex-row justify-between">
        <p className="text-sm font-medium">BTC</p>
        <p className="text-gray-500 text-xs">Rank #1</p>
      </div>
      <div className="text-xs">Bitcoin</div>
      <div className="text-[10px] text-gray-500">Slug: bitcoin</div>
    </div>
  );
};

export default SearchResultCard;
