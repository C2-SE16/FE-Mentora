'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { toast } from 'react-hot-toast';
import api from '@/apis/api';

interface InstructorDetail {
  instructorId: string;
  userId: string | null;
  instructorName: string | null;
  bio: string | null;
  profilePicture: string | null;
  experience: string | null;
  isVerified: boolean | null;
  averageRating: number;
  createdAt: string | null;
  updatedAt: string | null;
  user: {
    fullName: string | null;
    title: string | null;
    description: string | null;
    avatar: string | null;
    facebookLink: string | null;
    linkedinLink: string | null;
    youtubeLink: string | null;
    websiteLink: string | null;
  } | null;
  statistics: {
    totalStudents: number;
    totalReviews: number;
    totalCourses: number;
    averageRating: number;
  };
  courses: {
    courseId: string;
    title: string;
    description: string | null;
    thumbnail: string | null;
    price: number;
    rating: number;
    durationTime: number | null;
    enrollmentCount: number;
    categories: {
      name: string;
    }[];
  }[];
}

const InstructorProfilePage = () => {
  const params = useParams();
  const instructorSlug = params?.instructorSlug as string;
  const instructorId = params?.instructorId as string;

  const [instructorData, setInstructorData] = useState<InstructorDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showFullBio, setShowFullBio] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  console.log('instructorData:::', instructorData);
  // Fix hydration issue
  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const fetchInstructorData = async () => {
      try {
        setIsLoading(true);
        setError(null);

        if (!instructorId) {
          setError('Instructor ID is required');
          return;
        }

        const response = await api.get(`instructor/${instructorId}`);
        console.log('response instructor:::', response.data);

        if (response.status === 200 && response.data) {
          setInstructorData(response.data.data);
        } else {
          setError('Không tìm thấy thông tin giảng viên');
        }
      } catch (error) {
        console.error('Error fetching instructor data:', error);
        setError('Không thể tải thông tin giảng viên');
        toast.error('Không thể tải thông tin giảng viên');
      } finally {
        setIsLoading(false);
      }
    };

    if (mounted && instructorId) {
      fetchInstructorData();
    }
  }, [instructorId, mounted]);

  // Format price helper
  const formatPrice = (price: number) => {
    return `${price.toLocaleString('vi-VN')}₫`;
  };

  // Format duration helper
  const formatDuration = (minutes: number | null) => {
    if (!minutes) return 'N/A';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
  };

  // Don't render anything until mounted (fix hydration)
  if (!mounted) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin giảng viên...</p>
        </div>
      </div>
    );
  }

  if (error || !instructorData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Không tìm thấy giảng viên</h1>
          <p className="text-gray-600 mb-4">
            {error || `Giảng viên với ID ${instructorId} không tồn tại.`}
          </p>
          <Link
            href="/"
            className="bg-[#29cc66] text-white px-6 py-2 rounded-lg hover:bg-[#25ad53] transition-colors"
          >
            Về trang chủ
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SEO Meta (you might want to use next/head or metadata API) */}
      <title>
        {instructorData.user?.fullName || instructorData.instructorName} - Giảng viên tại Mentora
      </title>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="mb-8">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li>
              <Link href="/" className="hover:text-[#29cc66]">
                Trang chủ
              </Link>
            </li>
            <li>/</li>
            <li>
              <Link href="/instructors" className="hover:text-[#29cc66]">
                Giảng viên
              </Link>
            </li>
            <li>/</li>
            <li className="text-gray-900 font-medium">
              {instructorData.user?.fullName || instructorData.instructorName}
            </li>
          </ol>
        </nav>

        {/* Header Section */}
        <div className="bg-gradient-to-r from-purple-100 to-blue-100 rounded-lg p-8 mb-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
            {/* Left Side - Instructor Info */}
            <div className="flex-1">
              <div className="text-sm font-medium text-gray-600 mb-2 uppercase tracking-wide">
                GIẢNG VIÊN
                {instructorData.isVerified && (
                  <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    ✓ Đã xác thực
                  </span>
                )}
              </div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                {instructorData.user?.fullName || instructorData.instructorName}
              </h1>
              <p className="text-lg text-gray-700 mb-6">
                {instructorData.user?.title || instructorData.bio || 'Giảng viên'}
              </p>

              {/* Stats */}
              <div className="flex flex-wrap gap-8 mb-6">
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {instructorData.statistics?.totalStudents?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Tổng số học viên</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-gray-900">
                    {instructorData.statistics?.totalReviews?.toLocaleString() || '0'}
                  </div>
                  <div className="text-sm text-gray-600">Đánh giá</div>
                </div>
                <div>
                  <div className="flex items-center gap-1 text-2xl font-bold text-gray-900">
                    <span className="text-yellow-500">★</span>
                    {instructorData.statistics?.averageRating?.toFixed(1) || '0.0'}
                  </div>
                  <div className="text-sm text-gray-600 ml-1">Xếp hạng</div>
                </div>
              </div>

              {/* Social Links */}
              <div className="flex gap-4">
                {instructorData.user?.facebookLink && (
                  <Link
                    href={instructorData.user.facebookLink}
                    className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center text-white hover:bg-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </Link>
                )}
                {instructorData.user?.linkedinLink && (
                  <Link
                    href={instructorData.user.linkedinLink}
                    className="w-12 h-12 bg-blue-800 rounded-lg flex items-center justify-center text-white hover:bg-blue-900 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                    </svg>
                  </Link>
                )}
                {instructorData.user?.youtubeLink && (
                  <Link
                    href={instructorData.user.youtubeLink}
                    className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center text-white hover:bg-red-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </Link>
                )}
                {instructorData.user?.websiteLink && (
                  <Link
                    href={instructorData.user.websiteLink}
                    className="w-12 h-12 bg-gray-600 rounded-lg flex items-center justify-center text-white hover:bg-gray-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9m0 9a9 9 0 01-9-9m9 9c0 5.523-4.477 10-10 10s-10-4.477-10-10 4.477-10 10-10 10 4.477 10 10z"
                      />
                    </svg>
                  </Link>
                )}
              </div>
            </div>

            {/* Right Side - Avatar */}
            <div className="flex-shrink-0">
              <div className="w-48 h-48 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
                <Image
                  src={
                    instructorData.profilePicture || instructorData.user?.avatar || '/avatar.png'
                  }
                  alt={
                    instructorData.user?.fullName || instructorData.instructorName || 'Instructor'
                  }
                  width={192}
                  height={192}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = 'https://via.placeholder.com/192x192?text=Avatar';
                  }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Bio Section */}
        {(instructorData.bio || instructorData.user?.description) && (
          <div className="bg-white rounded-lg p-8 mb-8 shadow-sm">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Giới thiệu về giảng viên</h2>
            <div className="text-gray-700 leading-relaxed">
              <div className={`${showFullBio ? '' : 'line-clamp-6'}`}>
                {instructorData.bio && (
                  <div className="mb-4">
                    {instructorData.bio.split('\n').map((paragraph: string, index: number) => (
                      <p key={index} className="mb-4">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                )}
                {instructorData.user?.description && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Mô tả:</h3>
                    {instructorData.user.description
                      .split('\n')
                      .map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )}
                {/* {instructorData.experience && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-2">Kinh nghiệm:</h3>
                    {instructorData.experience
                      .split('\n')
                      .map((paragraph: string, index: number) => (
                        <p key={index} className="mb-4">
                          {paragraph}
                        </p>
                      ))}
                  </div>
                )} */}
              </div>
              <button
                onClick={() => setShowFullBio(!showFullBio)}
                className="text-[#29cc60] hover:text-[#25ad53] font-medium mt-4 flex items-center gap-2"
              >
                {showFullBio ? 'Hiển thị ít hơn' : 'Hiển thị thêm'}
                <svg
                  className={`w-4 h-4 transform transition-transform ${showFullBio ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>
            </div>
          </div>
        )}

        {/* Courses Section */}
        <div className="bg-white rounded-lg p-8 shadow-sm">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">
            Các khóa học của {instructorData.user?.fullName || instructorData.instructorName} (
            {instructorData.statistics?.totalCourses || 0})
          </h2>

          {!instructorData.courses || instructorData.courses.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Chưa có khóa học nào được xuất bản.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {instructorData.courses.map((course) => (
                <Link
                  key={course.courseId}
                  href={`/courses/${course.courseId}`}
                  className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow"
                >
                  <div className="relative">
                    <div className="aspect-video bg-gray-200 relative overflow-hidden">
                      <Image
                        src={
                          course.thumbnail ||
                          'https://via.placeholder.com/400x225?text=Course+Image'
                        }
                        alt={course.title}
                        width={400}
                        height={225}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src =
                            'https://via.placeholder.com/400x225?text=Course+Image';
                        }}
                      />
                    </div>
                    {course.rating >= 4.5 && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-[#29cc60] text-white text-xs font-bold px-3 py-1 rounded-full">
                          Bán chạy
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <h3 className="font-bold text-lg text-gray-900 mb-2 line-clamp-2">
                      {course.title}
                    </h3>

                    {course.description && (
                      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                        {course.description}
                      </p>
                    )}

                    <div className="flex items-center gap-2 mb-3">
                      <div className="flex items-center">
                        <span className="text-yellow-500 mr-1">★</span>
                        <span className="text-sm font-medium text-gray-700">
                          {course.rating?.toFixed(1) || '0.0'}
                        </span>
                      </div>
                      <span className="text-gray-400">•</span>
                      <span className="text-sm text-gray-600">
                        {course.enrollmentCount?.toLocaleString() || '0'} học viên
                      </span>
                      {course.durationTime && (
                        <>
                          <span className="text-gray-400">•</span>
                          <span className="text-sm text-gray-600">
                            {formatDuration(course.durationTime)}
                          </span>
                        </>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-lg font-bold text-gray-900">
                        {formatPrice(course.price || 0)}
                      </div>
                      {course.categories && course.categories.length > 0 && (
                        <div className="flex flex-wrap gap-1">
                          {course.categories.slice(0, 2).map((category, index: number) => (
                            <span
                              key={index}
                              className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded"
                            >
                              {category.name}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InstructorProfilePage;
