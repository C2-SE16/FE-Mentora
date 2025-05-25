'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { InstructorCourseService } from '@/apis/instructorCourseService';

interface CourseEnrollment {
  userId: string;
  courseEnrollmentId: string;
  enrolledAt: string;
  courseId: string;
  user: {
    userId: string;
    fullName: string;
    avatar: string | null;
  } | null;
}

interface CourseDetail {
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
  enrollments: CourseEnrollment[];
}

export default function CourseAnalyticsDetail() {
  const params = useParams();
  const courseId = params?.courseId as string;
  if (!courseId) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">Không tìm thấy ID khóa học</span>
          <div className="mt-4">
            <Link
              href="/instructor/manage/analytics"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortOption, setSortOption] = useState('Newest');

  useEffect(() => {
    const fetchCourseDetail = async () => {
      try {
        setIsLoading(true);
        const courses = await InstructorCourseService.getInstructorCourses();
        const courseDetail = courses.find((c) => c.courseId === courseId);
        if (courseDetail) {
          setCourse(courseDetail);
        } else {
          throw new Error('Không tìm thấy khóa học');
        }
        setError(null);
      } catch (err: any) {
        console.error('Lỗi khi tải thông tin khóa học:', err);
        setError(err.message || 'Đã xảy ra lỗi khi tải thông tin khóa học');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseDetail();
  }, [courseId]);

  const filteredEnrollments =
    course?.enrollments.filter((enrollment) =>
      enrollment.user?.fullName.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const sortedEnrollments = [...filteredEnrollments].sort((a, b) => {
    if (sortOption === 'Newest') {
      return new Date(b.enrolledAt).getTime() - new Date(a.enrolledAt).getTime();
    } else if (sortOption === 'Oldest') {
      return new Date(a.enrolledAt).getTime() - new Date(b.enrolledAt).getTime();
    } else if (sortOption === 'A-Z') {
      return (a.user?.fullName || '').localeCompare(b.user?.fullName || '');
    } else if (sortOption === 'Z-A') {
      return (b.user?.fullName || '').localeCompare(a.user?.fullName || '');
    }
    return 0;
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="p-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
          <strong className="font-bold">Lỗi! </strong>
          <span className="block sm:inline">{error}</span>
          <div className="mt-4">
            <Link
              href="/instructor/manage/analytics"
              className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <Link
          href="/instructor/manage/analytics"
          className="inline-flex items-center text-gray-600 hover:text-gray-900"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Quay lại
        </Link>
      </div>

      {/* Thông tin khóa học */}
      <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-48 h-40 relative">
            {course.thumbnail ? (
              <Image
                src={course.thumbnail}
                alt={course.title}
                fill
                className="object-cover rounded-lg"
              />
            ) : (
              <div className="w-full h-full bg-gray-200 rounded-lg flex items-center justify-center">
                <span className="text-2xl font-bold text-gray-400">
                  {course.title.charAt(0).toUpperCase()}
                </span>
              </div>
            )}
          </div>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">{course.title}</h1>
            <p className="text-gray-600 mb-4">{course.description}</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-gray-50 p-3 rounded-lg">
                <p className="text-sm text-gray-600">Tổng học viên</p>
                <p className="text-xl font-semibold text-gray-800">{course.enrollments.length}</p>
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
          </div>
        </div>
      </div>

      {/* Danh sách học viên */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
          <div className="flex-1 w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                placeholder="Tìm kiếm học viên"
                className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#2cbb78]"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <button className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Học viên
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ngày đăng ký
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trạng thái
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sortedEnrollments.map((enrollment) => (
                <tr key={enrollment.courseEnrollmentId}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 relative">
                        {enrollment.user?.avatar ? (
                          <Image
                            src={enrollment.user.avatar}
                            alt={enrollment.user.fullName}
                            fill
                            className="rounded-full object-cover"
                          />
                        ) : (
                          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                            <span className="text-gray-500 font-medium">
                              {enrollment.user?.fullName.charAt(0).toUpperCase()}
                            </span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {enrollment.user?.fullName || 'Không xác định'}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {new Date(enrollment.enrolledAt).toLocaleDateString('vi-VN', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      Đã đăng ký
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {sortedEnrollments.length === 0 && (
          <div className="text-center py-8">
            <p className="text-gray-500">Không tìm thấy học viên nào</p>
          </div>
        )}
      </div>
    </div>
  );
}
