'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { Course, Mentor, Topic } from '@/interfaces/homepage-course';
import api from '@/apis/api';
import { cartService } from '@/apis/cartService';
import CourseList from './CourseList';
import TopicList from './TopicList';
import MentorList from './MentorList';

interface HomepageData {
  recommendedCourses: Course[];
  bestSellerCourses: Course[];
  trendingCourses: Course[];
  topics: Topic[];
  mentors: Mentor[];
  newCourses: Course[];
}

interface ApiResponse {
  data: HomepageData;
  statusCode: number;
}

const HomeCourse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [searchHistory, setSearchHistory] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [homepageData, setHomepageData] = useState<HomepageData>({
    recommendedCourses: [],
    bestSellerCourses: [],
    trendingCourses: [],
    topics: [],
    mentors: [],
    newCourses: [],
  });
  const router = useRouter();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchHomepageData = async () => {
    try {
      setIsLoading(true);
      const response = await api.get<ApiResponse>('courses/homepage');
      if (response.data && response.data.statusCode === 200) {
        setHomepageData(response.data.data);
      } else {
        console.error('Failed to fetch homepage data');
      }
    } catch (error) {
      console.error('Error fetching homepage data:', error);
    } finally {
      setTimeout(() => {
        setIsLoading(false);
      }, 1000);
    }
  };

  const fetchSearchResults = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) return;

      const response = await api.get('elasticsearch/search-history', {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.data.histories && response.data.data.histories.length > 0) {
        // Lấy từ khóa tìm kiếm mới nhất
        const latestSearch = response.data.data.histories[0].content;
        setSearchHistory(latestSearch);

        // Tìm kiếm khóa học liên quan đến từ khóa này
        if (latestSearch) {
          const searchResponse = await api.get('courses/search', {
            params: { query: latestSearch, limit: 10 },
            headers: { Authorization: `Bearer ${token}` },
          });

          if (searchResponse.data && searchResponse.data.data.courses) {
            setSearchResults(searchResponse.data.data.courses);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching search history:', error);
    }
  };

  const fetchMoreCourses = async () => {
    if (!hasMore || isLoadingMore) return;

    try {
      setIsLoadingMore(true);

      // Thêm độ trễ 2 giây
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Xác định số lượng items cần lấy
      const itemsToFetch = initialLoad ? 4 : 8; //

      const response = await api.get(`courses/homepage/all?offset=${offset}&limit=${itemsToFetch}`);

      if (response.data && response.data.statusCode === 200) {
        const { courses, hasMore: moreAvailable, nextOffset } = response.data.data;

        setAllCourses((prev) => [...prev, ...courses]);
        setHasMore(moreAvailable);
        setOffset(nextOffset);

        if (initialLoad) {
          setInitialLoad(false);
        }
      }
    } catch (error) {
      console.error('Error fetching more courses:', error);
    } finally {
      setIsLoadingMore(false);
    }
  };

  useEffect(() => {
    fetchHomepageData();
    fetchSearchResults();

    // Chỉ tải 4 course đầu tiên
    const initialFetch = async () => {
      try {
        setIsLoadingMore(true);
        const response = await api.get(`courses/homepage/all?offset=0&limit=4`);

        if (response.data && response.data.statusCode === 200) {
          const { courses, hasMore: moreAvailable, nextOffset } = response.data.data;

          setAllCourses(courses);
          setHasMore(moreAvailable);
          setOffset(nextOffset);
        }
      } catch (error) {
        console.error('Error fetching initial courses:', error);
      } finally {
        setIsLoadingMore(false);
      }
    };

    initialFetch();
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (
        !isLoadingMore &&
        hasMore &&
        window.innerHeight + document.documentElement.scrollTop >=
          document.documentElement.offsetHeight - 2000
      ) {
        // Tự động set isExpanded = true khi scroll để load thêm
        if (!isExpanded) {
          setIsExpanded(true);
        }
        fetchMoreCourses();
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [offset, hasMore, isLoadingMore, isExpanded]);

  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Reset về trạng thái ban đầu
        setAllCourses([]);
        setOffset(0);
        setHasMore(true);
        setInitialLoad(true);
        setIsExpanded(false);

        // Tải lại 4 course đầu tiên
        const reloadInitial = async () => {
          try {
            setIsLoadingMore(true);
            const response = await api.get(`courses/homepage/all?offset=0&limit=4`);

            if (response.data && response.data.statusCode === 200) {
              const { courses, hasMore: moreAvailable, nextOffset } = response.data.data;

              setAllCourses(courses);
              setHasMore(moreAvailable);
              setOffset(nextOffset);
            }
          } catch (error) {
            console.error('Error reloading courses:', error);
          } finally {
            setIsLoadingMore(false);
          }
        };

        reloadInitial();
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const topics = [
    'Java',
    'Deep Learning',
    'ReactJs',
    'NodeJs',
    'Marketing',
    'NestJs',
    'Thiết kế đồ họa',
    'Thể thao',
  ];

  const handleAddToCart = async (courseId: string, e: React.MouseEvent) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng');
        router.push('/login');
        return;
      }

      await cartService.addToCart(courseId);
      toast.success('Đã thêm khóa học vào giỏ hàng thành công!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Khóa học đã tồn tại trong giỏ hàng.');
      }
    }
  };

  const toggleExpand = () => {
    if (isExpanded) {
      // Thu gọn về 4 course đầu tiên nhưng không reset data đã tải
      setIsExpanded(false);
    } else {
      // Mở rộng hiển thị tất cả khóa học đã tải
      setIsExpanded(true);
    }
  };

  return (
    <div className="mt-5" suppressHydrationWarning>
      <h1 className="text-3xl font-bold">Nên học gì tiếp theo</h1>
      <h2 className="text-2xl mt-2 font-medium mb-5">Đề xuất cho bạn</h2>
      {/* Course list 1 */}
      <CourseList
        courses={homepageData.recommendedCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        listId="recommended"
      />

      {/* Lịch sử tìm kiếm */}
      {searchHistory && searchResults.length > 0 && (
        <>
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
            <h2 className="text-xl sm:text-2xl font-bold mb-5">
              Vì bạn đã tìm kiếm "{searchHistory}"
            </h2>
          </div>

          <CourseList
            courses={searchResults}
            isLoading={isLoading}
            onAddToCart={handleAddToCart}
            listId="search-results"
          />
        </>
      )}

      {/* Course list 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Học nhiều trong ngày</h2>
      </div>

      <CourseList
        courses={homepageData.recommendedCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        listId="daily-popular"
      />

      {/* Course list 3 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Top bán chạy</h2>
      </div>

      <CourseList
        courses={homepageData.bestSellerCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        listId="best-sellers"
      />

      {/* Course list 4 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Các khóa học mới xuất bản</h2>
      </div>

      <CourseList
        courses={homepageData.newCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
        listId="new-courses"
      />

      {/* Topics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Topic đề xuất cho bạn</h2>
      </div>

      <TopicList topics={topics} isLoading={isLoading} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold mb-5">Tất cả khóa học</h2>
      </div>

      <CourseList
        courses={isExpanded ? allCourses : allCourses.slice(0, 4)}
        isLoading={isLoadingMore && allCourses.length === 0}
        onAddToCart={handleAddToCart}
        listId="all-courses"
      />

      {isLoadingMore && allCourses.length > 0 && (
        <div className="flex justify-center my-8" suppressHydrationWarning>
          <div className="w-10 h-10 border-t-4 border-blue-500 rounded-full animate-spin"></div>
        </div>
      )}

      {/* Nút Thu gọn / Xem thêm */}
      <div className="flex justify-center mt-10 mb-8" suppressHydrationWarning>
        <button
          onClick={toggleExpand}
          className="text-black font-medium py-2 px-6 rounded-full transition-all duration-300 flex items-center gap-2 border border-gray-300 hover:bg-gray-100"
        >
          {isExpanded ? (
            <>
              Thu gọn
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          ) : (
            <>
              Hiển thị các khóa học
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default HomeCourse;
