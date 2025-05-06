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
 * Kết quả kiểm tra trạng thái instructor
 */
interface InstructorStatusResponse {
  isInstructor: boolean;
  instructorId: string | null;
}

/**
 * Service để tương tác với API instructor
 */
export const InstructorService = {
  /**
   * Kiểm tra trạng thái instructor của người dùng hiện tại
   */
  async checkInstructorStatus(): Promise<InstructorStatusResponse> {
    try {
      const response = await axiosInstance.get('/instructor/check');
      // Phân tích response để trả về đúng định dạng dữ liệu
      if (response.data && response.data.data) {
        const instructorData = response.data.data as InstructorStatusResponse;
        
        // Lưu instructorId vào localStorage nếu người dùng là instructor
        if (instructorData.isInstructor && instructorData.instructorId) {
          localStorage.setItem('instructorId', instructorData.instructorId);
        } else {
          // Xóa instructorId khỏi localStorage nếu không phải instructor
          localStorage.removeItem('instructorId');
        }
        
        return instructorData;
      }

      // Nếu không có cấu trúc data.data, trả về mặc định
      localStorage.removeItem('instructorId');
      return { isInstructor: false, instructorId: null };
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái instructor:', error);
      localStorage.removeItem('instructorId');
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
        const newInstructorData = response.data.data as Instructor;
        
        // Lưu instructorId vào localStorage sau khi đăng ký thành công
        if (newInstructorData.instructorId) {
          localStorage.setItem('instructorId', newInstructorData.instructorId);
        }
        
        return newInstructorData;
      }
      return response.data;
    } catch (error) {
      console.error('Lỗi khi đăng ký instructor:', error);
      throw error;
    }
  },
  
  /**
   * Xóa dữ liệu instructor khỏi localStorage khi đăng xuất
   */
  clearInstructorData(): void {
    localStorage.removeItem('instructorId');
  },
};
