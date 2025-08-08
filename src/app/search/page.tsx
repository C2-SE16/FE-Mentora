'use client';

import React, { useEffect, useState, useRef, useMemo } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import SearchResults from '@/components/modules/searchs/SearchResult';
import { Pagination } from '@/components/Pagination';
import SkeletonCourseCard from '@/components/CourseItem/SkeletonCourseCard';
import api from '@/apis/api';
import { useSearch } from '@/contexts/SearchContext';

const SearchPage = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { searchResults, setSearchResults, searchQuery, setSearchQuery } = useSearch();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [expandedSections, setExpandedSections] = useState({
    ratings: true,
    duration: false,
    level: false,
    language: false,
    price: false,
    features: false,
  });
  console.log('searchResults:::', searchResults);
  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [pageChanging, setPageChanging] = useState(false);
  const courseListRef = useRef<HTMLDivElement>(null);

  // Filter states
  const [ratingFilter, setRatingFilter] = useState<string>('');
  const [durationFilters, setDurationFilters] = useState({
    '0-1': false,
    '1-3': false,
    '3-6': false,
    '6-17': false,
    '17+': false,
  });
  const [sortBy, setSortBy] = useState('newest');

  const query = searchParams?.get('query') || '';
  const minRating = searchParams?.get('rating')
    ? parseFloat(searchParams.get('rating') || '0')
    : undefined;

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
    });
  };

  // Toggle duration filter checkboxes
  const toggleDurationFilter = (key: keyof typeof durationFilters) => {
    setDurationFilters({
      ...durationFilters,
      [key]: !durationFilters[key],
    });
  };

  // Format price in VND
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Function to update URL with new search parameters
  const updateSearchParams = (params: Record<string, string | null>) => {
    const urlSearchParams = new URLSearchParams(searchParams?.toString());

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    if (!('page' in params)) {
      urlSearchParams.set('page', '1');
    }

    // Build the new URL
    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    router.push(newUrl);
  };

  // Handle rating filter change
  const handleRatingChange = (rating: string) => {
    if (ratingFilter === rating) {
      setRatingFilter('');
      updateSearchParams({ rating: null });
    } else {
      setRatingFilter(rating);
      updateSearchParams({ rating: rating });
    }
  };

  // Pagination handler
  const handlePageChange = (pageNumber: number) => {
    setPageChanging(true);
    setCurrentPage(pageNumber);

    if (courseListRef.current) {
      courseListRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  useEffect(() => {
    // If the URL query doesn't match the context query, update context and fetch results
    if (query !== searchQuery) {
      setSearchQuery(query);
      fetchSearchResults(query);
    }
    // If there are no results but we have a query, fetch them
    else if (searchResults.length === 0 && query) {
      fetchSearchResults(query);
    }
  }, [query, searchQuery, searchResults.length]);

  const fetchSearchResults = async (searchQuery: string) => {
    if (!searchQuery) return;

    setIsLoading(true);
    setError(null);
    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      const response = await api.get('courses/search', {
        params: {
          query: searchQuery,
        },
        headers,
      });
      console.log('search response::', response);

      // Xử lý response theo cấu trúc mới
      let coursesData = [];

      if (response.data && response.data.data && response.data.data.courses) {
        coursesData = response.data.data.courses
          .map((item: any) => {
            return {
              courseId: item.courseId,
              title: item.title,
              shortDescription: item.description,
              thumbnail: item.thumbnail,
              price:
                typeof item.price === 'object'
                  ? parseFloat(item.price.toString())
                  : item.price || 0,
              rating:
                typeof item.rating === 'object'
                  ? parseFloat(item.rating.toString())
                  : item.rating || 0,
              totalReviews: item.tbl_course_reviews?.length || 0,
              isBestSeller: item.isBestSeller || false,
              isRecommended: item.isRecommended || false,
              durationTime: item.durationTime,
              overview: item.overview,
              tbl_instructors: item.tbl_instructors || {
                instructorId: item.instructorId,
                instructorName: 'Giảng viên',
              },
              // Thêm các trường khác từ response
            };
          })
          .filter(Boolean);
      }

      console.log('coursesData:::', coursesData);
      setSearchResults(coursesData);
      setPageChanging(false);
    } catch (error) {
      console.error('Error fetching search results:', error);
      setError('Failed to load search results. Please try again.');
      setSearchResults([]);
    } finally {
      setIsLoading(false);
      setPageChanging(false);
    }
  };

  // Calculate current items for pagination
  const currentResults = useMemo(() => {
    const indexOfLastCourse = currentPage * itemsPerPage;
    const indexOfFirstCourse = indexOfLastCourse - itemsPerPage;
    return searchResults.slice(indexOfFirstCourse, indexOfLastCourse);
  }, [searchResults, currentPage, itemsPerPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header with Search Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-oswald text-gray-900">
            {isLoading && !pageChanging
              ? 'Đang tìm kiếm...'
              : query
                ? `Kết quả tìm kiếm cho "${query}"`
                : 'Kết quả tìm kiếm'}
          </h1>
          {searchResults.length > 0 && (
            <p className="text-gray-600 mt-2">{searchResults.length} khóa học tìm thấy</p>
          )}
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-full md:w-1/4">
            {/* Rating Filter */}
            <div className="mb-6">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('ratings')}
              >
                <h3 className="font-medium text-lg">Xếp hạng</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.ratings ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {expandedSections.ratings && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-4.5"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={ratingFilter === '4.5'}
                      onChange={() => handleRatingChange('4.5')}
                    />
                    <label htmlFor="rating-4.5" className="ml-2 flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= 4.5 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700">Từ 4.5 trở lên</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-4.0"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={ratingFilter === '4.0'}
                      onChange={() => handleRatingChange('4.0')}
                    />
                    <label htmlFor="rating-4.0" className="ml-2 flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= 4 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700">Từ 4.0 trở lên</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-3.5"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={ratingFilter === '3.5'}
                      onChange={() => handleRatingChange('3.5')}
                    />
                    <label htmlFor="rating-3.5" className="ml-2 flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${
                              star <= 3
                                ? 'text-yellow-400'
                                : star === 4
                                  ? 'text-yellow-400 opacity-50'
                                  : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700">Từ 3.5 trở lên</span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-3.0"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={ratingFilter === '3.0'}
                      onChange={() => handleRatingChange('3.0')}
                    />
                    <label htmlFor="rating-3.0" className="ml-2 flex items-center">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <svg
                            key={star}
                            className={`w-4 h-4 ${star <= 3 ? 'text-yellow-400' : 'text-gray-300'}`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>
                      <span className="ml-2 text-gray-700">Từ 3.0 trở lên</span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Duration Filter */}
            <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('duration')}
              >
                <h3 className="font-medium text-lg">Thời lượng video</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.duration ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>

              {expandedSections.duration && (
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="duration-0-1"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={durationFilters['0-1']}
                      onChange={() => toggleDurationFilter('0-1')}
                    />
                    <label htmlFor="duration-0-1" className="ml-2 text-gray-700">
                      0-1 giờ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="duration-1-3"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={durationFilters['1-3']}
                      onChange={() => toggleDurationFilter('1-3')}
                    />
                    <label htmlFor="duration-1-3" className="ml-2 text-gray-700">
                      1-3 giờ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="duration-3-6"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={durationFilters['3-6']}
                      onChange={() => toggleDurationFilter('3-6')}
                    />
                    <label htmlFor="duration-3-6" className="ml-2 text-gray-700">
                      3-6 giờ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="duration-6-17"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={durationFilters['6-17']}
                      onChange={() => toggleDurationFilter('6-17')}
                    />
                    <label htmlFor="duration-6-17" className="ml-2 text-gray-700">
                      6-17 giờ
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="duration-17+"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      checked={durationFilters['17+']}
                      onChange={() => toggleDurationFilter('17+')}
                    />
                    <label htmlFor="duration-17+" className="ml-2 text-gray-700">
                      Hơn 17 giờ
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Level Filter */}
            <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('level')}
              >
                <h3 className="font-medium text-lg">Cấp độ</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.level ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {expandedSections.level && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div>

            {/* Language Filter */}
            <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('language')}
              >
                <h3 className="font-medium text-lg">Ngôn ngữ</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.language ? 'rotate-180' : ''}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              {expandedSections.language && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div>
          </div>

          {/* Right Content - Search Results */}
          <div className="w-full md:w-3/4">
            {/* Sorting Options */}
            <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-700">Kết quả tìm kiếm cho "{query}"</h2>

              <div className="flex items-center">
                <select
                  className="border-gray-300 rounded-md text-gray-700 py-1 pl-3 pr-10 bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1dbe70] focus:border-[#1dbe70]"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                >
                  <option value="newest">Mới nhất</option>
                  <option value="popular">Phổ biến nhất</option>
                  <option value="rating">Đánh giá cao nhất</option>
                  <option value="price-low">Giá thấp đến cao</option>
                  <option value="price-high">Giá cao đến thấp</option>
                </select>
              </div>
            </div>

            {/* Course List Container */}
            <div ref={courseListRef} className="min-h-[800px] relative courses-container">
              {isLoading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-t-4 border-[#1dbe70] border-solid rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => fetchSearchResults(query)}
                    className="bg-[#1dbe70] text-white px-4 py-2 rounded hover:bg-[#18a862]"
                  >
                    Thử lại
                  </button>
                </div>
              ) : searchResults.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow-sm">
                  <div className="mx-auto w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
                    <svg
                      className="w-8 h-8 text-gray-400"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                      />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-700 mb-2">
                    Không tìm thấy khóa học
                  </h3>
                  <p className="text-gray-500">
                    Không có khóa học nào phù hợp với từ khóa "{query}".
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-4 transition-opacity duration-300"
                  style={{ opacity: pageChanging ? 0.6 : 1 }}
                >
                  {pageChanging
                    ? Array(itemsPerPage)
                        .fill(0)
                        .map((_, index) => <SkeletonCourseCard key={`skeleton-${index}`} />)
                    : currentResults.map((course) => (
                        <div
                          key={course.courseId}
                          className="group relative transition-all duration-300"
                          suppressHydrationWarning={true}
                        >
                          <Link
                            href={`/courses/${course.courseId}`}
                            className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                          >
                            {/* Course Image */}
                            <div className="w-full md:w-64 h-48 md:h-auto relative">
                              {course.thumbnail ? (
                                <Image
                                  src={course.thumbnail}
                                  alt={course.title || 'Khóa học'}
                                  fill
                                  className="object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-200">
                                  <span className="text-gray-400">Không có ảnh</span>
                                </div>
                              )}
                              {course.isBestSeller && (
                                <div className="absolute top-2 left-2 bg-[#f69c08] text-white text-xs px-2 py-1 rounded">
                                  Bán chạy
                                </div>
                              )}
                            </div>

                            {/* Course Content */}
                            <div className="flex-1 p-4 flex flex-col">
                              {/* Title and Price Row */}
                              <div className="flex justify-between items-start mb-2">
                                <h3 className="text-xl font-bold text-gray-900 hover:text-[#1dbe70] transition-colors line-clamp-2 flex-1 pr-3">
                                  {course.title || 'Khóa học không tên'}
                                </h3>
                                <div className="text-xl font-bold text-black whitespace-nowrap">
                                  {formatPrice(course.price || 0)}
                                </div>
                              </div>

                              {course.shortDescription && (
                                <p className="text-sm text-gray-600 mb-2 line-clamp-2">
                                  {course.shortDescription}
                                </p>
                              )}

                              <p className="text-sm text-gray-700 mb-1">
                                {course.tbl_instructors?.instructorName || 'Giảng viên'}
                              </p>

                              <div className="flex items-center mb-2">
                                <span className="text-[#e59819] font-bold mr-1">
                                  {course.rating ? course.rating.toFixed(1) : '5.0'}
                                </span>
                                <div className="flex">
                                  {[1, 2, 3, 4, 5].map((star) => (
                                    <svg
                                      key={star}
                                      className={`w-4 h-4 ${star <= Math.round(course.rating || 5) ? 'text-[#e59819]' : 'text-gray-300'}`}
                                      fill="currentColor"
                                      viewBox="0 0 20 20"
                                    >
                                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                    </svg>
                                  ))}
                                </div>
                                <span className="text-xs text-gray-500 ml-1">
                                  ({course.totalReviews || 0})
                                </span>
                              </div>

                              <div className="text-xs text-gray-500 mb-2">
                                Tổng số 5 giờ • 20 bài giảng • Tất cả các cấp độ
                              </div>

                              {/* Tag for course at bottom */}
                              <div className="mt-auto">
                                <span className="inline-block bg-[#d1e7dd] text-[#0f5132] text-xs px-2 py-0.5 rounded">
                                  Mới
                                </span>
                              </div>
                            </div>
                          </Link>

                          {/* Course Hover Popup */}
                          <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10 w-96 bg-white shadow-lg rounded-lg left-1/2 bottom-full mb-4 transform -translate-x-1/2">
                            {/* Arrow pointer - pointing down */}
                            <div className="absolute w-3 h-3 bg-white transform rotate-45 left-1/2 -bottom-1.5 -ml-1.5"></div>

                            <div className="p-6">
                              <h4 className="font-semibold text-gray-800 mb-3">
                                Những kiến thức bạn sẽ học
                              </h4>

                              <ul className="mb-5 space-y-2">
                                <li className="flex items-start">
                                  <svg
                                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-700">
                                    Xác định đối tượng trình bày
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <svg
                                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-700">
                                    Kỹ năng sử dụng đồ thị hiệu quả
                                  </span>
                                </li>
                                <li className="flex items-start">
                                  <svg
                                    className="h-5 w-5 text-green-500 mr-2 flex-shrink-0"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                    stroke="currentColor"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M5 13l4 4L19 7"
                                    />
                                  </svg>
                                  <span className="text-sm text-gray-700">
                                    Xác định mạch câu chuyện và tạo ra câu chuyện
                                  </span>
                                </li>
                              </ul>

                              <div className="flex items-center justify-between">
                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Thêm logic thêm vào giỏ hàng ở đây
                                  }}
                                  className="bg-[#29cc60] hover:bg-[#1ba047] text-white font-medium py-2 px-4 rounded transition-colors duration-200 flex-grow mr-2"
                                >
                                  Thêm vào giỏ hàng
                                </button>

                                <button
                                  onClick={(e) => {
                                    e.preventDefault();
                                    // Thêm logic thêm vào danh sách yêu thích
                                  }}
                                  className="p-2 rounded-full border border-gray-300 hover:border-[#29cc60] hover:text-[#29cc60] transition-colors duration-200"
                                >
                                  <svg
                                    className="w-6 h-6"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                  >
                                    <path
                                      strokeLinecap="round"
                                      strokeLinejoin="round"
                                      strokeWidth="2"
                                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                                    />
                                  </svg>
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}

                  {/* Pagination Component */}
                  {searchResults.length > itemsPerPage && (
                    <div className="mt-8 transition-none">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={searchResults.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={handlePageChange}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchPage;
