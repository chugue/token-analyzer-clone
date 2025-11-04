const SuggestionError = ({ error }: { error: Error }) => {
  return (
    <div className="flex flex-col gap-0.5 p-2 hover:bg-blue-100/40 cursor-pointer text-red-400 text-center text-sm ">
      {error.message}
    </div>
  );
};

export default SuggestionError;
