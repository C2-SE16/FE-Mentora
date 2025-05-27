import React, { useState, useEffect } from 'react';
import { useNavigationCheck } from '@/hooks/useProgress';
import { useRouter } from 'next/router';
import { Button } from '@/components/ui/button';

interface NavigationControlProps {
  courseId: string;
  currentCurriculumId: string;
  nextCurriculumId?: string;
  prevCurriculumId?: string;
  isLecture?: boolean;
  isQuiz?: boolean;
  onNavigationAttempt?: (direction: 'next' | 'prev', canProceed: boolean) => void;
}

export const NavigationControl: React.FC<NavigationControlProps> = ({
  courseId,
  currentCurriculumId,
  nextCurriculumId,
  prevCurriculumId,
  isLecture = false,
  isQuiz = false,
  onNavigationAttempt,
}) => {
  const router = useRouter();
  const {
    canProceed,
    message,
    isLoading,
    checkCanProceed,
    checkCurriculumAccess
  } = useNavigationCheck();

  const [showMessage, setShowMessage] = useState(false);

  // Xóa thông báo sau một khoảng thời gian
  useEffect(() => {
    if (showMessage) {
      const timer = setTimeout(() => {
        setShowMessage(false);
      }, 5000); // Hiển thị thông báo trong 5 giây

      return () => clearTimeout(timer);
    }
  }, [showMessage]);

  const handleNavigation = async (direction: 'next' | 'prev') => {
    const targetId = direction === 'next' ? nextCurriculumId : prevCurriculumId;

    if (!targetId) return;

    // Thông báo cho component cha về việc cố gắng điều hướng
    onNavigationAttempt?.(direction, true);

    // Nếu đang điều hướng ngược lại, không cần kiểm tra
    if (direction === 'prev') {
      router.push(`/courses/${courseId}/learn/${targetId}`);
      return;
    }

    // Kiểm tra có thể chuyển tiếp hay không
    let canNavigate = false;

    if (isLecture) {
      canNavigate = await checkCanProceed(currentCurriculumId, targetId);
    } else {
      canNavigate = await checkCurriculumAccess(currentCurriculumId, targetId);
    }

    if (canNavigate) {
      router.push(`/courses/${courseId}/learn/${targetId}`);
    } else {
      setShowMessage(true);
      // Thông báo cho component cha về việc không thể điều hướng
      onNavigationAttempt?.(direction, false);
    }
  };

  return (
    <div className="mt-6">
      {/* Thông báo khi không thể chuyển tiếp */}
      {showMessage && !canProceed && (
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4 dark:bg-yellow-900/20 dark:border-yellow-600">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700 dark:text-yellow-200">
                {message || 'Bạn cần hoàn thành bài học hiện tại trước khi chuyển sang bài tiếp theo.'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Các nút điều hướng */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => handleNavigation('prev')}
          disabled={!prevCurriculumId || isLoading}
          className="flex items-center space-x-1"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          <span>Bài trước</span>
        </Button>

        <Button
          onClick={() => handleNavigation('next')}
          disabled={!nextCurriculumId || isLoading}
          className="flex items-center space-x-1"
        >
          <span>Bài tiếp theo</span>
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </Button>
      </div>
    </div>
  );
};

export default NavigationControl; 