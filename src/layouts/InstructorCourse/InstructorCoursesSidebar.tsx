'use client';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

interface InstructorCoursesSidebarProps {
  currentTab?: string;
}

const InstructorCoursesSidebar = ({ currentTab = 'dashboard' }: InstructorCoursesSidebarProps) => {
  const router = useRouter();
  const pathname = usePathname() || '';
  const courseId = pathname.split('/')[3] || '';

  const sidebarItems = [
    {
      id: 'dashboard',
      title: 'Khóa học',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <rect x="3" y="3" width="7" height="9" />
          <rect x="14" y="3" width="7" height="5" />
          <rect x="14" y="12" width="7" height="9" />
          <rect x="3" y="16" width="7" height="5" />
        </svg>
      ),
      path: `/instructor/manage/courses`,
    },
    // {
    //   id: 'course-content',
    //   title: 'Nội dung khóa học',
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    //       <path d="M14 2v6h6" />
    //       <path d="M16 13H8" />
    //       <path d="M16 17H8" />
    //       <path d="M10 9H8" />
    //     </svg>
    //   ),
    //   path: `/instructor/course/${courseId}/course-content`,
    // },
    // {
    //   id: 'assignments',
    //   title: 'Bài tập',
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M9 11l3 3L22 4" />
    //       <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
    //     </svg>
    //   ),
    //   path: `/instructor/course/${courseId}/assignments`,
    // },
    // {
    //   id: 'students',
    //   title: 'Học viên',
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    //       <circle cx="9" cy="7" r="4" />
    //       <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    //       <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    //     </svg>
    //   ),
    //   path: `/instructor/course/${courseId}/students`,
    // },
    {
      id: 'analytics',
      title: 'Thống kê',
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <line x1="18" y1="20" x2="18" y2="10" />
          <line x1="12" y1="20" x2="12" y2="4" />
          <line x1="6" y1="20" x2="6" y2="14" />
        </svg>
      ),
      path: `/instructor/manage/analytics`,
    },
    // {
    //   id: 'settings',
    //   title: 'Cài đặt',
    //   icon: (
    //     <svg
    //       xmlns="http://www.w3.org/2000/svg"
    //       width="24"
    //       height="24"
    //       viewBox="0 0 24 24"
    //       fill="none"
    //       stroke="currentColor"
    //       strokeWidth="2"
    //       strokeLinecap="round"
    //       strokeLinejoin="round"
    //     >
    //       <circle cx="12" cy="12" r="3" />
    //       <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
    //     </svg>
    //   ),
    //   path: `/instructor/course/${courseId}/settings`,
    // },
  ];

  return (
    <aside className="w-full md:w-64 h-full bg-[#1c1d1f] text-white overflow-y-auto border-r border-gray-700">
      <div className="p-4 border-b border-gray-700">
        <Link href="/" className="flex items-center">
          <Image
            src="/mentora-footer.svg"
            alt="logo"
            width={120}
            height={120}
            priority
            className="cursor-pointer"
          />
        </Link>
      </div>

      <nav className="mt-2">
        <ul className="space-y-1">
          {sidebarItems.map((item) => {
            const isActive = currentTab === item.id;

            return (
              <li key={item.id}>
                <Link
                  href={item.path}
                  className={`flex items-center px-4 py-3 text-sm ${
                    isActive
                      ? 'bg-[#3e4143] border-l-4 border-['
                      : 'hover:bg-[#3e4143] border-l-4 border-transparent'
                  }`}
                >
                  <span className={`mr-3 ${isActive ? 'text-[#2cbb78]' : 'text-gray-400'}`}>
                    {item.icon}
                  </span>
                  <span>{item.title}</span>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="absolute bottom-0 w-full border-t border-gray-700">
        <Link
          href="/instructor/course"
          className="flex items-center px-4 py-3 text-sm hover:bg-[#3e4143]"
        >
          <span className="mr-3 text-gray-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
          </span>
          <span>Quay lại danh sách khóa học</span>
        </Link>
      </div>
    </aside>
  );
};

export default InstructorCoursesSidebar;
