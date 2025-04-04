'use client';

interface LessonHeaderProps {
  courseTitle: string;
  lectureTitle: string;
  progress: number;
}
export default function LectureHeader({
  courseTitle,
  lectureTitle,
  progress = 0,
}: LessonHeaderProps) {
  return (
    <div className="bg-gray-900 text-white py-4">
      <div className="px-[115px]">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Khóa học: {courseTitle}</h1>
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <span className="text-sm mr-2">Tiến độ của bạn</span>
              <div className="w-32 bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <span className="text-sm ml-2">{progress}%</span>
            </div>
            <button className="flex items-center bg-blue-600 hover:bg-blue-700 px-3 py-1.5 rounded-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4 mr-1"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              Chia sẻ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
