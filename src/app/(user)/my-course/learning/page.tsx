'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Image from 'next/image';
import Link from 'next/link';
import axiosInstance from '@/lib/api/axios';

interface Instructor {
  instructorId: string;
  instructorName: string;
  profilePicture?: string;
}

interface Course {
  courseId: string;
  title: string;
  description?: string;
  thumbnail?: string;
  price?: number;
  rating?: number;
  instructor?: Instructor;
}

interface Enrollment {
  enrollmentId: string;
  enrolledAt: string;
  course: Course;
  progress?: number;
}

export default function LearningPage() {
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortOption, setSortOption] = useState('Đã truy cập gần đây');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterInstructor, setFilterInstructor] = useState('');
  const [filterProgress, setFilterProgress] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const { user, isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchEnrollments = async () => {
      if (!isLoggedIn) return;

      try {
        setLoading(true);
        const response = await axiosInstance.get('enrollments/my-courses');
        if (response.data.data.success) {
          const enrollmentsWithProgress = response.data.data.data.map((enrollment: Enrollment) => ({
            ...enrollment,
            progress: Math.floor(Math.random() * 100),
          }));

          setEnrollments(enrollmentsWithProgress);
        } else {
          setError('Không thể tải danh sách khóa học');
        }
      } catch (err: any) {
        console.error('Lỗi khi tải khóa học đã đăng ký:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchEnrollments();
  }, [isLoggedIn]);

  // Hàm xử lý thay đổi tùy chọn sắp xếp
  const handleSortChange = (option: string) => {
    setSortOption(option);
    // Logic sắp xếp sẽ được thêm vào đây
  };

  const renderStars = (rating: number = 0) => {
    return (
      <div className="flex">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
    );
  };

  // Hàm reset tất cả các filter
  const resetFilters = () => {
    setSortOption('Đã truy cập gần đây');
    setFilterCategory('');
    setFilterInstructor('');
    setFilterProgress('');
    setSearchQuery('');
  };

  // Lọc và sắp xếp enrollments dựa trên các filter hiện tại
  const filteredEnrollments = enrollments.filter((enrollment) => {
    const courseTitle = enrollment.course?.title?.toLowerCase() || '';
    const instructorName = enrollment.course?.instructor?.instructorName?.toLowerCase() || '';

    // Lọc theo tìm kiếm
    if (searchQuery && !courseTitle.includes(searchQuery.toLowerCase())) {
      return false;
    }

    // Lọc theo giảng viên
    if (filterInstructor && !instructorName.includes(filterInstructor.toLowerCase())) {
      return false;
    }

    // Lọc theo tiến độ - giả định
    if (filterProgress) {
      const progress = enrollment.progress || 0;
      if (filterProgress === 'not-started' && progress > 0) return false;
      if (filterProgress === 'in-progress' && (progress === 0 || progress === 100)) return false;
      if (filterProgress === 'completed' && progress < 100) return false;
    }

    return true;
  });

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Filters and Search Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4 md:mb-0">
            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Sắp xếp theo</span>
              <div className="relative inline-block">
                <select
                  value={sortOption}
                  onChange={(e) => handleSortChange(e.target.value)}
                  className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbe70] cursor-pointer"
                >
                  <option value="Đã truy cập gần đây">Đã truy cập gần đây</option>
                  <option value="newest">Mới nhất</option>
                  <option value="oldest">Cũ nhất</option>
                  <option value="a-z">A-Z</option>
                  <option value="z-a">Z-A</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="flex items-center">
              <span className="text-sm text-gray-600 mr-2">Lọc theo</span>
              <div className="flex items-center gap-2">
                <div className="relative inline-block">
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbe70] cursor-pointer"
                  >
                    <option value="">Danh mục</option>
                    <option value="web-development">Web Development</option>
                    <option value="database">Database</option>
                    <option value="programming">Programming</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative inline-block">
                  <select
                    value={filterProgress}
                    onChange={(e) => setFilterProgress(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbe70] cursor-pointer"
                  >
                    <option value="">Tiến độ</option>
                    <option value="not-started">Chưa bắt đầu</option>
                    <option value="in-progress">Đang học</option>
                    <option value="completed">Đã hoàn thành</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>

                <div className="relative inline-block">
                  <select
                    value={filterInstructor}
                    onChange={(e) => setFilterInstructor(e.target.value)}
                    className="appearance-none border border-gray-300 rounded-md py-2 pl-3 pr-8 bg-white focus:outline-none focus:ring-2 focus:ring-[#1dbe70] cursor-pointer"
                  >
                    <option value="">Giảng viên</option>
                    {/* Động lập danh sách giảng viên từ dữ liệu API */}
                    {Array.from(
                      new Set(enrollments.map((item) => item.course?.instructor?.instructorName))
                    )
                      .filter(Boolean)
                      .map((name) => (
                        <option key={name} value={name}>
                          {name}
                        </option>
                      ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="relative w-full md:w-auto">
            <input
              type="text"
              placeholder="Tìm kiếm khóa học của bạn"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
            />
            <button className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <svg
                className="w-5 h-5 text-gray-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <button onClick={resetFilters} className="text-[#1dbe70] hover:underline flex items-center">
          <span>Thiết lập lại</span>
        </button>
      </div>

      {/* Course List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          Array(4)
            .fill(0)
            .map((_, index) => (
              <div key={index} className="bg-white rounded-lg shadow-md p-4 animate-pulse">
                <div className="h-40 bg-gray-200 rounded-md mb-4"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-2 bg-gray-200 rounded w-full"></div>
              </div>
            ))
        ) : error ? (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <div className="text-red-500 mb-2">
              <svg
                className="w-12 h-12 mx-auto"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Lỗi khi tải khóa học</h3>
            <p className="text-gray-500 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-[#1dbe70] text-white rounded-md hover:bg-[#18a862] transition-colors"
            >
              Thử lại
            </button>
          </div>
        ) : filteredEnrollments.length > 0 ? (
          filteredEnrollments.map((enrollment) => (
            <div
              key={enrollment.enrollmentId}
              className="bg-white rounded-lg shadow-md overflow-hidden relative group"
            >
              <div className="relative h-40 overflow-hidden">
                <Image
                  src={enrollment.course.thumbnail || '/course-placeholder.png'}
                  alt={enrollment.course.title}
                  width={300}
                  height={160}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity"></div>
              </div>
              <div className="p-4">
                <h3 className="font-semibold text-lg mb-1 line-clamp-2">
                  {enrollment.course.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">
                  {enrollment.course.instructor?.instructorName || 'Không có giảng viên'}
                </p>

                {enrollment.progress ? (
                  <>
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>Hoàn thành {enrollment.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-1.5 mb-4">
                      <div
                        className="h-1.5 rounded-full bg-[#1dbe70]"
                        style={{ width: `${enrollment.progress}%` }}
                      ></div>
                    </div>
                  </>
                ) : (
                  <div className="mb-4">
                    <span className="text-xs font-bold text-[#1dbe70]">BẮT ĐẦU KHÓA HỌC</span>
                  </div>
                )}

                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    {renderStars(enrollment.course.rating)}
                    {enrollment.course.rating ? (
                      <span className="ml-1 text-xs text-gray-500">
                        ({enrollment.course.rating})
                      </span>
                    ) : null}
                  </div>
                  <span className="text-xs text-gray-500">Đưa ra xếp hạng</span>
                </div>
              </div>

              <Link href={`/courses/${enrollment.course.courseId}`} className="absolute inset-0">
                <span className="sr-only">Học khóa học</span>
              </Link>

              <button
                className="absolute top-2 right-2 p-1 bg-white rounded-full shadow-md z-10"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  // Toggle wishlist logic here
                }}
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z"
                  />
                </svg>
              </button>
            </div>
          ))
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center py-12">
            <svg
              className="w-16 h-16 text-gray-400 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
              />
            </svg>
            <h3 className="text-lg font-medium text-gray-900 mb-1">Chưa có khóa học nào</h3>
            <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào.</p>
            <Link
              href="/courses"
              className="px-4 py-2 bg-[#1dbe70] text-white rounded-md hover:bg-[#18a862] transition-colors"
            >
              Khám phá khóa học
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
