import axiosInstance from '@/lib/api/axios';
import { Question } from '@/types/question';

interface ApiResponse<T> {
  success: boolean;
  data: T;
  message: string;
}

interface ImportQuestionsData {
  text: string;
  quizId: string;
  options: {
    questionSeparator: string;
    answerSeparator: string;
    correctAnswerPrefix: string;
  };
}

export const QuestionService = {
  /**
   * Tạo câu hỏi mới
   */
  async createQuestion(data: {
    quizId: string;
    questionText: string;
    questionType: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
    orderIndex: number;
    points: number;
    answers: Array<{
      answerText: string;
      isCorrect: boolean;
      explanation?: string | null;
    }>;
  }): Promise<Question> {
    try {
      console.log('Sending data:', data);
      const response = await axiosInstance.post<{ data: Question; statusCode: number }>(
        '/questions',
        data
      );
      console.log('Response:', response.data);

      // Nếu status code là 201 (Created) thì coi như thành công
      if (response.status === 201 || response.data.statusCode === 201) {
        return response.data.data;
      }

      throw new Error('Lỗi khi tạo câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi tạo câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Cập nhật câu hỏi
   */
  async updateQuestion(
    questionId: string,
    data: {
      questionText?: string;
      questionType?: 'SINGLE_CHOICE' | 'MULTIPLE_CHOICE' | 'TRUE_FALSE';
      points?: number;
      answers?: Array<{
        answerText: string;
        isCorrect: boolean;
        explanation?: string | null;
      }>;
    }
  ): Promise<Question> {
    try {
      console.log('Updating question with data:', data);
      const response = await axiosInstance.put<{ data: Question; statusCode: number }>(
        `/questions/${questionId}`,
        data
      );
      console.log('Update response:', response.data);

      // Nếu status code là 200 (OK) thì coi như thành công
      if (response.status === 200 || response.data.statusCode === 200) {
        return response.data.data;
      }

      throw new Error('Lỗi khi cập nhật câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi cập nhật câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Xóa câu hỏi
   */
  async deleteQuestion(questionId: string): Promise<void> {
    try {
      const response = await axiosInstance.delete<{
        data: { message: string };
        statusCode: number;
      }>(`/questions/${questionId}`);
      console.log('Delete response:', response.data);

      // Nếu status code là 200 (OK) thì coi như thành công
      if (response.status === 200 || response.data.statusCode === 200) {
        return;
      }

      throw new Error('Lỗi khi xóa câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi xóa câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Lấy danh sách câu hỏi theo quizId
   */
  async getQuestionsByQuizId(quizId: string): Promise<Question[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Question[]>>(
        `/questions/quiz/${quizId}`
      );
      if (response.data.success) {
        return response.data.data;
      }
      throw new Error(response.data.message || 'Lỗi khi lấy danh sách câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách câu hỏi:', error);
      throw error;
    }
  },

  /**
   * Import nhiều câu hỏi từ text
   */
  async importQuestions(data: ImportQuestionsData): Promise<Question[]> {
    try {
      console.log('Importing questions with data:', data);
      const response = await axiosInstance.post<{ data: Question[]; statusCode: number }>(
        '/questions/import',
        data
      );
      console.log('Import response:', response.data);

      // Kiểm tra cả status code 200 và 201
      if (
        response.status === 200 ||
        response.status === 201 ||
        response.data.statusCode === 200 ||
        response.data.statusCode === 201
      ) {
        return response.data.data;
      }

      throw new Error('Lỗi khi import câu hỏi');
    } catch (error: any) {
      console.error('Lỗi khi import câu hỏi:', error);
      throw error;
    }
  },
};

export default QuestionService;
