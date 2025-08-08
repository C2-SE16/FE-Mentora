'use client';
import { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import CreateCourseService from '@/apis/createCourseService';
import { toast } from 'react-hot-toast';

interface CreateCourseFooterProps {
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
}

const CreateCourseFooter = ({ onNext, onBack, nextDisabled = false }: CreateCourseFooterProps) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isFormValid, setIsFormValid] = useState(true);

  // Xác định bước hiện tại dựa trên đường dẫn
  const getCurrentStep = () => {
    if (pathname?.includes('/step1')) return 1;
    if (pathname?.includes('/step2')) return 2;
    return 1; // Mặc định là bước 1
  };

  const currentStep = getCurrentStep();
  const totalSteps = 2;

  // Kiểm tra tính hợp lệ của form - chỉ kiểm tra tiêu đề
  const checkFormValidity = () => {
    if (currentStep === 1) {
      const titleFromStorage = localStorage.getItem('courseTitle');
      setIsFormValid(!!titleFromStorage && titleFromStorage.trim() !== '');
    } else {
      setIsFormValid(true);
    }
  };

  // Kiểm tra khi component mount và khi đường dẫn thay đổi
  useEffect(() => {
    checkFormValidity();

    // Thiết lập lắng nghe sự kiện storage để cập nhật trạng thái nút
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'courseTitle') {
        checkFormValidity();
      }
    };

    // Lắng nghe sự kiện thay đổi trong localStorage từ các tab/window khác
    window.addEventListener('storage', handleStorageChange);

    // Thiết lập interval để kiểm tra localStorage thường xuyên (cho cùng tab)
    const intervalId = setInterval(checkFormValidity, 500);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };
  }, [currentStep, pathname]);

  // Xác định nhãn cho nút "Tiếp"
  const getNextButtonLabel = () => {
    return currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp';
  };

  const handleFinish = async () => {
    if (currentStep !== totalSteps) {
      onNext();
      return;
    }

    try {
      // Lấy dữ liệu từ localStorage
      const titleFromStorage = localStorage.getItem('courseTitle');

      // Lấy categoryId từ step2 (có thể null)
      const categoryIdElement = document.querySelector('[data-selected-category-id]');
      const categoryId = categoryIdElement?.getAttribute('data-selected-category-id');

      // Chỉ kiểm tra tiêu đề, không kiểm tra categoryId
      if (!titleFromStorage || titleFromStorage.trim() === '') {
        console.error('Thiếu tiêu đề khóa học');
        toast.error('Vui lòng nhập tiêu đề khóa học ở bước 1');
        router.push('/courses/create/step1');
        return;
      }

      setIsSubmitting(true);
      const courseData = await CreateCourseService.createSimpleCourse({
        title: titleFromStorage,
        categoryId: categoryId || '', // Gửi chuỗi rỗng nếu không có categoryId
      });

      toast.success('Tạo khóa học thành công!');

      // Xóa dữ liệu đã lưu
      localStorage.removeItem('courseTitle');

      // Chuyển hướng đến trang quản lý khóa học với đường dẫn mới và ID khóa học
      router.push(`/instructor/course/${courseData.courseId}/manage/goals`);
    } catch (apiError: any) {
      toast.error(`Lỗi: ${apiError.message || 'Không thể tạo khóa học'}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <footer className="border-t border-gray-200 flex justify-between items-center py-3 px-4 sm:px-6 md:px-8 lg:h-[80px]">
      <button
        onClick={onBack}
        className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors text-sm md:text-base font-robotoCondensed"
      >
        Trước
      </button>

      <button
        onClick={currentStep === totalSteps ? handleFinish : onNext}
        disabled={nextDisabled || isSubmitting || (currentStep === 1 && !isFormValid)}
        className={`bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors text-sm md:text-base font-robotoCondensed flex items-center ${nextDisabled || isSubmitting || (currentStep === 1 && !isFormValid) ? 'opacity-50 cursor-not-allowed' : ''}`}
      >
        {isSubmitting && (
          <svg
            className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        )}
        {getNextButtonLabel()}
      </button>
    </footer>
  );
};

export default CreateCourseFooter;
