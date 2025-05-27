import React, { useMemo } from 'react';
import { useProgressTracking } from '@/hooks/useProgress';
import ProgressBar from './ProgressBar';
import Link from 'next/link';

interface Course {
  id: string;
  title: string;
  image?: string;
  moduleIds: string[];
  enrollmentDate?: string;
  lastAccessed?: string;
  lastAccessedLectureId?: string;
}

interface ProgressOverviewProps {
  courses: Course[];
  showLimit?: number;
}

export const ProgressOverview: React.FC<ProgressOverviewProps> = ({
  courses,
  showLimit = 5
}) => {
  const { calculateCourseProgress } = useProgressTracking();

  // Sắp xếp khóa học theo tiến độ học tập (ưu tiên những khóa đang học)
  const sortedCourses = useMemo(() => {
    if (!courses?.length) return [];

    return [...courses].sort((a, b) => {
      const progressA = calculateCourseProgress(a.moduleIds);
      const progressB = calculateCourseProgress(b.moduleIds);

      // Ưu tiên khóa học đang học (0 < progress < 100)
      if (progressA > 0 && progressA < 100 && (progressB === 0 || progressB === 100)) {
        return -1;
      }
      if (progressB > 0 && progressB < 100 && (progressA === 0 || progressA === 100)) {
        return 1;
      }

      // Nếu cả hai đều đang học hoặc cùng trạng thái, sắp xếp theo tiến độ giảm dần
      return progressB - progressA;
    }).slice(0, showLimit);
  }, [courses, calculateCourseProgress, showLimit]);

  if (!courses?.length) {
    return (
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <div className="text-center py-8">
          <svg
            className="w-16 h-16 mx-auto text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
            />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100 mb-2">
            Bạn chưa tham gia khóa học nào
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hãy khám phá các khóa học của chúng tôi và bắt đầu hành trình học tập của bạn
          </p>
          <Link
            href="/courses"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Khám phá khóa học
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Tiến trình học tập của bạn
        </h2>
        <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
          Theo dõi tiến độ học tập và tiếp tục từ nơi bạn đã dừng
        </p>
      </div>

      <div className="divide-y divide-gray-200 dark:divide-gray-700">
        {sortedCourses.map(course => {
          const progress = calculateCourseProgress(course.moduleIds);
          const statusColor =
            progress === 100 ? 'success' :
              progress >= 70 ? 'primary' :
                progress >= 30 ? 'warning' :
                  'danger';

          const statusText =
            progress === 100 ? 'Đã hoàn thành' :
              progress >= 70 ? 'Đang học tốt' :
                progress >= 30 ? 'Đang tiến triển' :
                  progress > 0 ? 'Mới bắt đầu' :
                    'Chưa bắt đầu';

          return (
            <div key={course.id} className="p-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
              <div className="flex items-start gap-3">
                {course.image && (
                  <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                    <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-gray-100 truncate">
                    {course.title}
                  </h3>

                  <div className="mt-2 mb-1">
                    <ProgressBar
                      progress={progress}
                      color={statusColor}
                      showPercentage={false}
                      height="h-1.5"
                    />
                  </div>

                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {statusText}
                    </span>
                    <Link
                      href={course.lastAccessedLectureId
                        ? `/courses/${course.id}/learn/${course.lastAccessedLectureId}`
                        : `/courses/${course.id}`
                      }
                      className="text-xs font-medium text-blue-600 hover:underline"
                    >
                      {progress > 0 && progress < 100 ? 'Tiếp tục học' : 'Xem khóa học'}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {courses.length > showLimit && (
        <div className="px-6 py-3 bg-gray-50 dark:bg-gray-750 border-t border-gray-200 dark:border-gray-700">
          <Link
            href="/user/learning"
            className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
          >
            Xem tất cả khóa học của bạn
          </Link>
        </div>
      )}
    </div>
  );
};

export default ProgressOverview; 