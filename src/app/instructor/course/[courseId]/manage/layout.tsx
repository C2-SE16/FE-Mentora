'use client';
import { usePathname, useRouter } from 'next/navigation';
import ManageCourseHeader from '@/layouts/ManageCourse/ManageCourseHeader';
import ManageCourseSidebar from '@/layouts/ManageCourse/ManageCourseSidebar';
import { useState, useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function ManageCourseLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const courseId = pathname.split('/')[3] || '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Xác định bước hiện tại dựa trên pathname
  const currentStep = pathname.includes('/goals')
    ? 'intended-learners'
    : pathname.includes('/setup-test')
      ? 'setup-test'
      : 'intended-learners';

  // Kiểm tra kích thước màn hình và đóng menu khi chuyển trang
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Kiểm tra ban đầu
    checkIfMobile();

    // Thêm event listener để kiểm tra khi thay đổi kích thước màn hình
    window.addEventListener('resize', checkIfMobile);

    // Đóng menu khi chuyển trang
    setIsMobileMenuOpen(false);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, [pathname]);

  // Kiểm tra nếu pathname chứa quiz thì không render layout
  if (pathname.includes('/quiz')) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <ManageCourseHeader
        courseId={courseId}
        onBack={() => router.push('/instructor/manage/courses')}
        onMenuToggle={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        isMobile={isMobile}
      />

      <div className="flex flex-1 relative">
        {/* Overlay để đóng menu khi click bên ngoài trên mobile */}
        {isMobile && isMobileMenuOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden"
            style={{ zIndex: 20 }}
            onClick={() => setIsMobileMenuOpen(false)}
          />
        )}

        {/* Sidebar container với z-index cao hơn overlay */}
        <div
          className={`${
            isMobile ? (isMobileMenuOpen ? 'block' : 'hidden') : 'block'
          } md:block fixed md:static w-64 h-[calc(100vh-60px)] z-30`}
        >
          <ManageCourseSidebar courseId={courseId} currentStep={currentStep} />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-white overflow-y-auto">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
