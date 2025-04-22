import axiosInstance from '@/lib/api/axios';

/**
 * Interface đại diện cho dữ liệu instructor
 */
interface Instructor {
  instructorId: string;
  userId: string;
  instructorName: string;
  bio: string;
  profilePicture: string;
  experience: string;
  isVerified: boolean;
  average_rating: number;
  createdAt: string;
  updatedAt: string;
}

/**
 * Service để tương tác với API instructor
 */
export const InstructorService = {
  /**
   * Kiểm tra trạng thái instructor của người dùng hiện tại
   */
  async checkInstructorStatus(): Promise<{ isInstructor: boolean }> {
    try {
      const response = await axiosInstance.get('/instructor/check');
      // Phân tích response để trả về đúng định dạng dữ liệu
      if (response.data && response.data.data) {
        return response.data.data; // Trả về phần data trong phản hồi API
      }
      
      // Nếu không có cấu trúc data.data, trả về mặc định
      return { isInstructor: false };
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái instructor:', error);
      throw error;
    }
  },

  /**
   * Đăng ký trở thành instructor
   */
  async registerInstructor(instructorData: {
    instructorName: string;
    bio?: string;
    profilePicture?: string;
    experience?: string;
  }): Promise<Instructor> {
    try {
      const response = await axiosInstance.post('/instructor/register', instructorData);
      // Phân tích response để trả về đúng định dạng dữ liệu
      if (response.data && response.data.data) {
        return response.data.data; // Trả về phần data trong phản hồi API
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng ký instructor:', error);
      throw error;
    }
  }
}; 