import { useState, useEffect, useCallback } from 'react';
import ProgressService, { UpdateVideoProgressDto } from '@/apis/progressService';
import { CurriculumProgress } from '@/types/curriculum_progress';
import { LectureProgress } from '@/types/lecture_progress';

interface UserProgress {
  curriculumProgress: Array<CurriculumProgress>;
  isLoading: boolean;
  error: Error | null;
}

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>({
    curriculumProgress: [],
    isLoading: true,
    error: null
  });

  const fetchUserProgress = useCallback(async () => {
    try {
      setProgress(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await ProgressService.getUserProgress();
      console.log('useUserProgress - Dữ liệu nhận được từ API:', data);

      if (data && data.data && data.data.curriculumProgress) {
        setProgress({
          curriculumProgress: data.data.curriculumProgress || [],
          isLoading: false,
          error: null
        });
      } else {
        console.error('useUserProgress - Không tìm thấy dữ liệu curriculumProgress trong phản hồi API');
        setProgress(prev => ({
          ...prev,
          isLoading: false,
          error: new Error('Không tìm thấy dữ liệu curriculumProgress')
        }));
      }
    } catch (error) {
      console.error('Lỗi khi lấy tiến trình học:', error);
      setProgress(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Lỗi không xác định')
      }));
    }
  }, []);

  useEffect(() => {
    fetchUserProgress();
  }, [fetchUserProgress]);

  return {
    ...progress,
    refetch: fetchUserProgress
  };
}

export function useVideoProgress() {
  const [isUpdating, setIsUpdating] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [lastPosition, setLastPosition] = useState<number>(0);

  const updateProgress = useCallback(async (data: UpdateVideoProgressDto) => {
    try {
      setIsUpdating(true);
      setError(null);
      const response = await ProgressService.updateVideoProgress(data);
      setLastPosition(data.currentTime);
      return response;
    } catch (error) {
      console.error('Lỗi khi cập nhật tiến trình video:', error);
      setError(error instanceof Error ? error : new Error('Lỗi không xác định'));
      return null;
    } finally {
      setIsUpdating(false);
    }
  }, []);

  return {
    updateProgress,
    isUpdating,
    error,
    lastPosition
  };
}

export function useLectureCompletion(lectureId: string) {
  const [completion, setCompletion] = useState<{
    canProceed: boolean;
    message: string;
    completionRatio: number;
    isLoading: boolean;
    error: Error | null;
  }>({
    canProceed: false,
    message: '',
    completionRatio: 0,
    isLoading: true,
    error: null
  });

  const checkCompletion = useCallback(async () => {
    if (!lectureId) return;

    try {
      setCompletion(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await ProgressService.checkLectureCompletion(lectureId);

      console.log('API response from checkLectureCompletion:', data);

      // Đảm bảo dữ liệu trả về đúng cấu trúc
      if (data && typeof data.canProceed === 'boolean') {
        // Ghi log chi tiết hơn để debug
        console.log('Cập nhật state từ dữ liệu API:', {
          canProceed: data.canProceed,
          message: data.message || '',
          completionRatio: data.completionRatio || 0,
          status: data.progress?.status
        });

        setCompletion({
          canProceed: data.canProceed,
          message: data.message || '',
          completionRatio: data.completionRatio || 0,
          isLoading: false,
          error: null
        });
      } else {
        console.error('Dữ liệu không hợp lệ từ API checkLectureCompletion:', data);
        setCompletion(prev => ({
          ...prev,
          isLoading: false,
          error: new Error('Dữ liệu không hợp lệ từ API')
        }));
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra hoàn thành bài giảng:', error);
      setCompletion(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Lỗi không xác định')
      }));
    }
  }, [lectureId]);

  useEffect(() => {
    if (lectureId) {
      checkCompletion();
    }
  }, [lectureId, checkCompletion]);

  return {
    ...completion,
    checkCompletion
  };
}

