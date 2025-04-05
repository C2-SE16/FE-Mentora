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
  const getCurrentStep = () => {
    if (pathname.includes('/goals')) return 'intended-learners';
    if (pathname.includes('/setup-test')) return 'setup-test';
    // Thêm các bước khác tại đây
    return 'intended-learners'; // Mặc định
  };

  // Kiểm tra kích thước màn hình để xác định thiết bị
  useEffect(() => {
    const checkIfMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Kiểm tra ban đầu
    checkIfMobile();

    // Thêm event listener để kiểm tra khi thay đổi kích thước màn hình
    window.addEventListener('resize', checkIfMobile);

    // Cleanup
    return () => window.removeEventListener('resize', checkIfMobile);
  }, []);

  // Đóng menu khi chuyển trang trên thiết bị di động
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <ManageCourseHeader
        courseId={courseId}
        onBack={() => router.push('/instructor/courses')}
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
          <ManageCourseSidebar courseId={courseId} currentStep={getCurrentStep()} />
        </div>

        {/* Main content */}
        <main className="flex-1 bg-white overflow-y-auto">{children}</main>
      </div>
      <Toaster position="top-right" />
    </div>
  );
}
