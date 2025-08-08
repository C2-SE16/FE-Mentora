'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/apis/api';
import axiosInstance from '@/lib/api/axios';
import { mockCourses } from '@/data/courses';
import { CourseCarousel } from '@/components/CourseItem/CourseCarousel';
import { Pagination } from '@/components/Pagination';
import SkeletonCourseCard from '@/components/CourseItem/SkeletonCourseCard';

// Types (same as your existing ones)
interface Instructor {
  instructorId: string;
  instructorName: string;
  avatar?: string;
}

interface Course {
  courseId: string;
  title: string;
  shortDescription?: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  totalStudents?: number;
  totalReviews?: number;
  tbl_instructors?: Instructor;
  categoryType?: string;
  isBestSeller?: boolean;
  isRecommended?: boolean;
  level?: string;
}

interface Category {
  categoryId: string;
  name: string;
  createdAt?: string;
  updatedAt?: string;
}

// Define mapping between URL slugs and API category types
const slugToCategoryMap: Record<string, string> = {
  information_technology: 'INFORMATION_TECHNOLOGY',
  marketing: 'MARKETING',
  finance: 'FINANCE',
  bussiness: 'BUSSINESS', // Chú ý chính tả "BUSSINESS" có 2 chữ 's'
  design: 'DESIGN',
  lifestyle: 'LIFESTYLE',
  personal_development: 'PERSONAL_DEVELOPMENT',
  health: 'HEALTH',
  music: 'MUSIC',
  language: 'LANGUAGE',
  science: 'SCIENCE',
  math: 'MATH',
};

// Define mapping from API category types to human-readable names
const categoryNameMap: Record<string, string> = {
  INFORMATION_TECHNOLOGY: 'Công nghệ thông tin',
  MARKETING: 'Marketing',
  FINANCE: 'Tài chính',
  BUSSINESS: 'Kinh doanh',
  DESIGN: 'Thiết kế',
  LIFESTYLE: 'Phong cách sống',
  PERSONAL_DEVELOPMENT: 'Phát triển cá nhân',
  HEALTH: 'Sức khỏe',
  MUSIC: 'Âm nhạc',
  LANGUAGE: 'Ngôn ngữ',
  SCIENCE: 'Khoa học',
  MATH: 'Toán học',
};

