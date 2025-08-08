'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { InstructorCourseService } from '@/apis/instructorCourseService';

interface InstructorCourse {
  courseId: string;
  title: string;
  description: string | null;
  overview: string | null;
  durationTime: number | null;
  price: number;
  approved: string;
  rating: number;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  categories: {
    categoryId: string;
    name: string;
  }[];
  instructor: {
    instructorId: string;
    name: string;
    avatar: string | null;
  };
  reviewCount: number;
  enrollments: {
    userId: string;
    courseEnrollmentId: string;
    enrolledAt: string;
    courseId: string;
    user: {
      userId: string;
      fullName: string;
      avatar: string | null;
    } | null;
  }[];
}

export default function InstructorCoursesAnalytics() {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  // Tính toán tổng số người đã mua
  const totalEnrollments = courses.reduce((total, course) => total + course.enrollments.length, 0);

  // Tính toán doanh thu
  const totalRevenue = courses.reduce((total, course) => {
    return total + course.price * course.enrollments.length;
  }, 0);

  // Tính toán số khóa học đã được phê duyệt
  const approvedCourses = courses.filter((course) => course.approved === 'APPROVED').length;

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await InstructorCourseService.getInstructorCourses();
        setCourses(data);
        setError(null);
      } catch (err: any) {
        console.error('Lỗi trong component:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải khóa học');
        setCourses([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, []);

  const filteredCourses = courses.filter((course) =>
    course.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    if (sortOption === 'Newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    } else if (sortOption === 'Oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
    } else if (sortOption === 'A-Z') {
      return a.title.localeCompare(b.title);
    } else if (sortOption === 'Z-A') {
      return b.title.localeCompare(a.title);
    }
    return 0;
  });

  const getProgressBarWidth = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'w-full';
      case 'PENDING':
        return 'w-1/2';
      case 'DRAFT':
        return 'w-1/4';
      default:
        return 'w-1/4';
    }
  };

  const getProgressBarColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return 'bg-green-500';
      case 'PENDING':
        return 'bg-yellow-500';
      case 'DRAFT':
      default:
        return 'bg-purple-500';
    }
  };

  // Chuyển sang dùng background color thay vì placeholder image
  const getCategoryColor = (categoryName: string) => {
    const colors: Record<string, string> = {
      INFORMATION_TECHNOLOGY: 'bg-blue-500',
      MARKETING: 'bg-green-500',
      BUSINESS: 'bg-yellow-500',
      DESIGN: 'bg-purple-500',
      PHOTOGRAPHY: 'bg-pink-500',
      MUSIC: 'bg-indigo-500',
      HEALTH: 'bg-red-500',
    };

    // Lấy category đầu tiên nếu có
    if (categoryName) {
      return colors[categoryName] || 'bg-gray-400';
    }

    return 'bg-gray-400';
  };

  return (
    <div className="p-6">
      {/* Thống kê tổng quan */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Tổng số học viên</h2>
              <p className="text-2xl font-semibold text-gray-800">{totalEnrollments}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Tổng doanh thu</h2>
              <p className="text-2xl font-semibold text-gray-800">
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND',
                }).format(totalRevenue)}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                />
              </svg>
            </div>
            <div className="ml-4">
              <h2 className="text-gray-600 text-sm">Khóa học đã phê duyệt</h2>
              <p className="text-2xl font-semibold text-gray-800">{approvedCourses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Thanh tìm kiếm và sắp xếp */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div className="flex-1 w-full sm:w-auto">
          <div className="relative">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học của bạn"
              className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cbb78]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
              <svg
                className="w-5 h-5"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M21 21L15 15M17 10C17 13.866 13.866 17 10 17C6.13401 17 3 13.866 3 10C3 6.13401 6.13401 3 10 3C13.866 3 17 6.13401 17 10Z"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>
        </div>

        <div className="flex gap-4 w-full sm:w-auto">
          <div className="w-full sm:w-40">
            <select
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cbb78]"
              value={sortOption}
              onChange={(e) => setSortOption(e.target.value)}
            >
              <option value="Newest">Mới nhất</option>
              <option value="Oldest">Cũ nhất</option>
              <option value="A-Z">A-Z</option>
              <option value="Z-A">Z-A</option>
            </select>
          </div>
          <Link
            href="/courses/create/step1"
            className="flex items-center justify-center bg-[#2cbb78] hover:bg-[#54c78f] text-white py-2 px-4 rounded-md transition duration-200"
          >
            Tạo khóa học mới
          </Link>
        </div>
      </div>

      {/* Danh sách khóa học */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
        </div>
      ) : error ? (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative"
          role="alert"
        >
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
          <p className="mt-2">Vui lòng thử lại sau hoặc liên hệ với quản trị viên.</p>
          <div className="mt-4">
            <button
              onClick={() => window.location.reload()}
              className="mr-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Thử lại
            </button>
            <Link
              href="/courses/create/step1"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
            >
              Tạo khóa học mới
            </Link>
          </div>
        </div>
      ) : sortedCourses.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
            />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">Không có khóa học nào</h3>
          <p className="mt-1 text-gray-500">Bắt đầu bằng cách tạo khóa học mới của bạn.</p>
          <div className="mt-6">
            <Link
              href="/courses/create/step1"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500"
            >
              Tạo khóa học mới
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {sortedCourses.map((course) => (
            <div key={course.courseId} className="bg-white rounded-lg shadow overflow-hidden">
              <div className="flex flex-col md:flex-row">
                <div className="md:w-48 h-40 relative">
                  {course.thumbnail ? (
                    <Image
                      src={course.thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div
                      className={`w-full h-full flex items-center justify-center ${getCategoryColor(course.categories[0]?.name)}`}
                    >
                      <span className="text-white text-2xl font-bold">
                        {course.title.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>
                <div className="flex-1 p-6">
                  <Link href={`/instructor/course/${course.courseId}/manage/goals`}>
                    <h2 className="text-xl font-bold text-gray-800 hover:text-purple-600 transition duration-200">
                      {course.title}
                    </h2>
                  </Link>
                  <p className="text-gray-600 mt-2 line-clamp-2">
                    {course.description || 'Chưa có mô tả'}
                  </p>

                  {/* Thông tin thống kê của khóa học */}
                  <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Học viên</p>
                      <p className="text-xl font-semibold text-gray-800">
                        {course.enrollments.length}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Doanh thu</p>
                      <p className="text-xl font-semibold text-gray-800">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(course.price * course.enrollments.length)}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Đánh giá</p>
                      <p className="text-xl font-semibold text-gray-800">
                        {course.rating > 0 ? course.rating.toFixed(1) : 'N/A'}
                      </p>
                    </div>
                    <div className="bg-gray-50 p-3 rounded-lg">
                      <p className="text-sm text-gray-600">Trạng thái</p>
                      <p
                        className={`text-xl font-semibold ${
                          course.approved === 'APPROVED'
                            ? 'text-green-600'
                            : course.approved === 'PENDING'
                              ? 'text-yellow-600'
                              : 'text-purple-600'
                        }`}
                      >
                        {course.approved === 'APPROVED'
                          ? 'Đã duyệt'
                          : course.approved === 'PENDING'
                            ? 'Chờ duyệt'
                            : 'Bản nháp'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1">
                    {course.categories.map((category) => (
                      <span
                        key={category.categoryId}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
                  </div>

                  <div className="mt-4">
                    <Link
                      href={`/instructor/manage/analytics/${course.courseId}`}
                      className="inline-flex items-center px-4 py-2 bg-[#2cbb78] hover:bg-[#54c78f] text-white rounded-md transition duration-200"
                    >
                      <span>Xem chi tiết</span>
                      <svg
                        className="w-4 h-4 ml-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
