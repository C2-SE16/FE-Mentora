import { Category, CourseCategory } from '@/types/categories';
import axiosInstance from '@/lib/api/axios';

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

interface ApiResponse<T> {
  data: {
    success: boolean;
    message: string;
    data: PaginatedResponse<T>;
  };
  statusCode: number;
}

/**
 * Service để tương tác với API categories
 */
export const CategoryService = {
  /**
   * Lấy tất cả danh mục
   */
  async getAllCategories(): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>('/categories');

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data.data;
      }
      return []; // Trả về mảng rỗng nếu không có dữ liệu
    } catch (error) {
      console.error('Lỗi khi lấy tất cả danh mục:', error);
      return []; // Trả về mảng rỗng trong trường hợp lỗi
    }
  },

  /**
   * Lấy danh mục theo ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${categoryId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data.data[0];
      }

      throw new Error(response.data.data.message || `Lỗi khi lấy danh mục ID ${categoryId}`);
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục ID ${categoryId}:`, error);
      return null;
    }
  },

  /**
   * Lấy các khóa học theo danh mục
   */
  async getCoursesByCategory(categoryId: string): Promise<CourseCategory[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<CourseCategory>>(
        `/categories/${categoryId}/courses`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy khóa học theo danh mục ID ${categoryId}`
      );
    } catch (error) {
      console.error(`Lỗi khi lấy khóa học theo danh mục ID ${categoryId}:`, error);
      return []; // Trả về mảng rỗng trong trường hợp lỗi
    }
  },

  /**
   * Lấy danh mục theo khóa học
   */
  async getCategoriesByCourse(courseId: string): Promise<Category[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>(
        `/courses/${courseId}/categories`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy danh mục cho khóa học ID ${courseId}`
      );
    } catch (error) {
      console.error(`Lỗi khi lấy danh mục cho khóa học ID ${courseId}:`, error);
      return [];
    }
  },

  /**
   * Dữ liệu mẫu cho categories
   */
};

export default CategoryService;
