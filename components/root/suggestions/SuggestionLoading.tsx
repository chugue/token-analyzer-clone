const SuggestionLoading = () => {
  return (
    <div className="flex items-center justify-center gap-1 p-4">
      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.3s]" />
      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce [animation-delay:-0.15s]" />
      <div className="w-2 h-2 bg-blue-300 rounded-full animate-bounce" />
    </div>
  );
};

export default SuggestionLoading;
