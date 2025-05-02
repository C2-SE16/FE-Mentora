import axiosInstance from '@/lib/api/axios';

interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  status: string;
  score?: number;
  startTime?: number;
}

interface QuizAttemptResponse {
  data: {
    attemptId: string;
    startTime: number;
  };
  statusCode: number;
}

interface QuizQuestion {
  questionId: string;
  questionText: string;
  answers: Array<{
    answerId: string;
    answerText: string;
    isCorrect?: boolean;
  }>;
}

interface QuizResultData {
  quizId: string;
  userId: string;
  startTime: number;
  timeLeft: number;
  answers: Record<string, string>;
  questions: QuizQuestion[];
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  timeSpent: number;
}

interface QuizResultResponse {
  data: {
    data: QuizResultData;
    statusCode: number;
  };
  status: number;
}

interface QuizAttemptsResponse {
  data: QuizAttempt[];
  statusCode: number;
}

export const QuizAttemptService = {
  /**
   * Bắt đầu một lần làm quiz mới
   */
  async startQuizAttempt(userId: string, quizId: string): Promise<QuizAttempt> {
    try {
      const response = await axiosInstance.post<QuizAttemptResponse>('/quiz-attempts/start', {
        userId,
        quizId,
      });
      console.log('Start quiz attempt response:', response);
      // Kiểm tra status code thay vì success
      if (response.status === 201) {
        return {
          id: response.data.data.attemptId,
          userId,
          quizId,
          status: 'in_progress',
          startTime: response.data.data.startTime,
        };
      }

      throw new Error('Lỗi khi bắt đầu bài quiz');
    } catch (error: any) {
      console.error('Lỗi khi bắt đầu bài quiz:', error);
      throw error;
    }
  },

  /**
   * Lưu câu trả lời cho một câu hỏi
   */
  async saveAnswer(
    attemptId: string,
    questionId: string,
    selectedAnswerId: string | string[]
  ): Promise<QuizAttemptResponse> {
    try {
      const response = await axiosInstance.post<QuizAttemptResponse>(
        `/quiz-attempts/${attemptId}/answer`,
        {
          questionId,
          selectedAnswerId,
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi lưu câu trả lời');
      }
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi lưu câu trả lời:', error);
      throw error;
    }
  },

  /**
   * Cache tiến độ làm bài
   */
  async cacheProgress(
    attemptId: string,
    answers: Record<string, string | string[]>,
    timeLeft: number
  ): Promise<void> {
    try {
      const response = await axiosInstance.put<QuizAttemptResponse>(
        `/quiz-attempts/${attemptId}/cache`,
        {
          answers,
          timeLeft,
        }
      );
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi lưu tiến độ');
      }
    } catch (error: any) {
      console.error('Lỗi khi lưu tiến độ:', error);
      throw error;
    }
  },

  /**
   * Nộp bài quiz
   */
  async submitAttempt(attemptId: string): Promise<any> {
    try {
      const response = await axiosInstance.post(`/quiz-attempts/${attemptId}/submit`);
      console.log('Submit attempt response1:', response);
      if (response.status !== 200 && response.status !== 201) {
        throw new Error('Lỗi khi nộp bài');
      }
      return response; // <-- Thêm dòng này để trả về response
    } catch (error: any) {
      console.error('Lỗi khi nộp bài:', error);
      throw error;
    }
  },

  /**
   * Lấy kết quả bài quiz
   */
  async getResult(attemptId: string): Promise<QuizResult> {
    try {
      console.log('Getting result for attempt:', attemptId);
      const response: any = await axiosInstance.get(`/quiz-attempts/${attemptId}/result`);
      console.log('Get result response:', response);

      if (response.status === 200 && response.data?.data) {
        // Tính toán kết quả từ dữ liệu trả về
        const resultData = response.data.data;
        const answers = resultData.answers || {};
        const questions = resultData.questions || [];

        // Tạm thời trả về kết quả mẫu vì API chưa trả về thông tin đáp án đúng
        const result: QuizResult = {
          score: 0, // Sẽ cập nhật khi API trả về thông tin đáp án đúng
          totalQuestions: questions.length,
          correctAnswers: 0, // Sẽ cập nhật khi API trả về thông tin đáp án đúng
          timeSpent: Math.round((900 - (resultData.timeLeft || 0)) / 60),
        };

        return result;
      }
      throw new Error('Lỗi khi lấy kết quả');
    } catch (error: any) {
      console.error('Lỗi khi lấy kết quả:', error);
      throw error;
    }
  },

  async getQuizAttemptsByQuizId(quizId: string): Promise<QuizAttemptsResponse> {
    try {
      const response = await axiosInstance.get<QuizAttemptsResponse>(
        `/quiz-attempts/quiz/${quizId}`
      );
      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi lấy danh sách bài quiz:', error);
      return { data: [], statusCode: 500 };
    }
  },
};

export default QuizAttemptService;
