import { Category, CategoryType, CourseWithCategories } from '@/types/categories';
import axiosInstance from '@/lib/api/axios';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
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
      // Sử dụng đường dẫn tương đối thay vì URL đầy đủ
      const response = await axiosInstance.get<ApiResponse<Category[]>>('/categories');

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      console.warn('API trả về thành công nhưng dữ liệu không hợp lệ, sử dụng dữ liệu mẫu');
      return this.getMockCategories();
    } catch (error) {
      console.warn('Sử dụng dữ liệu mẫu do lỗi API');
      return this.getMockCategories();
    }
  },

  /**
   * Lấy danh mục theo ID
   */
  async getCategoryById(categoryId: string): Promise<Category | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<Category>>(`/categories/${categoryId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
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
  async getCoursesByCategory(categoryId: string): Promise<CourseWithCategories[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<CourseWithCategories[]>>(
        `/categories/${categoryId}/courses`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
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
      const response = await axiosInstance.get<ApiResponse<CourseWithCategories>>(
        `/courses/${courseId}/categories`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data.categories || [];
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
  getMockCategories(): Category[] {
    return [
      {
        categoryId: 'f0134fd0-e5aa-4d5d-86cb-a82111e39254',
        categoryType: CategoryType.INFORMATION_TECHNOLOGY,
      },
      {
        categoryId: 'f16dc2b2-7e8b-4006-b736-ad1f83c073a2',
        categoryType: CategoryType.MARKETING,
      },
      {
        categoryId: '3',
        categoryType: CategoryType.FINANCE,
      },
    ];
  },
};

export default CategoryService;
