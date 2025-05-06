'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';
import CourseBasicInfo from '@/components/modules/manage-course/CourseBasicInfo';
import { toast } from 'react-hot-toast';

export default function CourseBasicsPage() {
  const params = useParams<{ courseId: string }>();
  const router = useRouter();
  const courseId = params?.courseId as string;
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      if (!courseId) return;
      
      try {
        const courseData = await CourseService.getCourseInDetail(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error('Lỗi khi tải thông tin khóa học:', error);
        toast.error('Không thể tải thông tin khóa học');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  const handleCourseUpdate = (updatedCourse: Course) => {
    setCourse(updatedCourse);
  };

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Đang tải thông tin khóa học...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800">Không tìm thấy khóa học</h2>
          <p className="mt-2 text-gray-600">Khóa học này không tồn tại hoặc bạn không có quyền truy cập</p>
          <button
            onClick={() => router.push('/instructor/dashboard')}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90"
          >
            Quay lại trang quản lý
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 w-full max-w-5xl mx-auto">
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h1 className="text-2xl font-bold mb-6">Chỉnh sửa thông tin khóa học</h1>
          
          <CourseBasicInfo 
            courseId={courseId} 
            initialCourse={course} 
            onUpdate={handleCourseUpdate} 
          />
        </div>
      </div>
    </div>
  );
} 