'use client';

import { useEffect, useState } from 'react';
import CourseService from '@/apis/courseService';
import { FavoriteService } from '@/apis/favoriteService';
import { CourseItem } from '@/components/CourseItem/CourseItem';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Course } from '@/types/courses';

export default function FavoriteList() {
  const [tab, setTab] = useState('favorite');
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const userId = '69ec3c08-793e-45c8-9975-5bb70f4e48d5'; // Giả lập userId

  useEffect(() => {
    const fetchFavorites = async () => {
      if (tab !== 'favorite') return;

      try {
        setLoading(true);
        const response = await FavoriteService.getFavorites(userId);
        if (response) {
          console.log(response);
          setCourses(response);
        }
      } catch (error) {
        console.log(error);
        // setError(error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [tab]);

  return (
    <div>
      <div className="px-[16px] grid grid-cols-6 gap-4 bg-[#002333] h-[155px]">
        <div className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4">
          <h1 className="font-oswald text-[40px] font-normal text-[#FFF] py-4">Khóa học của tôi</h1>
          <div className="col-span-6 col-start-1">
            <Tabs value={tab} onValueChange={setTab} className="w-full">
              <TabsList className="bg-[#002333] text-white px-2 space-x-4">
                <TabsTrigger
                  value="all"
                  className={`relative py-2 px-4 font-semibold ${tab === 'all' ? 'border-b-2 border-white' : ''}`}
                >
                  Tất cả khóa học
                </TabsTrigger>

                <TabsTrigger
                  value="favorite"
                  className={`relative py-2 px-4 font-semibold ${tab === 'favorite' ? 'border-b-2 border-white' : ''}`}
                >
                  Danh sách yêu thích
                </TabsTrigger>

                <TabsTrigger
                  value="archived"
                  className={`relative py-2 px-4 font-semibold ${tab === 'archived' ? 'border-b-2 border-white' : ''}`}
                >
                  Lưu trữ
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="p-[16px] grid grid-cols-6 gap-4 h-full">
        <div className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4">
          {loading ? (
            <p className="text-center col-span-3">Đang tải...</p>
          ) : courses?.length ? (
            courses.map((course, index) => (
              <CourseItem key={course.courseId} course={course} index={index} />
            ))
          ) : (
            <div className="h-[200px] flex  justify-center col-span-3">
              <p className="text-center col-span-3 ">Không có khóa học yêu thích nào.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
