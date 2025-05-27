import axiosInstance from '@/lib/api/axios';

interface InstructorCourse {
  courseId: string;
  title: string;
  description: string | null;
  overview: string | null;
  durationTime: number | null;
  price: number;
  currentPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  approved: string;
  rating: number;
  thumbnail: string | null;
  createdAt: string;
  updatedAt: string;
  categories: {
    categoryId: string;
    name: string;
  }[];
  instructor: {
    instructorId: string;
    name: string;
    avatar: string | null;
  };
  reviewCount: number;
  appliedVoucher?: {
    code: string;
    discountAmount: number;
    discountType: string;
    finalPrice: number;
  } | null;
  enrollments: {
    userId: string;
    courseEnrollmentId: string;
    enrolledAt: string;
    courseId: string;
    user: {
      userId: string;
      fullName: string;
      avatar: string | null;
    } | null;
  }[];
}

interface InstructorCoursesResponse {
  data: {
    success: boolean;
    data: InstructorCourse[];
    message: string;
  };
  statusCode: number;
}

interface ErrorResponse {
  success: boolean;
  message: string;
  error: string;
}

export const InstructorCourseService = {
  /**
   * Lấy danh sách khóa học của instructor hiện tại
   */
  async getInstructorCourses(): Promise<InstructorCourse[]> {
    try {
      const response = await axiosInstance.get<InstructorCoursesResponse>(
        '/courses/instructor/my-courses'
      );

      if (response.data.data.success) {
        return response.data.data.data;
      }

      console.warn('API trả về thất bại:', response.data.data.message);
      throw new Error(response.data.data.message || 'Không thể lấy danh sách khóa học');
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách khóa học của instructor:', error);

      if (error.response?.data) {
        const errorData = error.response.data as ErrorResponse;
        throw new Error(errorData.message || 'Không thể lấy danh sách khóa học');
      }

      throw new Error('Không thể kết nối đến server');
    }
  },
};

export default InstructorCourseService;