export function useCurriculumProgress(curriculumId: string) {
  const [progress, setProgress] = useState<{
    canProceed: boolean;
    message: string;
    completionRatio: number;
    isLoading: boolean;
    error: Error | null;
  }>({
    canProceed: false,
    message: '',
    completionRatio: 0,
    isLoading: true,
    error: null
  });

  const checkProgress = useCallback(async () => {
    if (!curriculumId) return;

    try {
      setProgress(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await ProgressService.checkCurriculumCompletion(curriculumId);
      setProgress({
        canProceed: data.canProceed,
        message: data.message,
        completionRatio: data.completionRatio,
        isLoading: false,
        error: null
      });
    } catch (error) {
      console.error('Lỗi khi kiểm tra tiến trình bài học:', error);
      setProgress(prev => ({
        ...prev,
        isLoading: false,
        error: error instanceof Error ? error : new Error('Lỗi không xác định')
      }));
    }
  }, [curriculumId]);

  useEffect(() => {
    if (curriculumId) {
      checkProgress();
    }
  }, [curriculumId, checkProgress]);

  return {
    ...progress,
    checkProgress
  };
}

export function useNavigationCheck() {
  const [navigationStatus, setNavigationStatus] = useState<{
    canProceed: boolean;
    message: string;
    isLoading: boolean;
    error: Error | null;
  }>({
    canProceed: false,
    message: '',
    isLoading: false,
    error: null
  });

  const checkCanProceed = useCallback(async (currentLectureId: string, nextLectureId: string) => {
    try {
      setNavigationStatus(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await ProgressService.checkCanProceed(currentLectureId, nextLectureId);
      setNavigationStatus({
        canProceed: data.canProceed,
        message: data.message,
        isLoading: false,
        error: null
      });
      return data.canProceed;
    } catch (error) {
      console.error('Lỗi khi kiểm tra khả năng chuyển tiếp:', error);
      setNavigationStatus({
        canProceed: false,
        message: 'Có lỗi xảy ra khi kiểm tra khả năng chuyển tiếp',
        isLoading: false,
        error: error instanceof Error ? error : new Error('Lỗi không xác định')
      });
      return false;
    }
  }, []);

  const checkCurriculumAccess = useCallback(async (currentCurriculumId: string, nextCurriculumId: string) => {
    try {
      setNavigationStatus(prev => ({ ...prev, isLoading: true, error: null }));
      const data = await ProgressService.checkCurriculumAccess({
        currentCurriculumId,
        nextCurriculumId
      });
      setNavigationStatus({
        canProceed: data.canProceed,
        message: data.message,
        isLoading: false,
        error: null
      });
      return data.canProceed;
    } catch (error) {
      console.error('Lỗi khi kiểm tra khả năng chuyển tiếp giữa các đơn vị bài học:', error);
      setNavigationStatus({
        canProceed: false,
        message: 'Có lỗi xảy ra khi kiểm tra khả năng chuyển tiếp',
        isLoading: false,
        error: error instanceof Error ? error : new Error('Lỗi không xác định')
      });
      return false;
    }
  }, []);

  return {
    ...navigationStatus,
    checkCanProceed,
    checkCurriculumAccess
  };
}

// Hook tổng hợp để theo dõi tiến trình học
export function useProgressTracking() {
  const userProgress = useUserProgress();
  const videoProgress = useVideoProgress();
  const navigationCheck = useNavigationCheck();

  return {
    userProgress,
    videoProgress,
    navigationCheck,
    // Hàm tiện ích để kiểm tra nhanh tiến trình của một bài học cụ thể
    isCompleted: useCallback((curriculumId: string): boolean => {
      return userProgress.curriculumProgress.some(
        progress => progress.curriculumId === curriculumId && progress.status === 'COMPLETED'
      );
    }, [userProgress.curriculumProgress]),

    // Hàm tính toán tiến trình tổng thể của khóa học
    calculateCourseProgress: useCallback((moduleIds: string[]): number => {
      console.log('calculateCourseProgress được gọi với moduleIds:', moduleIds);
      console.log('userProgress.curriculumProgress:', userProgress.curriculumProgress);

      if (!moduleIds.length || userProgress.curriculumProgress.length === 0) {
        console.log('Không có moduleIds hoặc không có dữ liệu tiến độ, trả về 0%');
        return 0;
      }

      // Lọc ra các curriculum thuộc các module được chỉ định
      const relevantCurriculums = userProgress.curriculumProgress
        .filter(progress => {
          const moduleId = progress.curricula?.moduleId || '';
          const isRelevant = moduleIds.includes(moduleId);
          console.log(`Curriculum ${progress.curriculumId}, moduleId: ${moduleId}, isRelevant: ${isRelevant}`);
          return isRelevant;
        });

      console.log('Các curriculum liên quan:', relevantCurriculums);

      // Đếm số curriculum đã hoàn thành
      const completedCount = relevantCurriculums
        .filter(progress => progress.status === 'COMPLETED')
        .length;

      console.log(`Số curriculum đã hoàn thành: ${completedCount}/${relevantCurriculums.length}`);

      // Tính phần trăm hoàn thành
      const progressPercentage = relevantCurriculums.length > 0
        ? Math.round((completedCount / relevantCurriculums.length) * 100)
        : 0;

      console.log(`Phần trăm hoàn thành: ${progressPercentage}%`);
      return progressPercentage;
    }, [userProgress.curriculumProgress])
  };
}

export default useProgressTracking; 