'use client';
import { Lesson, LessonType } from '@/types/courses';

interface LessonItemProps {
  lesson: Lesson;
  lessonIndex: number;
  moduleId: string;
  lessonRef: (el: HTMLDivElement | null) => void;
  movingLessonId: string | null;
  handleLessonTitleChange: (moduleId: string, lessonId: string, newTitle: string) => void;
  handleLessonTypeChange: (moduleId: string, lessonId: string, newType: LessonType) => void;
  handleMoveLessonUp: (moduleId: string, lessonIndex: number) => void;
  handleMoveLessonDown: (moduleId: string, lessonIndex: number) => void;
  handleDeleteLesson: (moduleId: string, lessonId: string) => void;
  totalLessons: number;
}

export default function LessonItem({
  lesson,
  lessonIndex,
  moduleId,
  lessonRef,
  movingLessonId,
  handleLessonTitleChange,
  handleLessonTypeChange,
  handleMoveLessonUp,
  handleMoveLessonDown,
  handleDeleteLesson,
  totalLessons,
}: LessonItemProps) {
  return (
    <div
      ref={lessonRef}
      data-lesson-id={lesson.lessonId}
      className={`p-3 flex items-center transition-all duration-500 ease-in-out ${
        movingLessonId === lesson.lessonId ? 'bg-blue-50' : ''
      }`}
    >
      <div className="flex-1">
        <div className="flex items-center">
          <input
            type="text"
            value={lesson.title || ''}
            onChange={(e) => handleLessonTitleChange(moduleId, lesson.lessonId, e.target.value)}
            placeholder="Nhập tiêu đề bài học"
            className="w-full border-0 bg-transparent focus:ring-0 text-gray-800"
          />
        </div>
      </div>

      <div className="flex items-center ml-2">
        <select
          value={lesson.contentType || LessonType.VIDEO}
          onChange={(e) =>
            handleLessonTypeChange(moduleId, lesson.lessonId, e.target.value as LessonType)
          }
          className="mr-2 text-sm border-gray-300 rounded-md"
        >
          <option value={LessonType.VIDEO}>Video</option>
          <option value={LessonType.QUIZ}>Bài kiểm tra</option>
          <option value={LessonType.ARTICLE}>Bài viết</option>
        </select>

        <button
          onClick={() => handleMoveLessonUp(moduleId, lessonIndex)}
          disabled={lessonIndex === 0}
          className={`p-1 mr-1 ${lessonIndex === 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => handleMoveLessonDown(moduleId, lessonIndex)}
          disabled={lessonIndex === totalLessons - 1}
          className={`p-1 mr-1 ${lessonIndex === totalLessons - 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
              clipRule="evenodd"
            />
          </svg>
        </button>
        <button
          onClick={() => handleDeleteLesson(moduleId, lesson.lessonId)}
          className="p-1 text-red-500 hover:text-red-700"
          title="Xóa bài học"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-4 w-4"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>
    </div>
  );
}
