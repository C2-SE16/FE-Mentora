'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { CourseItem } from '@/components/CourseItem/CourseItem';
import { Course } from '@/types/courses';

export default function ArchivedPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchArchivedCourses = async () => {
      if (!user?.userId) return;

      try {
        setLoading(true);
        // Tạm thời giả lập dữ liệu vì chưa có endpoint thực
        setTimeout(() => {
          setCourses([]); // Giả lập không có dữ liệu
          setLoading(false);
        }, 1000);

        // TODO: Thay thế bằng API call thực khi có sẵn
        // const response = await api.get(`/courses/archived/${user.userId}`);
        // setCourses(response.data);
      } catch (err: any) {
        console.error('Lỗi khi tải khóa học đã lưu trữ:', err);
        setError(err.message || 'Có lỗi xảy ra khi tải khóa học');
        setLoading(false);
      }
    };

    fetchArchivedCourses();
  }, [user]);

  return (
    <div className="p-[16px] grid grid-cols-6 gap-4 h-full">
      <div className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4">
        {loading ? (
          <p className="text-center col-span-3">Đang tải...</p>
        ) : courses.length > 0 ? (
          courses.map((course, index) => (
            <CourseItem key={course.courseId} course={course} index={index} />
          ))
        ) : (
          <div className="h-[200px] flex justify-center col-span-3">
            <p className="text-center col-span-3">Bạn chưa lưu trữ khóa học nào.</p>
          </div>
        )}
      </div>
    </div>
  );
}
