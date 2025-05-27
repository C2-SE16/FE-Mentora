import React, { useMemo } from 'react';
import { useProgressTracking } from '@/hooks/useProgress';
import CourseProgressCard from './CourseProgressCard';
import ProgressBar from './ProgressBar';

interface Course {
  id: string;
  title: string;
  image?: string;
  moduleIds: string[];
  lastAccessedLectureId?: string;
}

interface LearningDashboardProps {
  courses: Course[];
}

export const LearningDashboard: React.FC<LearningDashboardProps> = ({
  courses
}) => {
  const { userProgress, calculateCourseProgress } = useProgressTracking();

  // Phân loại khóa học theo trạng thái
  const {
    inProgressCourses,
    completedCourses,
    notStartedCourses,
    courseStats
  } = useMemo(() => {
    if (!courses?.length) {
      return {
        inProgressCourses: [],
        completedCourses: [],
        notStartedCourses: [],
        courseStats: {
          total: 0,
          inProgress: 0,
          completed: 0,
          notStarted: 0,
          overallProgress: 0
        }
      };
    }

    let inProgressCount = 0;
    let completedCount = 0;
    let notStartedCount = 0;
    let totalProgress = 0;

    const inProgress: Course[] = [];
    const completed: Course[] = [];
    const notStarted: Course[] = [];

    courses.forEach(course => {
      const progress = calculateCourseProgress(course.moduleIds);
      totalProgress += progress;

      if (progress === 100) {
        completed.push(course);
        completedCount++;
      } else if (progress > 0) {
        inProgress.push(course);
        inProgressCount++;
      } else {
        notStarted.push(course);
        notStartedCount++;
      }
    });

    // Sắp xếp khóa học đang học theo tiến độ giảm dần
    inProgress.sort((a, b) =>
      calculateCourseProgress(b.moduleIds) - calculateCourseProgress(a.moduleIds)
    );

    return {
      inProgressCourses: inProgress,
      completedCourses: completed,
      notStartedCourses: notStarted,
      courseStats: {
        total: courses.length,
        inProgress: inProgressCount,
        completed: completedCount,
        notStarted: notStartedCount,
        overallProgress: courses.length > 0 ? Math.round(totalProgress / courses.length) : 0
      }
    };
  }, [courses, calculateCourseProgress]);

  if (!courses?.length) {
    return (
      <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg shadow">
        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        <h3 className="mt-2 text-lg font-medium text-gray-900 dark:text-gray-100">Chưa có khóa học nào</h3>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">Bạn chưa tham gia khóa học nào.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Thẻ thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tổng số khóa học</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courseStats.total}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đang học</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400">{courseStats.inProgress}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full dark:bg-blue-900/30">
              <svg className="w-6 h-6 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Đã hoàn thành</p>
              <p className="text-2xl font-bold text-green-600 dark:text-green-400">{courseStats.completed}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full dark:bg-green-900/30">
              <svg className="w-6 h-6 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm">
          <div className="flex items-center justify-between mb-2">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Tiến độ tổng thể</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">{courseStats.overallProgress}%</p>
            </div>
            <div className="p-3 bg-indigo-100 rounded-full dark:bg-indigo-900/30">
              <svg className="w-6 h-6 text-indigo-600 dark:text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
          </div>
          <ProgressBar
            progress={courseStats.overallProgress}
            color={
              courseStats.overallProgress === 100 ? 'success' :
                courseStats.overallProgress >= 70 ? 'primary' :
                  courseStats.overallProgress >= 30 ? 'warning' :
                    'danger'
            }
            showPercentage={false}
          />
        </div>
      </div>

      {/* Khóa học đang học */}
      {inProgressCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Khóa học đang học</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {inProgressCourses.map(course => (
              <CourseProgressCard
                key={course.id}
                courseId={course.id}
                courseTitle={course.title}
                courseImage={course.image}
                moduleIds={course.moduleIds}
                lastAccessedLectureId={course.lastAccessedLectureId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Khóa học đã hoàn thành */}
      {completedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Khóa học đã hoàn thành</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {completedCourses.map(course => (
              <CourseProgressCard
                key={course.id}
                courseId={course.id}
                courseTitle={course.title}
                courseImage={course.image}
                moduleIds={course.moduleIds}
                lastAccessedLectureId={course.lastAccessedLectureId}
              />
            ))}
          </div>
        </div>
      )}

      {/* Khóa học chưa bắt đầu */}
      {notStartedCourses.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-gray-100">Khóa học chưa bắt đầu</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {notStartedCourses.map(course => (
              <CourseProgressCard
                key={course.id}
                courseId={course.id}
                courseTitle={course.title}
                courseImage={course.image}
                moduleIds={course.moduleIds}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LearningDashboard; 