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
  currentPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
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
  appliedVoucher?: {
    code: string;
    discountAmount: number;
    discountType: string;
    finalPrice: number;
  } | null;
}

export default function InstructorCourses() {
  const [courses, setCourses] = useState<InstructorCourse[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        const data = await InstructorCourseService.getInstructorCourses();
        console.log('data instructor courses', data);
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

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#2cbb78]"></div>
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
              className="bg-[#2cbb78] hover:bg-[#54c78f] text-white font-bold py-2 px-4 rounded"
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
                  {/* Discount Badge */}
                  {course.hasDiscount && (
                    <div className="absolute top-2 left-2 z-10">
                      <span className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        -
                        {Math.round(
                          ((course.originalPrice - course.currentPrice) / course.originalPrice) *
                            100
                        )}
                        %
                      </span>
                    </div>
                  )}

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
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <Link href={`/instructor/course/${course.courseId}/manage/goals`}>
                        <h2 className="text-xl font-bold text-gray-800 hover:text-[#2cbb78] transition duration-200">
                          {course.title}
                        </h2>
                      </Link>
                      <p className="text-gray-600 mt-2 line-clamp-2">
                        {course.description || 'Chưa có mô tả'}
                      </p>
                    </div>

                    {/* Action Button */}
                    <Link
                      href={`/instructor/course/${course.courseId}/manage/promotions`}
                      className="ml-4 bg-blue-500 hover:bg-blue-600 text-white text-sm px-3 py-1 rounded transition duration-200"
                    >
                      Quản lý khuyến mãi
                    </Link>
                  </div>

                  <div className="mt-4 flex items-center text-sm text-gray-500">
                    <span className="font-medium">Trạng thái: </span>
                    <span
                      className={`ml-2 px-2 py-1 rounded-full text-xs ${
                        course.approved === 'APPROVED'
                          ? 'bg-green-100 text-green-800'
                          : course.approved === 'PENDING'
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-purple-100 text-purple-800'
                      }`}
                    >
                      {course.approved === 'APPROVED'
                        ? 'Đã phê duyệt'
                        : course.approved === 'PENDING'
                          ? 'Đang chờ duyệt'
                          : 'Bản nháp'}
                    </span>
                  </div>

                  {/* Price Information */}
                  <div className="mt-1 flex items-center text-sm">
                    <span className="font-medium text-gray-500">Giá: </span>
                    <div className="ml-2 flex items-center gap-2">
                      {course.hasDiscount ? (
                        <>
                          <span className="text-lg font-bold text-red-600">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(course.currentPrice)}
                          </span>
                          <span className="text-sm text-gray-500 line-through">
                            {new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(course.originalPrice)}
                          </span>
                        </>
                      ) : (
                        <span className="text-lg font-bold text-gray-800">
                          {course.price > 0
                            ? new Intl.NumberFormat('vi-VN', {
                                style: 'currency',
                                currency: 'VND',
                              }).format(course.price)
                            : 'Miễn phí'}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Applied Voucher Information */}
                  {course.appliedVoucher && (
                    <div className="mt-2 p-3 bg-green-50 border border-green-200 rounded-md">
                      <div className="flex items-center gap-2">
                        <svg
                          className="w-4 h-4 text-green-600"
                          fill="currentColor"
                          viewBox="0 0 20 20"
                        >
                          <path
                            fillRule="evenodd"
                            d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                        <span className="text-sm font-medium text-green-800">
                          Voucher đã áp dụng: {course.appliedVoucher.code}
                        </span>
                      </div>
                      <div className="mt-1 text-xs text-green-600">
                        Giảm{' '}
                        {course.appliedVoucher.discountType === 'Percentage'
                          ? `${Math.round(((course.originalPrice - course.currentPrice) / course.originalPrice) * 100)}%`
                          : new Intl.NumberFormat('vi-VN', {
                              style: 'currency',
                              currency: 'VND',
                            }).format(course.appliedVoucher.discountAmount)}{' '}
                        • Tiết kiệm{' '}
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND',
                        }).format(course.originalPrice - course.currentPrice)}
                      </div>
                    </div>
                  )}

                  <div className="mt-1 flex items-center text-sm text-gray-500">
                    <span className="font-medium">Đánh giá: </span>
                    <span className="ml-2 flex items-center">
                      <svg
                        className="w-4 h-4 text-yellow-400 mr-1"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                      {course.rating > 0 ? course.rating.toFixed(1) : 'N/A'} ({course.reviewCount}{' '}
                      đánh giá)
                    </span>
                  </div>
                  <div className="mt-1 flex flex-wrap gap-1">
                    {course.categories.map((category) => (
                      <span
                        key={category.categoryId}
                        className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
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
