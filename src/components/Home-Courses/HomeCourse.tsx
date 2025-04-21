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
}

interface ApiResponse {
  data: HomepageData;
  statusCode: number;
}

const HomeCourse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [homepageData, setHomepageData] = useState<HomepageData>({
    recommendedCourses: [],
    bestSellerCourses: [],
    trendingCourses: [],
    topics: [],
    mentors: [],
  });
  const router = useRouter();

  useEffect(() => {
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

    fetchHomepageData();
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

  return (
    <div className="mt-5 px-4 sm:px-6 lg:px-8">
      {/* Course list 1 */}
      <CourseList 
        courses={homepageData.recommendedCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />

      {/* Course list 2 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Học nhiều trong ngày</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <CourseList 
        courses={homepageData.recommendedCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />

      {/* Course list 3 */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Top bán chạy</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <CourseList 
        courses={homepageData.bestSellerCourses}
        isLoading={isLoading}
        onAddToCart={handleAddToCart}
      />

      {/* Topics */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Topic đề xuất cho bạn</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <TopicList topics={topics} isLoading={isLoading} />

      {/* Mentors */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-8 sm:mt-16 gap-4 sm:gap-0">
        <h2 className="text-xl sm:text-2xl font-bold">Mentor được yêu thích</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <MentorList mentors={homepageData.mentors} isLoading={isLoading} />
    </div>
  );
};

export default HomeCourse;
