import React from 'react';
import { Card } from '@/components/ui/card';
import ProgressBar from './ProgressBar';
import { useProgressTracking } from '@/hooks/useProgress';
import Link from 'next/link';

interface CourseProgressCardProps {
  courseId: string;
  courseTitle: string;
  courseImage?: string;
  moduleIds: string[];
  lastAccessedLectureId?: string;
}

export const CourseProgressCard: React.FC<CourseProgressCardProps> = ({
  courseId,
  courseTitle,
  courseImage,
  moduleIds,
  lastAccessedLectureId,
}) => {
  const { calculateCourseProgress } = useProgressTracking();
  const progress = calculateCourseProgress(moduleIds);

  const getStatusColor = (progress: number) => {
    if (progress >= 100) return 'success';
    if (progress >= 70) return 'primary';
    if (progress >= 30) return 'warning';
    return 'danger';
  };

  const getStatusText = (progress: number) => {
    if (progress >= 100) return 'Đã hoàn thành';
    if (progress >= 70) return 'Đang học tốt';
    if (progress >= 30) return 'Đang tiến triển';
    if (progress > 0) return 'Mới bắt đầu';
    return 'Chưa bắt đầu';
  };

  return (
    <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
      <div className="p-4">
        <div className="flex items-start gap-4">
          {courseImage && (
            <div className="w-16 h-16 rounded overflow-hidden flex-shrink-0">
              <img src={courseImage} alt={courseTitle} className="w-full h-full object-cover" />
            </div>
          )}
          <div className="flex-1">
            <h3 className="text-lg font-semibold mb-2 line-clamp-1">{courseTitle}</h3>
            <div className="mb-2">
              <ProgressBar
                progress={progress}
                color={getStatusColor(progress)}
                showPercentage={false}
              />
            </div>
            <div className="flex justify-between items-center">
              <span className={`text-sm font-medium ${progress === 100 ? 'text-green-600' : 'text-blue-600'}`}>
                {getStatusText(progress)} ({progress}%)
              </span>
              <Link
                href={lastAccessedLectureId
                  ? `/courses/${courseId}/learn/${lastAccessedLectureId}`
                  : `/courses/${courseId}`
                }
                className="text-sm font-medium text-blue-600 hover:underline"
              >
                {progress > 0 && progress < 100 ? 'Tiếp tục học' : 'Xem khóa học'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseProgressCard; 