export default function CategoryPage() {
  const params = useParams();
  const categorySlug = params?.categorySlug as string;
  const categoryType = slugToCategoryMap[categorySlug];

  const [loading, setLoading] = useState(true);
  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [totalCourses, setTotalCourses] = useState(0);
  const [sortBy, setSortBy] = useState('newest');
  const [error, setError] = useState<string | null>(null);

  // Thêm states mới cho course discover API
  const [popularCourses, setPopularCourses] = useState<Course[]>([]);
  const [newCourses, setNewCourses] = useState<Course[]>([]);
  const [trendingCourses, setTrendingCourses] = useState<Course[]>([]);
  const [activeTab, setActiveTab] = useState('popular');
  const [carouselLoading, setCarouselLoading] = useState(true);

  // New filter states
  const [durationFilters, setDurationFilters] = useState({
    '0-1': false,
    '1-3': false,
    '3-6': false,
    '6-17': false,
    '17+': false,
  });

  // New rating filter state
  const [ratingFilter, setRatingFilter] = useState<string>('');

  // Update expanded sections to include ratings
  const [expandedSections, setExpandedSections] = useState({
    ratings: true, // Start with ratings expanded
    duration: true,
    topic: false,
    subcategory: false,
    level: false,
    language: false,
    price: false,
    features: false,
    subtitle: false,
  });

  // Toggle section expansion
  const toggleSection = (section: string) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section as keyof typeof expandedSections],
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

  // Thêm state cho pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8); // Mặc định: 8 items/trang

  // Thêm state để quản lý riêng trạng thái loading của pagination
  const [pageChanging, setPageChanging] = useState(false);

  // Tham chiếu đến container danh sách khóa học
  const courseListRef = useRef<HTMLDivElement>(null);

  // Xử lý khi thay đổi trang
  const handlePageChange = (pageNumber: number) => {
    // Đánh dấu đang chuyển trang
    setPageChanging(true);
    setCurrentPage(pageNumber);

    // Cuộn đến danh sách khóa học một cách mượt mà
    if (courseListRef.current) {
      courseListRef.current.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }
  };

  // Thay đổi hàm setRatingFilter thành handleRatingFilterChange
  const handleRatingFilterChange = (rating: string) => {
    // Nếu đang chọn rating đó rồi, bỏ chọn (toggle)
    if (ratingFilter === rating) {
      setRatingFilter('');
    } else {
      setRatingFilter(rating);
    }
    // Reset về trang 1 khi thay đổi filter
    setCurrentPage(1);
  };

  const [ratingCounts, setRatingCounts] = useState({
    '4.5': 0,
    '4.0': 0,
    '3.5': 0,
    '3.0': 0,
  });

  // Thêm hàm để lấy khóa học từ API course-discover
  const fetchCourseDiscover = async (categoryId: string) => {
    setCarouselLoading(true);
    try {
      // Fetch popular courses
      const popularResponse = await api.get(`courses-discover/popular`, {
        params: {
          categoryName: categoryType,
        },
      });
      console.log('popularResponse', popularResponse);
      if (popularResponse.data && popularResponse.data.data) {
        setPopularCourses(popularResponse.data.data);
      }

      // Fetch new courses
      const newResponse = await api.get(`courses-discover/new`, {
        params: {
          categoryName: categoryType,
        },
      });

      if (newResponse.data && newResponse.data.data) {
        setNewCourses(newResponse.data.data);
      }

      // Fetch trending courses
      const trendingResponse = await api.get(`courses-discover/trending`, {
        params: {
          categoryName: categoryType,
        },
      });

      if (trendingResponse.data && trendingResponse.data.data) {
        setTrendingCourses(trendingResponse.data.data);
      }
    } catch (error) {
      console.error('Error fetching discover courses:', error);
    } finally {
      setCarouselLoading(false);
    }
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get('categories');
        setCategories(response.data.data.data.data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching categories:', err);
        setError('Không thể tải danh sách thể loại.');
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    if (categories.length > 0 && categoryType) {
      const category = categories.find((cat: Category) => cat.name === categoryType);
      if (category) {
        fetchRatingCounts(category.categoryId);
        fetchCourseDiscover(category.categoryId);
      }
    }
  }, [categories, categoryType]);

  useEffect(() => {
    // Đảm bảo categories đã được load và categoryType hợp lệ
    if (!categories.length || !categoryType) {
      setLoading(false);
      setPageChanging(false);
      return;
    }

    const fetchCourses = async () => {
      // Nếu đây là lần tải đầu tiên, đặt loading full page
      // Nếu chỉ là thay đổi trang, sử dụng pageChanging
      if (!pageChanging) {
        setLoading(true);
      }

      setError(null);

      try {
        // Tìm categoryId dựa trên categoryType
        const category = categories.find((cat: Category) => cat.name === categoryType);

        if (!category) {
          console.error(`Cannot find category with type ${categoryType}`);
          setCourses([]);
          setTotalCourses(0);
          setLoading(false);
          setPageChanging(false);
          return;
        }

        // Gọi API getCoursesByCategory với pagination
        const queryParams = {
          page: currentPage,
          limit: itemsPerPage,
          minRating: ratingFilter,
        };

        // Thêm minRating vào query params nếu có
        if (ratingFilter) {
          queryParams.minRating = ratingFilter;
        }

        const response = await api.get(`categories/${category.categoryId}/courses`, {
          params: queryParams,
        });

        // Xử lý dữ liệu từ API
        let coursesData = [];
        let totalCoursesCount = 0;

        if (response.data && response.data.data.data) {
          // Dữ liệu trả về là mảng các object
          coursesData = response.data.data.data
            .map((item: any) => {
              if (!item || !item.tbl_courses) return null;

              return {
                courseId: item.tbl_courses.courseId,
                title: item.tbl_courses.title,
                shortDescription: item.tbl_courses.description,
                thumbnail: item.tbl_courses.thumbnail,
                price:
                  typeof item.tbl_courses.price === 'object'
                    ? parseFloat(item.tbl_courses.price.toString())
                    : item.tbl_courses.price || 0,
                discountPrice: item.tbl_courses.discountPrice,
                rating:
                  typeof item.tbl_courses.rating === 'object'
                    ? parseFloat(item.tbl_courses.rating.toString())
                    : item.tbl_courses.rating || 0,
                totalStudents: item.tbl_courses.totalStudents || 0,
                totalReviews: item.tbl_courses.totalReviews || 0,
                isBestSeller: item.tbl_courses.isBestSeller || false,
                isRecommended: item.tbl_courses.isRecommended || false,
                tbl_instructors: item.tbl_courses.tbl_instructors || null,
                durationTime: item.tbl_courses.durationTime,
                overview: item.tbl_courses.overview,
              };
            })
            .filter(Boolean); // Lọc bỏ các giá trị null

          // Nếu API trả về tổng số khóa học
          totalCoursesCount = response.data.data.total;
        }
        // Apply sorting
        if (sortBy === 'newest') {
          // Already sorted by newest
        } else if (sortBy === 'popular') {
          coursesData = [...coursesData].sort(
            (a, b) => (b.totalStudents || 0) - (a.totalStudents || 0)
          );
        } else if (sortBy === 'price-low') {
          coursesData = [...coursesData].sort((a, b) => a.price - b.price);
        } else if (sortBy === 'price-high') {
          coursesData = [...coursesData].sort((a, b) => b.price - a.price);
        } else if (sortBy === 'rating') {
          coursesData = [...coursesData].sort((a, b) => (b.rating || 0) - (a.rating || 0));
        }

        // Thêm timeout nhỏ để tạo hiệu ứng mượt mà hơn khi chuyển trang
        setTimeout(() => {
          setCourses(coursesData);
          setTotalCourses(totalCoursesCount);
          setLoading(false);
          setPageChanging(false);
        }, 300);
      } catch (err) {
        console.error('Error fetching courses:', err);
        setError('Không thể tải danh sách khóa học.');
        setCourses([]);
        setTotalCourses(0);
        setLoading(false);
        setPageChanging(false);
      }
    };

    fetchCourses();
  }, [categories, categoryType, sortBy, currentPage, itemsPerPage, ratingFilter]);

  // Thay thế useMemo với state thực tế từ API
  const getActiveTabCourses = () => {
    switch (activeTab) {
      case 'popular':
        return popularCourses;
      case 'new':
        return newCourses;
      case 'trending':
        return trendingCourses;
      default:
        return popularCourses;
    }
  };

  // Cập nhật hàm xử lý tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
  };

  // Thêm hàm để lấy số lượng khóa học theo rating
  const fetchRatingCounts = async (categoryId: string) => {
    try {
      // Gọi API để lấy tất cả khóa học (không phân trang) để đếm số lượng
      const response = await api.get(`categories/${categoryId}/rating-counts`);
      if (response.data && response.data.data.counts) {
        const courses = response.data.data.counts;
        const counts = {
          '4.5': courses['4.5'],
          '4.0': courses['4.0'],
          '3.5': courses['3.5'],
          '3.0': courses['3.0'],
        };

        setRatingCounts(counts);
      }
    } catch (error) {
      console.error('Error fetching rating counts:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Page Header with Category Title */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold font-oswald text-gray-900">
            {categoryType && categoryNameMap[categoryType]
              ? `Khóa học ${categoryNameMap[categoryType]}`
              : 'Tất cả khóa học'}
          </h1>
          {/* {totalCourses > 0 && <p className="text-gray-600 mt-2">{totalCourses} khóa học có sẵn</p>} */}
        </div>

        {/* Add new section for recommended courses carousel */}
        <div className="mt-14 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold font-oswald text-gray-900">
              Các khóa học để bạn bắt đầu
            </h2>
            <p className="text-gray-600 mt-4">
              Khám phá các khóa học do các chuyên gia giàu kinh nghiệm trong ngành giảng dạy.
            </p>
          </div>

          {/* Tab navigation */}
          <div className="border-b border-gray-200 mb-6">
            <div className="flex -mb-px space-x-8">
              <button
                className={`py-4 px-1 border-b-2 ${activeTab === 'popular' ? 'text-gray-900 border-[#1dbe70] font-medium' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => handleTabChange('popular')}
              >
                Phổ biến nhất
              </button>
              <button
                className={`py-4 px-1 border-b-2 ${activeTab === 'new' ? 'text-gray-900 border-[#1dbe70] font-medium' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => handleTabChange('new')}
              >
                Mới
              </button>
              <button
                className={`py-4 px-1 border-b-2 ${activeTab === 'trending' ? 'text-gray-900 border-[#1dbe70] font-medium' : 'text-gray-500 hover:text-gray-700 border-transparent'}`}
                onClick={() => handleTabChange('trending')}
              >
                Thịnh hành
              </button>
            </div>
          </div>

          {carouselLoading ? (
            <div className="py-8 flex justify-center">
              <svg
                className="animate-spin h-8 w-8 text-[#1dbe70]"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            </div>
          ) : (
            <CourseCarousel courses={getActiveTabCourses()} formatPrice={formatPrice} />
          )}
        </div>

        {/* Thêm phần Các chủ đề phổ biến */}
        <div className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Các chủ đề phổ biến</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <Link
              href="/categories/it-software?topic=aws-certification"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">Chứng chỉ đám mây AWS cấp cơ bản</span>
            </Link>
            <Link
              href="/categories/it-software?topic=comptia-security"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">CompTIA Security+</span>
            </Link>
            <Link
              href="/categories/it-software?topic=aws"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">Amazon AWS</span>
            </Link>
            <Link
              href="/categories/it-software?topic=cisco-ccna"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">
                Cisco Certified Network Associate (CCNA)
              </span>
            </Link>
            <Link
              href="/categories/it-software?topic=network-security"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">An ninh mạng</span>
            </Link>
            <Link
              href="/categories/it-software?topic=aws-solutions-architect"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">
                Chứng chỉ kỹ sư giải pháp AWS cấp hội viên
              </span>
            </Link>
            <Link
              href="/categories/it-software?topic=comptia-a"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">CompTIA A+</span>
            </Link>
            <Link
              href="/categories/it-software?topic=ethical-hacking"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">Tấn công có đạo đức</span>
            </Link>
            <Link
              href="/categories/it-software?topic=cybersecurity"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">Bảo mật thông tin</span>
            </Link>
            <Link
              href="/categories/it-software?topic=comptia-network"
              className="border border-gray-300 rounded-md p-4 text-center hover:border-[#1dbe70] hover:shadow-md transition-all"
            >
              <span className="text-gray-800 font-medium">CompTIA Network+</span>
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Left Sidebar Filters */}
          <div className="w-full md:w-1/4">
            {/* Rating Filter - New Section */}
            <div className="mb-6">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <h3 className="font-medium text-lg">Xếp hạng</h3>
                  {ratingFilter && (
                    <span className="ml-2 text-xs font-medium text-white bg-[#1dbe70] px-2 py-1 rounded-full flex items-center">
                      {ratingFilter}+
                      <button
                        onClick={() => setRatingFilter('')}
                        className="ml-1 hover:text-gray-200"
                        title="Xóa bộ lọc"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-3 w-3"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </span>
                  )}
                </div>
                <button type="button" onClick={() => toggleSection('ratings')}>
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

              {ratingFilter && (
                <div className="mb-3">
                  <button
                    onClick={() => setRatingFilter('')}
                    className="text-sm text-[#1dbe70] hover:underline flex items-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 mr-1"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                    Xóa bộ lọc
                  </button>
                </div>
              )}

              {expandedSections.ratings && (
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-4.5"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70] cursor-pointer"
                      checked={ratingFilter === '4.5'}
                      onChange={() => handleRatingFilterChange('4.5')}
                    />
                    <label htmlFor="rating-4.5" className="ml-2 flex items-center cursor-pointer">
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
                      <span className="ml-2 text-gray-700">
                        Từ 4.5 trở lên ({ratingCounts['4.5']})
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-4.0"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70] cursor-pointer"
                      checked={ratingFilter === '4.0'}
                      onChange={() => handleRatingFilterChange('4.0')}
                    />
                    <label htmlFor="rating-4.0" className="ml-2 flex items-center cursor-pointer">
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
                      <span className="ml-2 text-gray-700">
                        Từ 4.0 trở lên ({ratingCounts['4.0']})
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-3.5"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70] cursor-pointer"
                      checked={ratingFilter === '3.5'}
                      onChange={() => handleRatingFilterChange('3.5')}
                    />
                    <label htmlFor="rating-3.5" className="ml-2 flex items-center cursor-pointer">
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
                      <span className="ml-2 text-gray-700">
                        Từ 3.5 trở lên ({ratingCounts['3.5']})
                      </span>
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="radio"
                      id="rating-3.0"
                      name="rating-filter"
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70] cursor-pointer"
                      checked={ratingFilter === '3.0'}
                      onChange={() => handleRatingFilterChange('3.0')}
                    />
                    <label htmlFor="rating-3.0" className="ml-2 flex items-center cursor-pointer">
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
                      <span className="ml-2 text-gray-700">
                        Từ 3.0 trở lên ({ratingCounts['3.0']})
                      </span>
                    </label>
                  </div>
                </div>
              )}
            </div>

            {/* Duration Filter */}
            {/* <div className="mb-6">
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
                <>
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
                        0-1 giờ (10,000)
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
                        1-3 giờ (10,000)
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
                        3-6 giờ (8,564)
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
                        6-17 giờ (8,669)
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
                        Hơn 17 giờ (2,681)
                      </label>
                    </div>
                  </div>
                  <button className="mt-2 text-[#1dbe70] text-sm flex items-center">
                    <span>Ẩn bớt</span>
                    <svg className="w-4 h-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                      <path
                        fillRule="evenodd"
                        d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </button>
                </>
              )}
            </div> */}

            {/* Topic Filter */}
            {/* <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('topic')}
              >
                <h3 className="font-medium text-lg">Chủ đề</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.topic ? 'rotate-180' : ''}`}
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
              {expandedSections.topic && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}

            {/* Subcategory Filter */}
            {/* <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('subcategory')}
              >
                <h3 className="font-medium text-lg">Thể loại con</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.subcategory ? 'rotate-180' : ''}`}
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
              {expandedSections.subcategory && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}

            {/* Level Filter */}
            {/* <div className="mb-6 border-t pt-4">
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
            </div> */}

            {/* Language Filter */}
            {/* <div className="mb-6 border-t pt-4">
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
            </div> */}

            {/* Price Filter */}
            {/* <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('price')}
              >
                <h3 className="font-medium text-lg">Giá</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.price ? 'rotate-180' : ''}`}
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
              {expandedSections.price && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}

            {/* Features Filter */}
            {/* <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('features')}
              >
                <h3 className="font-medium text-lg">Đặc điểm</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.features ? 'rotate-180' : ''}`}
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
              {expandedSections.features && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}

            {/* Subtitle Filter */}
            {/* <div className="mb-6 border-t pt-4">
              <div
                className="flex justify-between items-center mb-4 cursor-pointer"
                onClick={() => toggleSection('subtitle')}
              >
                <h3 className="font-medium text-lg">Phụ đề</h3>
                <button type="button">
                  <svg
                    className={`w-5 h-5 transition-transform ${expandedSections.subtitle ? 'rotate-180' : ''}`}
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
              {expandedSections.subtitle && (
                <div className="space-y-2">
                  <div className="text-gray-500 text-sm">Chưa có dữ liệu</div>
                </div>
              )}
            </div> */}
          </div>

          {/* Right Content - Course Listings */}
          <div className="w-full md:w-3/4">
            {/* Sorting Options */}
            <div className="mb-6 flex items-center justify-between bg-white p-3 rounded-lg shadow-sm">
              <h2 className="text-lg font-medium text-gray-700">
                {categoryType ? categoryNameMap[categoryType] : 'Tất cả khóa học'}
              </h2>

              <div className="flex items-center">
                <p className="text-gray-600 mr-2">
                  {totalCourses > 0 && `${totalCourses} khóa học có sẵn`}
                </p>
              </div>
            </div>

            {/* Course List Container - Thêm ref và chiều cao cố định */}
            <div ref={courseListRef} className="min-h-[800px] relative courses-container">
              {loading ? (
                <div className="flex justify-center items-center py-16">
                  <div className="w-12 h-12 border-t-4 border-[#1dbe70] border-solid rounded-full animate-spin"></div>
                </div>
              ) : error ? (
                <div className="text-center py-16">
                  <p className="text-red-500 mb-4">{error}</p>
                  <button
                    onClick={() => setLoading(true)}
                    className="bg-[#1dbe70] text-white px-4 py-2 rounded hover:bg-[#18a862]"
                  >
                    Thử lại
                  </button>
                </div>
              ) : courses.length === 0 ? (
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
                    Không có khóa học nào thuộc danh mục{' '}
                    {categoryNameMap[categoryType] || categoryType || 'này'}.
                  </p>
                </div>
              ) : (
                <div
                  className="space-y-4 transition-opacity duration-300"
                  style={{ opacity: pageChanging ? 0.6 : 1 }}
                >
                  {/* Khi đang thay đổi trang, hiển thị skeleton */}
                  {pageChanging
                    ? Array(itemsPerPage)
                        .fill(0)
                        .map((_, index) => <SkeletonCourseCard key={`skeleton-${index}`} />)
                    : // Hiển thị các khóa học thực tế
                      courses.map((course) => (
                        <div
                          key={course.courseId}
                          className="group relative transition-all duration-300"
                        >
                          <Link
                            href={`/courses/${course.courseId}`}
                            className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden"
                          >
                            {/* Course Image */}
                            <div className="w-full md:w-64 h-48 md:h-auto relative">
                              {course.thumbnail ? (
                                <div className="relative w-full h-full">
                                  <Image
                                    src={course.thumbnail}
                                    alt={course.title || 'Khóa học'}
                                    fill
                                    className="object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black opacity-0 transition-opacity duration-300 group-hover:opacity-30"></div>
                                </div>
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
                                {course.tbl_instructors?.instructorName || 'John Doe'}
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
                                <span className="inline-block bg-[#29cc60] text-white text-xs px-2 py-0.5 rounded">
                                  Mới
                                </span>
                              </div>
                            </div>
                          </Link>

                          {/* Course Hover Popup */}
                          <div className="absolute opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 ease-in-out z-10 w-96 bg-white shadow-lg rounded-lg left-1/2 bottom-full mb-4 transform -translate-x-1/2">
                            {/* Arrow pointer - now pointing down */}
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
                  {totalCourses > itemsPerPage && (
                    <div className="mt-8 transition-none">
                      <Pagination
                        currentPage={currentPage}
                        totalItems={totalCourses}
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
}
