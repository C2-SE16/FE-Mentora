'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

interface CreateCourseHeaderProps {
  currentStep?: number;
}

const CreateCourseHeader = ({ currentStep = 1 }: CreateCourseHeaderProps) => {
  const router = useRouter();
  const pathname = usePathname();

  // Xác định bước hiện tại dựa trên đường dẫn
  const getCurrentStep = () => {
    if (pathname?.includes('/step1')) return 1;
    if (pathname?.includes('/step2')) return 2;
    return 1; // Mặc định là bước 1
  };

  const totalSteps = 2;

  return (
    <header className="flex items-center justify-between border-b border-gray-200 px-4 sm:px-6 md:px-8 py-3 lg:h-[80px]">
      <div className="flex items-center h-full">
        <div className="mb-2">
          <Image
            src="/mentora-logo.svg"
            alt="logo"
            width={100}
            height={100}
            className="w-20 sm:w-24 md:w-28 lg:w-32"
          />
        </div>
        <div className="h-full mx-3 md:mx-4 border-l border-gray-300"></div>
        <span className="text-sm md:text-base text-gray-600 font-robotoCondensed">
          Bước {currentStep}/{totalSteps}
        </span>
      </div>

      <button
        onClick={() => router.push('/')}
        className="text-green-500 hover:text-green-600 transition-colors text-sm md:text-base font-robotoCondensed"
      >
        Thoát
      </button>
    </header>
  );
};

export default CreateCourseHeader;
