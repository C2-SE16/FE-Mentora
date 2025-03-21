'use client';
import { useRouter, usePathname } from 'next/navigation';

interface CreateCourseFooterProps {
  onNext: () => void;
  onBack: () => void;
  nextDisabled?: boolean;
}

const CreateCourseFooter = ({ onNext, onBack, nextDisabled = false }: CreateCourseFooterProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định bước hiện tại dựa trên đường dẫn
  const getCurrentStep = () => {
    if (pathname?.includes('/step1')) return 1;
    if (pathname?.includes('/step2')) return 2;
    return 1; // Mặc định là bước 1
  };

  const currentStep = getCurrentStep();
  const totalSteps = 2;

  // Xác định đường dẫn cho nút "Trước" và "Tiếp"
  const getPreviousPath = () => {
    if (currentStep === 1) return '/'; // Quay về trang chủ nếu đang ở bước 1
    if (currentStep === 2) return '/courses/create/step1';
    return '/';
  };

  const getNextPath = () => {
    if (currentStep === 1) return '/courses/create/step2';
    if (currentStep === 2) return '/courses'; // Giả sử hoàn thành và chuyển đến trang khóa học
    return '/courses';
  };

  // Xác định nhãn cho nút "Tiếp"
  const getNextButtonLabel = () => {
    return currentStep === totalSteps ? 'Hoàn thành' : 'Tiếp';
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
        onClick={onNext}
        disabled={nextDisabled}
        className="bg-green-500 hover:bg-green-600 text-white px-4 sm:px-6 py-2 rounded-md transition-colors text-sm md:text-base font-robotoCondensed"
      >
        {getNextButtonLabel()}
      </button>
    </footer>
  );
};

export default CreateCourseFooter;

