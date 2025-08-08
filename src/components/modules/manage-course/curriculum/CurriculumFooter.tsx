'use client';

interface CurriculumFooterProps {
  handleAddModule: () => void;
  handleSave: () => void;
  isLoading: boolean;
  animating: boolean;
}

export default function CurriculumFooter({
  handleAddModule,
  handleSave,
  isLoading,
  animating,
}: CurriculumFooterProps) {
  return (
    <div className="mt-6 flex justify-between">
      <button
        onClick={handleAddModule}
        disabled={isLoading || animating}
        className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
          isLoading || animating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <svg
          className="w-5 h-5 mr-2"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fillRule="evenodd"
            d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
            clipRule="evenodd"
          ></path>
        </svg>
        Thêm module
      </button>

      <button
        onClick={handleSave}
        disabled={isLoading || animating}
        className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 ${
          isLoading || animating ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        Lưu thay đổi
      </button>
    </div>
  );
}
