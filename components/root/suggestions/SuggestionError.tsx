const SuggestionError = ({ errorMessage }: { errorMessage: string }) => {
  return (
    <div className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer text-red-400 text-center text-sm ">
      {errorMessage}
    </div>
  );
};

export default SuggestionError;
