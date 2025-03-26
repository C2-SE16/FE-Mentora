'use client';

import { useRouter, usePathname } from 'next/navigation';
import CreateCourseHeader from '@/layouts/CreateCourse/CreateCourseHeader';
import CreateCourseFooter from '@/layouts/CreateCourse/CreateCourseFooter';

export default function CreateLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định bước hiện tại dựa trên đường dẫn
  const getCurrentStep = () => {
    if (pathname?.includes('/step1')) return 1;
    if (pathname?.includes('/step2')) return 2;
    return 1; // Mặc định là bước 1
  };

  const currentStep = getCurrentStep();

  const handleNext = () => {
    if (currentStep === 1) {
      router.push('/courses/create/step2');
    } else if (currentStep === 2) {
      router.push('/courses'); // Hoặc bất kỳ trang nào bạn muốn chuyển đến sau bước 2
    }
  };

  const handleBack = () => {
    if (currentStep === 1) {
      router.push('/'); // Quay về trang chủ nếu đang ở bước 1
    } else if (currentStep === 2) {
      router.push('/courses/create/step1');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <CreateCourseHeader currentStep={currentStep} />
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8 py-6">{children}</main>
      <CreateCourseFooter onNext={handleNext} onBack={handleBack} />
    </div>
  );
}
