import axiosInstance from '@/lib/api/axios';
import { Quiz } from '@/types/quiz';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface UpdateQuizResponse {
  data: {
    data: Quiz;
    message: string;
    success: boolean;
  };
  statusCode: number;
}

interface QuizApiResponse {
  success: boolean;
  data: {
    success: boolean;
    data: Quiz;
    message: string;
  };
  message: string;
}

interface QuizQuestionsResponse {
  data: {
    data: {
      id: string;
      title: string;
      description: string;
      questions: {
        id: string;
        content: string;
        answers: {
          id: string;
          content: string;
          isCorrect: boolean;
        }[];
      }[];
    };
    message: string;
    success: boolean;
  };
  statusCode: number;
}

export const QuizService = {
  /**
   * Lấy thông tin quiz theo ID
   */
  async getQuizById(quizId: string): Promise<Quiz> {
    try {
      console.log('Fetching quiz with ID:', quizId);
      const response = await axiosInstance.get<QuizApiResponse>(`/quizzes/${quizId}`);
      console.log('Response:', response.data);

      const quizData = response.data.data.data;
      console.log('Quiz data:', quizData);

      if (!response.data.data.success) {
        throw new Error(response.data.data.message || `Lỗi khi lấy thông tin quiz ID ${quizId}`);
      }

      return quizData;
    } catch (error: any) {
      console.error(`Lỗi khi lấy thông tin quiz ID ${quizId}:`, error);
      throw new Error(`Lỗi khi lấy thông tin quiz ID ${quizId}: ${error.message}`);
    }
  },

  /**
   * Lấy thông tin câu hỏi cho bài test
   */
  async getQuizQuestionsForAttempt(quizId: string) {
    try {
      const response = await axiosInstance.get<QuizQuestionsResponse>(
        `/quizzes/${quizId}/test-attempt`
      );
      console.log('Quiz questions data:', response.data);

      if (response.data.data.success) {
        return response.data.data.data;
      }
      throw new Error(response.data.data.message || 'Lỗi khi lấy thông tin câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi lấy thông tin câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Tạo quiz mới
   */
  async createQuiz(data: {
    courseId: string;
    title: string;
    description: string;
    passingScore: number;
    timeLimit: number;
  }): Promise<Quiz> {
    try {
      const response = await axiosInstance.post<ApiResponse<Quiz>>('/quizzes', data);
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Lỗi khi tạo quiz');
    } catch (error: any) {
      console.error('Lỗi khi tạo quiz:', error);
      throw error;
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
      passingScore?: number;
      timeLimit?: number;
    }
  ): Promise<Quiz> {
    try {
      const response = await axiosInstance.put<UpdateQuizResponse>(`/quizzes/${quizId}`, data);
      console.log('Update quiz response:', response.data);

      if (response.data.data.success) {
        return response.data.data.data;
      }
      throw new Error(response.data.data.message || `Lỗi khi cập nhật quiz ID ${quizId}`);
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật quiz ID ${quizId}:`, error);
      throw new Error(error.response?.data?.message || `Lỗi khi cập nhật quiz ID ${quizId}`);
    }
  },

  /**
   * Xóa quiz
   */
  async deleteQuiz(quizId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<ApiResponse<void>>(`/quizzes/${quizId}`);
      if (!response.data.success) {
        throw new Error(response.data.message || `Lỗi khi xóa quiz ID ${quizId}`);
      }
    } catch (error: any) {
      console.error(`Lỗi khi xóa quiz ID ${quizId}:`, error);
      throw error;
    }
  },
  async getTime(quizId: string): Promise<any> {
    try {
      const response: any = await axiosInstance.get(`/quizzes/${quizId}/time`);
      console.log('Get result response:', response);

      if (response.status === 200) {
        const result = response.data;

        return result;
      }
      throw new Error('Lỗi khi lấy kết quả');
    } catch (error: any) {
      console.error('Lỗi khi lấy kết quả:', error);
      throw error;
    }
  },
};

export default QuizService;
