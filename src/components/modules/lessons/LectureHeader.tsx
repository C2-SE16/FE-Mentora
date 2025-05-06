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
        </div>
      </div>
    </div>
  );
}
