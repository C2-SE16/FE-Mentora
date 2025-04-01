import axiosInstance from '@/lib/api/axios';
import { Quiz } from '@/types/courses';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

export const QuizService = {
  /**
   * Lấy thông tin quiz theo ID
   */
  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      const response = await axiosInstance.get<ApiResponse<Quiz>>(`/quizzes/${quizId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || `Lỗi khi lấy thông tin quiz ID ${quizId}`);
    } catch (error: any) {
      console.error(`Lỗi khi lấy thông tin quiz ID ${quizId}:`, error);
      
      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Cập nhật thông tin quiz
   */
  async updateQuiz(
    quizId: string,
    data: {
      title?: string;
      description?: string;
      timeLimit?: number;
      passingScore?: number;
      isFree?: boolean;
    }
  ): Promise<Quiz> {
    try {
      const response = await axiosInstance.put<ApiResponse<Quiz>>(`/quizzes/${quizId}`, data);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || `Lỗi khi cập nhật quiz ID ${quizId}`);
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật quiz ID ${quizId}:`, error);
      
      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  }
};

export default QuizService; 