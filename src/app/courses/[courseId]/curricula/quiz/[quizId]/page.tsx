'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import QuizAttemptService from '@/apis/quizAttemptService';
import QuizService from '@/apis/quizService';
import { decodeJWT } from '@/utils/jwt';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkCourseAccess } from '@/apis/courseAccessService';

interface QuizAttempt {
  id: string;
  userId: string;
  quizId: string;
  status: string;
  score?: number;
  startTime?: number;
}

interface Answer {
  id: string;
  content: string;
  isCorrect: boolean;
}

interface Question {
  id: string;
  content: string;
  answers: Answer[];
}

interface QuizData {
  id: string;
  title: string;
  description: string;
  questions: Question[];
}

interface ApiQuestion {
  questionId: string;
  questionText: string;
  questionType: string;
  points: number;
  answers: {
    answerId: string;
    answerText: string;
  }[];
}

interface ApiQuizData {
  quizId: string;
  title: string;
  questions: ApiQuestion[];
}

interface ApiResponse {
  data: {
    data: {
      quizId: string;
      title: string;
      questions: {
        questionId: string;
        questionText: string;
        questionType: string;
        points: number;
        answers: {
          answerId: string;
          answerText: string;
        }[];
      }[];
    };
    message: string;
    success: boolean;
  };
  statusCode: number;
}

interface QuizResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  isPassed: boolean;
  timeSpent: number;
  answers: Record<string, string | string[]>;
}

