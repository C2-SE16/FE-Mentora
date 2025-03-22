'use client';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import axiosInstance from '@/lib/api/axios';
import { CreateCourseService } from '@/apis/createCourseService';
interface ManageCourseHeaderProps {
  title?: string;
  courseId: string;
  status?: 'DRAFT' | 'PUBLISHED' | 'PENDING';
  onBack?: () => void;
}

interface CourseDetails {
  title: string;
  approved: 'DRAFT' | 'PUBLISHED' | 'PENDING';
}

const ManageCourseHeader = ({ title, courseId, status, onBack }: ManageCourseHeaderProps) => {
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [courseDetails, setCourseDetails] = useState<CourseDetails | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourseDetails = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        const courseData = await CreateCourseService.getCourseDetails(courseId);
        const validStatus = ['DRAFT', 'PUBLISHED', 'PENDING'].includes(courseData.approved) 
          ? (courseData.approved as 'DRAFT' | 'PUBLISHED' | 'PENDING') 
          : 'DRAFT';

        setCourseDetails({
          title: courseData.title || 'Khóa học không có tiêu đề',
          approved: validStatus,
        });
      } catch (error: any) {
        console.error('Lỗi khi lấy thông tin khóa học:', error);
        setCourseDetails({
          title: 'Không thể tải thông tin khóa học',
          approved: 'DRAFT',
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetails();
  }, [courseId]);

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      router.push('/instructor/courses');
    }
  };

  const getStatusColor = () => {
    const currentStatus = status || courseDetails?.approved || 'DRAFT';

    switch (currentStatus) {
      case 'PUBLISHED':
        return 'bg-green-100 text-green-800';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800';
      case 'DRAFT':
      default:
        return 'bg-gray-200 text-gray-800';
    }
  };

  const displayTitle = title || courseDetails?.title || 'Đang tải...';
  const displayStatus = status || courseDetails?.approved || 'DRAFT';

  return (
    <header className="bg-[#1e1e2d] text-white flex justify-between items-center py-3 px-4 sm:px-6 md:px-8 h-[60px]">
      <div className="flex items-center">
        <button
          onClick={handleBack}
          className="mr-4 hover:text-gray-300 transition-colors"
          aria-label="Quay lại"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            ></path>
          </svg>
        </button>
        <span className="font-medium mr-2">Quay lại khóa học</span>
        <h1 className="text-lg font-bold truncate max-w-[200px] sm:max-w-xs md:max-w-md">
          {isLoading ? 'Đang tải...' : displayTitle}
        </h1>
      </div>

      <div className="flex items-center">
        <span className={`text-xs px-2 py-1 rounded-md font-medium mr-4 ${getStatusColor()}`}>
          {displayStatus}
        </span>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="relative p-1 rounded-full hover:bg-gray-700 transition-colors"
          aria-label="Cài đặt"
        >
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
            ></path>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            ></path>
          </svg>

          {isMenuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
              <div className="py-1">
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Thêm hành động chỉnh sửa khóa học
                  }}
                >
                  Chỉnh sửa khóa học
                </button>
                <button
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={() => {
                    setIsMenuOpen(false);
                    // Thêm hành động xóa khóa học
                  }}
                >
                  Xóa khóa học
                </button>
              </div>
            </div>
          )}
        </button>
      </div>
    </header>
  );
};

export default ManageCourseHeader;
