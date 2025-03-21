import axiosInstance from '@/lib/api/axios';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

interface CourseData {
  courseId: string;
  instructorId: string;
  title: string;
  description: string | null;
  overview: string | null;
  durationTime: string | null;
  price: number | null;
  approved: string;
  rating: number | null;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  tbl_course_categories: any[];
  tbl_instructors: {
    instructorId: string;
    userId: string;
    bio: string;
    profilePicture: string;
    experience: string;
    average_rating: any;
    isVerified: boolean;
    createdAt: string;
    updatedAt: string;
  };
}

interface CreateCourseRequest {
  title: string;
  categoryId: string;
}

export const CreateCourseService = {
  /**
   * Tạo khóa học đơn giản với title và categoryId
   */
  async createSimpleCourse(data: CreateCourseRequest): Promise<CourseData> {
    try {
      // Kiểm tra dữ liệu đầu vào
      if (!data.title || data.title.trim() === '') {
        throw new Error('Tiêu đề khóa học không được để trống');
      }

      // Chuẩn bị dữ liệu gửi đi
      const requestData: any = {
        title: data.title,
      };

      // Chỉ thêm categoryId nếu có giá trị
      if (data.categoryId && data.categoryId.trim() !== '') {
        requestData.categoryId = data.categoryId;
      }

      // Gọi API tạo khóa học - sửa lại endpoint
      const response = await axiosInstance.post<ApiResponse<CourseData>>(
        '/courses/create-simple',
        requestData
      );

      // Kiểm tra response
      if (
        response.data &&
        (response.data.statusCode === 201 || response.data.statusCode === 200) &&
        response.data.data.success
      ) {
        return response.data.data.data;
      }

      throw new Error(response.data.data?.message || 'Lỗi khi tạo khóa học');
    } catch (error: any) {
      console.error('API Error:', error);
      console.error('Response data:', error.response?.data);
      console.error('Response status:', error.response?.status);

      if (error.response) {
        // Lỗi từ server với response

        // Hiển thị thông báo lỗi chi tiết hơn
        if (error.response.data && error.response.data.message) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message;
          throw new Error(`Lỗi: ${errorMessage}`);
        }

        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        // Lỗi không nhận được response
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        // Lỗi khác
        throw error;
      }
    }
  },
};

export default CreateCourseService;
