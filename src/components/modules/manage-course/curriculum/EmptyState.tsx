'use client';

interface EmptyStateProps {
  onAddModule?: () => void;
}

export default function EmptyState({ onAddModule }: EmptyStateProps) {
  return (
    <div className="text-center py-8 border border-dashed border-gray-300 rounded-lg">
      <svg
        className="mx-auto h-12 w-12 text-gray-400"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        aria-hidden="true"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">Khóa học này chưa có nội dung</h3>
      <p className="mt-1 text-sm text-gray-500">
        Hãy thêm module đầu tiên để bắt đầu xây dựng khóa học của bạn.
      </p>
      {onAddModule && (
        <div className="mt-6">
          <button
            type="button"
            onClick={onAddModule}
            className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="-ml-1 mr-2 h-5 w-5"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                clipRule="evenodd"
              />
            </svg>
            Thêm module
          </button>
        </div>
      )}
    </div>
  );
}
