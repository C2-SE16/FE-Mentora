'use client';

import { useEffect, useState } from 'react';
import { FavoriteService } from '@/apis/favoriteService';
import { CourseItem } from '@/components/CourseItem/CourseItem';
import { Course } from '@/types/courses';
import { useAuth } from '@/contexts/AuthContext';

export default function FavoriteListPage() {
  const [courses, setCourses] = useState<Course[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        const response = await FavoriteService.getFavorites(user.userId);
        if (response) {
          console.log('Favorite courses:', response);
          setCourses(response);
        }
      } catch (err: any) {
        console.error('Lỗi khi tải khóa học yêu thích:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải khóa học yêu thích');
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [user]);

  return (
    <div className="p-[16px] grid grid-cols-6 gap-4 h-full">
      <div className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4">
        {loading ? (
          <p className="text-center col-span-3">Đang tải...</p>
        ) : courses?.length ? (
          courses.map((course, index) => (
            <CourseItem key={course.courseId} course={course} index={index} />
          ))
        ) : (
          <div className="h-[200px] flex justify-center col-span-3">
            <p className="text-center col-span-3">Không có khóa học yêu thích nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