export default function QuizPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requireAuth = searchParams?.get('requireAuth') === 'true';
  
  const [quizData, setQuizData] = useState<QuizData | null>(null);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string | string[]>>({});
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<any>(null);
  const [isStarted, setIsStarted] = useState(false);
  const [quizMeta, setQuizMeta] = useState<{ timeLimit: number; title: string } | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
  const quizId = Array.isArray(params?.quizId) ? params?.quizId[0] : params?.quizId || '';

  // Kiểm tra quyền truy cập vào quiz
  useEffect(() => {
    const checkAccess = async () => {
      setAccessLoading(true);
      try {
        if (!courseId) return;
        
        // Kiểm tra xem người dùng có quyền truy cập vào khóa học không
        const accessResponse = await checkCourseAccess(courseId);
        console.log('Access response:', accessResponse);
        
        if (accessResponse && accessResponse.data) {
          const { hasAccess: canAccess, isEnrolled, isInstructor } = accessResponse.data;
          
          // Trong trường hợp là instructor hoặc đã đăng ký
          if (isInstructor || isEnrolled) {
            setHasAccess(true);
          } 
          // Hoặc có quyền khác
          else if (canAccess) {
            setHasAccess(true);
          }
          else {
            console.log('No access to course:', { canAccess, isEnrolled, isInstructor });
            setHasAccess(false);
            // Không chuyển hướng ngay ở đây, để hiển thị thông báo lỗi trước
          }
        } else {
          setHasAccess(false);
        }
      } catch (error) {
        console.error('Error checking access:', error);
        setHasAccess(false);
      } finally {
        setAccessLoading(false);
      }
    };
    
    checkAccess();
  }, [courseId]);

  useEffect(() => {
    if (!params?.quizId) {
      setError('Không tìm thấy thông tin bài quiz');
      return;
    }
    getTimeQuiz();
    loadQuizData();
  }, [params]);
  // useEffect(() => {
  //   if (!isStarted) {
  //     getTimeQuiz();
  //   }
  // }, [params, isStarted]);
  const getTimeQuiz = async () => {
    try {
      const quizId = Array.isArray(params?.quizId) ? params?.quizId[0] : params?.quizId;
      const response = await QuizService.getTime(quizId || '');
      console.log('Time limit response:', response); // Debug log

      // Lấy timeLimit từ cấu trúc response đúng
      const timeLimit = response?.data?.timeLimit;
      console.log('Extracted time limit:', timeLimit); // Debug log

      if (!timeLimit || isNaN(Number(timeLimit))) {
        console.error('Invalid time limit:', timeLimit);
        return;
      }

      const timeInSeconds = Number(timeLimit) * 60;
      console.log('Time in seconds:', timeInSeconds); // Debug log

      setTimeLeft(timeInSeconds);
      setQuizMeta({ timeLimit: Number(timeLimit), title: '' });
    } catch (error) {
      console.error('Error getting time limit:', error);
      setError('Không thể lấy thời gian làm bài');
    }
  };

  useEffect(() => {
    if (!isStarted || timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmit();
          return 0;
        }

        return prev - 1;
      });
    }, 1000);
    console.log('timeLeft', timeLeft);
    return () => clearInterval(timer);
  }, [isStarted, timeLeft]);

  const loadQuizData = async () => {
    if (!params?.quizId) return;

    try {
      console.log('Loading quiz data for quizId:', params.quizId);
      const quizId = Array.isArray(params.quizId) ? params.quizId[0] : params.quizId;

      // Tạo lượt làm bài mới
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để làm bài kiểm tra');
        router.push('/login');
        return;
      }

      const decodedToken = decodeJWT(token);
      if (!decodedToken || !decodedToken.sub) {
        throw new Error('Invalid token');
      }
      const attemptData = await QuizAttemptService.startQuizAttempt(decodedToken.sub, quizId);
      setAttempt(attemptData);

      // Sau khi có attempt, lấy danh sách câu hỏi
      const apiData: any = await QuizService.getQuizQuestionsForAttempt(quizId);
      console.log('Quiz data loaded:', apiData);

      // Chuyển đổi dữ liệu từ API sang định dạng component
      const transformedData: QuizData = {
        id: apiData.quizId,
        title: apiData.title,
        description: '', // API không trả về description
        questions: apiData.questions.map((q: any) => ({
          id: q.questionId,
          content: q.questionText,
          answers: q.answers.map((a: any) => ({
            id: a.answerId,
            content: a.answerText,
            isCorrect: false, // API không trả về thông tin này trong lúc làm bài
          })),
        })),
      };
      console.log('quiz data: ' + apiData);
      setQuizData(transformedData);
    } catch (error: any) {
      console.error('Error loading quiz data:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi tải thông tin bài quiz');
    }
  };

  const startQuiz = async () => {
    if (!quizMeta) return;
    setIsStarted(true);
    setTimeLeft(quizMeta.timeLimit * 60);
    try {
      await loadQuizData();
    } catch (error: any) {
      console.error('Error starting quiz:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu bài quiz');
    }
  };

  const handleAnswer = async (questionId: string, answerId: string | string[]) => {
    if (!attempt) return;

    try {
      console.log('Saving answer for questionId:', questionId, 'with answerId:', answerId);
      const temp = await QuizAttemptService.saveAnswer(attempt.id, questionId, answerId);
      console.log('temp', temp);

      // Cập nhật state sau khi lưu thành công
      const newSelectedAnswers = {
        ...selectedAnswers,
        [questionId]: answerId,
      };
      setSelectedAnswers(newSelectedAnswers);

      // Cache tiến độ
      await QuizAttemptService.cacheProgress(attempt.id, newSelectedAnswers, timeLeft);
    } catch (error) {
      console.error('Error saving answer:', error);
      setError('Có lỗi xảy ra khi lưu câu trả lời');
    }
  };

  // Thêm hàm mới để lấy đáp án từ cache
  const loadAnswersFromCache = async () => {
    if (!attempt) return;

    try {
      const result = (await QuizAttemptService.getResult(attempt.id)) as QuizResult;
      if (result && result.answers) {
        setSelectedAnswers(result.answers);
      }
    } catch (error) {
      console.error('Error loading answers from cache:', error);
    }
  };

  // Sửa lại hàm chuyển câu hỏi
  const handleQuestionChange = async (index: number) => {
    setCurrentQuestionIndex(index);
    // Lấy lại đáp án từ cache khi chuyển câu hỏi
    await loadAnswersFromCache();
  };

  // Thêm useEffect để load đáp án khi bắt đầu làm bài
  useEffect(() => {
    if (attempt) {
      loadAnswersFromCache();
    }
  }, [attempt]);

  const handleSubmit = async () => {
    if (!attempt) {
      setError('Không tìm thấy thông tin lượt làm bài');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const result: any = await QuizAttemptService.submitAttempt(attempt.id);

      const quizResult = result?.data?.data;

      if (quizResult) {
        setResult(quizResult);
        console.log('quizResult:', quizResult);
        setIsSubmitted(true);
      } else {
        setError('Không thể lấy kết quả bài làm');
      }
    } catch (error: any) {
      console.error('Error submitting quiz:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi nộp bài');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatTime = (seconds: number) => {
    if (!Number.isFinite(seconds) || seconds < 0) return '00:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // Thêm useEffect để debug
  useEffect(() => {
    console.log('Current timeLeft:', timeLeft);
    console.log('Current quizMeta:', quizMeta);
  }, [timeLeft, quizMeta]);

  // Thêm loading state
  if (accessLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700">Đang kiểm tra quyền truy cập...</p>
      </div>
    );
  }

  if (hasAccess === false) {
    // Chuyển hướng đến trang khóa học với thông báo
    router.push(`/courses/${courseId}?accessDenied=true`);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">
            Bạn không có quyền truy cập vào bài quiz này. Vui lòng đăng ký khóa học để tiếp tục.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-500">
        <h1 className="text-2xl font-bold mb-4">Lỗi</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!quizData) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!isStarted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-4">Quiz</h1>
          <div className="mb-8 text-gray-600">
            <p className="mb-4">Nhấn nút bên dưới để bắt đầu làm bài quiz.</p>
          </div>
          <button
            onClick={startQuiz}
            className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg flex items-center justify-center gap-2"
          >
            <span>Bắt đầu làm bài</span>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center">Kết quả bài quiz</h1>
          {result && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Điểm số</p>
                  <p className="text-3xl font-bold text-blue-500">{result.score}/100</p>
                </div>
                <div className="p-6 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-500 mb-1">Số câu đúng</p>
                  <p className="text-3xl font-bold text-green-500">
                    {result.correctAnswers}/{result.totalQuestions}
                  </p>
                </div>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Thời gian làm bài</p>
                <p className="text-3xl font-bold">{result.timeSpent} phút</p>
              </div>
              <div className="p-6 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-500 mb-1">Kết quả</p>
                <p
                  className={`text-3xl font-bold ${result.isPassed ? 'text-green-500' : 'text-red-500'}`}
                >
                  {result.isPassed ? 'Đạt' : 'Không đạt'}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quizData.questions[currentQuestionIndex];

  return (
    <div className="flex h-screen">
      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Part {currentQuestionIndex + 1}</h1>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Thời gian làm bài:</p>
                <p className="text-xl font-bold">{formatTime(timeLeft)}</p>
              </div>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className={`px-6 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:bg-gray-400 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? 'Đang nộp bài...' : 'NỘP BÀI'}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <p className="text-lg">
              <span className="font-medium">{currentQuestionIndex + 1}. </span>
              {currentQuestion.content}
            </p>
          </div>

          <div className="space-y-4">
            {currentQuestion.answers.map((answer) => (
              <label
                key={`${currentQuestion.id}-${answer.id}`}
                className="flex items-start gap-3 p-3 border rounded hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="radio"
                  name={`question-${currentQuestion.id}`}
                  checked={selectedAnswers[currentQuestion.id] === answer.id}
                  onChange={() => handleAnswer(currentQuestion.id, answer.id)}
                  className="mt-1"
                />
                <span>{answer.content}</span>
              </label>
            ))}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-64 p-6 border-l">
        <div className="mb-4">
          <h2 className="font-medium mb-2">Part {currentQuestionIndex + 1}</h2>
          <div className="grid grid-cols-5 gap-2">
            {quizData.questions.map((question, index) => (
              <button
                key={index}
                onClick={() => handleQuestionChange(index)}
                className={`p-2 text-center border rounded ${
                  currentQuestionIndex === index
                    ? 'bg-blue-500 text-white'
                    : selectedAnswers[question.id]
                      ? 'bg-gray-100'
                      : ''
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>

        <div className="text-sm text-gray-600">
          <p className="text-red-500 mb-2">Khôi phục/lưu bài làm</p>
          <p>Chú ý: bạn có thể click vào số thứ tự câu hỏi trong bài để đánh dấu review</p>
        </div>
      </div>
    </div>
  );
}
