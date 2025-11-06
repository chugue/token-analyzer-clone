interface ErrorCardProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
}

const ErrorCard = ({
  title,
  description,
  actionLabel,
  onAction,
}: ErrorCardProps) => {
  return (
    <div className="max-w-md w-full bg-white rounded-lg shadow-sm border border-red-200 p-6">
      <div className="flex items-center mb-4">
        <div className="shrink-0">
          <svg
            className="w-6 h-6 text-red-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
        <h3 className="ml-3 text-lg font-medium text-gray-900">{title}</h3>
      </div>

      <p className="text-gray-600 mb-4">{description}</p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};

export default ErrorCard;
