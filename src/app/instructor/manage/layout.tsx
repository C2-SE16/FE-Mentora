'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import InstructorCoursesSidebar from '@/layouts/InstructorCourse/InstructorCoursesSidebar';
import { Toaster } from 'react-hot-toast';

export default function InstructorCoursesLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname() ?? '';
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Xác định tab hiện tại dựa trên pathname
  const getCurrentTab = () => {
    if (pathname.includes('/course-content')) return 'course-content';
    if (pathname.includes('/assignments')) return 'assignments';
    if (pathname.includes('/students')) return 'students';
    if (pathname.includes('/analytics')) return 'analytics';
    if (pathname.includes('/settings')) return 'settings';
    return 'dashboard';
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
    <div className="min-h-screen flex">
      {/* Overlay để đóng menu khi click bên ngoài trên mobile */}
      {isMobile && isMobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${
          isMobile ? (isMobileMenuOpen ? 'block' : 'hidden') : 'block'
        } md:block fixed h-screen w-64 z-30 bg-[#1E1E1E]`}
      >
        <InstructorCoursesSidebar currentTab={getCurrentTab()} />
      </aside>

      {/* Main content container */}
      <main className="flex-1 w-full md:ml-64">
        <div className="h-full bg-white p-6">
          {children}
        </div>
      </main>
      
      <Toaster position="top-right" />
    </div>
  );
} 