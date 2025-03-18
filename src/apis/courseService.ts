import axiosInstance from '@/lib/api/axios';
import { Course } from '@/types/courses';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

/**
 * Service để tương tác với API categories
 */
export const CourseService = {
  async getCourseInDetail(courseId: string): Promise<Course | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Course>>(
        `/courses/detail/${courseId}`
      );

      if (response.data && response.data.statusCode === 200) {
        console.log('Response data:', response.data.data); // Kiểm tra dữ liệu
        return response.data.data; // ✅ Đúng kiểu Course
      }

      throw new Error(`Lỗi khi lấy khóa học ID ${courseId}`);
    } catch (error) {
      console.error(`Lỗi khi lấy khóa học ID ${courseId}:`, error);
      return null;
    }
  },
};

export default CourseService;
