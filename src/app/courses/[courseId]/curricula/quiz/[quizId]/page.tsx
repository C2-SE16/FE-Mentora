'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import QuizAttemptService from '@/apis/quizAttemptService';
import QuizService from '@/apis/quizService';
import { decodeJWT } from '@/utils/jwt';
import toast from 'react-hot-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { checkCourseAccess } from '@/apis/courseAccessService';
import { Course } from '@/types/courses';
import { CourseService } from '@/apis/courseService';
import ModuleNavigation from '@/components/modules/lessons/components/ModuleNavigation';
import Link from 'next/link';
import CourseProgressService, { CourseProgressResponse } from '@/apis/courseProgressService';
import { useAuth } from '@/contexts/AuthContext';

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
  const { isLoggedIn } = useAuth();
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
  const [course, setCourse] = useState<Course | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressResponse | null>(null);

  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
  const quizId = Array.isArray(params?.quizId) ? params?.quizId[0] : params?.quizId || '';

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const courseData = await CourseService.getCourseInDetail(courseId);
        setCourse(courseData);
      } catch (error) {
        console.error('Error fetching course:', error);
      }
    };

    if (courseId) {
      fetchCourse();
    }
  }, [courseId]);

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
          } else {
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
    // Chỉ lấy thông tin thời gian của quiz, không tải dữ liệu quiz
    getTimeQuiz();
    // QUAN TRỌNG: Không gọi loadQuizData() ở đây nữa
  }, [params]);

  const getTimeQuiz = async () => {
    try {
      const quizId = Array.isArray(params?.quizId) ? params?.quizId[0] : params?.quizId;
      console.log('Gọi API lấy thời gian cho quizId:', quizId);
      const response = await QuizService.getTime(quizId || '');
      console.log('Time limit response chi tiết:', JSON.stringify(response, null, 2)); // Log chi tiết hơn

      // Lấy timeLimit từ cấu trúc response đúng
      const timeLimit = response?.data?.timeLimit;
      console.log('Extracted time limit:', timeLimit); // Debug log

      // Chấp nhận timeLimit = 0 hoặc số dương
      if (timeLimit === undefined || timeLimit === null || isNaN(Number(timeLimit))) {
        console.error('Invalid time limit:', timeLimit);
        console.error('Cấu trúc response:', JSON.stringify(response, null, 2));
        // Thử tìm timeLimit từ các vị trí khác trong response nếu có
        const alternativeTimeLimit = response?.timeLimit || response?.data?.data?.timeLimit;
        if (alternativeTimeLimit !== undefined && !isNaN(Number(alternativeTimeLimit))) {
          console.log('Tìm thấy timeLimit ở vị trí khác:', alternativeTimeLimit);
          setTimeLeft(Number(alternativeTimeLimit) * 60);
          setQuizMeta({
            timeLimit: Number(alternativeTimeLimit),
            title: response?.data?.title || '',
          });
          return;
        }


        // Nếu không tìm thấy, sử dụng giá trị mặc định
        setTimeLeft(15 * 60); // 15 phút mặc định
        setQuizMeta({ timeLimit: 15, title: response?.data?.title || '' });
        return;
      }

      // Thời gian là 0 hoặc số dương đều hợp lệ
      const timeInSeconds = Number(timeLimit) * 60;
      console.log('Time in seconds:', timeInSeconds); // Debug log

      setTimeLeft(timeInSeconds);
      setQuizMeta({ timeLimit: Number(timeLimit), title: response?.data?.title || '' });
    } catch (error) {
      console.error('Error getting time limit:', error);
      // Log chi tiết hơn về lỗi
      if (error instanceof Error) {
        console.error('Error message:', error.message);
        console.error('Error stack:', error.stack);
      }
      // Đặt giá trị mặc định cho timeLimit nếu không lấy được
      setTimeLeft(15 * 60); // 15 phút
      setQuizMeta({ timeLimit: 15, title: '' });
      setError('Không thể lấy thời gian làm bài, đặt mặc định 15 phút');
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
    try {
      console.log('=== NGƯỜI DÙNG ĐÃ NHẤN NÚT BẮT ĐẦU LÀM BÀI ===');
      console.log('Trạng thái quizMeta trước khi bắt đầu:', quizMeta);


      // Khởi tạo trạng thái bắt đầu dù có quizMeta hay không
      setIsStarted(true);


      // Thời gian mặc định là 15 phút nếu không có timeLimit từ server
      let timeLimit = 15;


      // Nếu có quizMeta và timeLimit là 0 hoặc số dương
      if (quizMeta && (quizMeta.timeLimit === 0 || quizMeta.timeLimit > 0)) {
        timeLimit = quizMeta.timeLimit;
      }


      console.log('Thiết lập timeLeft với timeLimit:', timeLimit);
      setTimeLeft(timeLimit * 60);


      // Tải dữ liệu bài quiz
      console.log('Bắt đầu tải dữ liệu quiz...');
      await loadQuizData();
      console.log('Đã tải xong dữ liệu quiz');
    } catch (error: any) {
      console.error('Lỗi khi bắt đầu quiz:', error);
      setError(error.response?.data?.message || 'Có lỗi xảy ra khi bắt đầu bài quiz');


      // Đặt lại trạng thái nếu có lỗi
      setIsStarted(false);
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

  // Thêm effect để lấy dữ liệu tiến độ khóa học từ API mới
  useEffect(() => {
    const fetchCourseProgress = async () => {
      if (!courseId || !isLoggedIn) return;

      try {
        const progress = await CourseProgressService.getCourseProgress(courseId);
        console.log('Course progress data for quiz page:', progress);
        if (progress && progress.modules) {
          setCourseProgress(progress);
        } else {
          console.warn('Received invalid course progress data:', progress);
        }
      } catch (error) {
        console.error('Error fetching course progress for quiz:', error);
      }
    };

    fetchCourseProgress();
  }, [courseId, isLoggedIn]);

  // Hàm kiểm tra xem quiz đã hoàn thành chưa từ dữ liệu API mới
  const isQuizCompletedFromAPI = (quizId: string) => {
    if (!courseProgress || !courseProgress.modules || !Array.isArray(courseProgress.modules)) return false;

    for (const module of courseProgress.modules) {
      if (!module || !module.curricula || !Array.isArray(module.curricula)) continue;

      for (const curriculum of module.curricula) {
        if (
          curriculum.type === 'QUIZ' &&
          curriculum.quiz?.quizId === quizId &&
          curriculum.progress?.status === 'COMPLETED'
        ) {
          return true;
        }
      }
    }

    return false;
  };

  // Thêm useEffect để đánh dấu quiz đã hoàn thành nếu là trạng thái hiển thị kết quả
  useEffect(() => {
    const markQuizCompleted = async () => {
      if (isSubmitted && result && quizId) {
        // TODO: Thêm API gọi để đánh dấu quiz đã hoàn thành nếu chưa hoàn thành trong courseProgress
        console.log('Quiz has been completed with result:', result);
      }
    };

    markQuizCompleted();
  }, [isSubmitted, result, quizId]);

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

  // Kiểm tra nếu đang ở trạng thái loading ban đầu
  if (!quizData && isStarted) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-full max-w-2xl p-8 bg-white rounded-lg shadow-md">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6 mb-6"></div>
            <div className="space-y-3">
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
              <div className="h-6 bg-gray-200 rounded w-full"></div>
            </div>
          </div>
        </div>
        <p className="mt-4 text-blue-600 font-medium">Đang tải bài quiz...</p>
      </div>
    );
  }

  // Nếu chưa bắt đầu làm bài (chưa nhấn nút), hiển thị màn hình bắt đầu 
  if (!isStarted) {
    return (
      <div className="flex flex-col md:flex-row w-full">
        <div className="w-full md:w-3/4 p-4">
          <div className="bg-white rounded-lg shadow-md">
            <div className="p-8">
              <h1 className="text-3xl font-bold mb-4">Quiz: {quizMeta?.title || 'Bài kiểm tra'}</h1>
              <div className="mb-8 text-gray-600">
                <p className="mb-4">Nhấn nút bên dưới để bắt đầu làm bài quiz.</p>
                {quizMeta?.timeLimit !== undefined && (
                  <p className="text-sm text-gray-500">
                    Thời gian làm bài: {quizMeta.timeLimit} phút
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault();
                  console.log('Người dùng nhấn nút Bắt đầu làm bài');
                  try {
                    console.log('=== NGƯỜI DÙNG ĐÃ NHẤN NÚT BẮT ĐẦU LÀM BÀI ===');
                    console.log('Trạng thái quizMeta trước khi bắt đầu:', quizMeta);


                    // Khởi tạo trạng thái bắt đầu dù có quizMeta hay không
                    setIsStarted(true);


                    // Thời gian mặc định là 15 phút nếu không có timeLimit từ server
                    let timeLimit = 15;


                    // Nếu có quizMeta và timeLimit là 0 hoặc số dương
                    if (quizMeta && (quizMeta.timeLimit === 0 || quizMeta.timeLimit > 0)) {
                      timeLimit = quizMeta.timeLimit;
                    }


                    console.log('Thiết lập timeLeft với timeLimit:', timeLimit);
                    setTimeLeft(timeLimit * 60);


                    // Tải dữ liệu bài quiz
                    console.log('Bắt đầu tải dữ liệu quiz...');
                    loadQuizData();
                    console.log('Đã bắt đầu tải dữ liệu quiz');
                  } catch (err) {
                    console.error('Lỗi khi xử lý sự kiện click:', err);
                    setIsStarted(false); // Reset trạng thái nếu có lỗi
                  }
                }}
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
        </div>

        {/* Sidebar với Module Navigation */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
              <p className="text-sm text-gray-600">
                {course?.modules?.length} phần - {course?.modules?.reduce((acc, module) => acc + (module.curricula?.length || 0), 0)} bài giảng
              </p>
            </div>

            <ModuleNavigation
              courseId={courseId}
              modules={course?.modules || []}
              currentLessonId={quizId}
            />
          </div>

          <div className="mt-4 bg-white shadow-md rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2">Giảng viên</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                {course?.tbl_instructors?.user?.avatar && (
                  <img
                    src={course.tbl_instructors.user.avatar}
                    alt={course.tbl_instructors.user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{course?.tbl_instructors?.user?.fullName}</p>
                <p className="text-sm text-gray-600">Giảng viên</p>
              </div>
            </div>
            <button className="mt-3 w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
              Xem thông tin
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (isSubmitted) {
    return (
      <div className="flex flex-col md:flex-row w-full">
        {/* Main content */}
        <div className="w-full md:w-3/4 p-4">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-6">
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

                  <div className="mt-8 flex justify-center">
                    <button
                      onClick={() => router.push(`/courses/${courseId}`)}
                      className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg"
                    >
                      Quay lại khóa học
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-1/4 bg-gray-100 p-4">
          <div className="bg-white shadow-md rounded-md overflow-hidden">
            <div className="p-3 bg-gray-50 border-b">
              <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
              <p className="text-sm text-gray-600">
                {course?.modules?.length} phần - {course?.modules?.reduce((acc, module) => acc + (module.curricula?.length || 0), 0)} bài giảng
              </p>
            </div>

            <ModuleNavigation
              courseId={courseId}
              modules={course?.modules || []}
              currentLessonId={quizId}
            />
          </div>

          <div className="mt-4 bg-white shadow-md rounded-md p-4">
            <h3 className="text-lg font-semibold mb-2">Giảng viên</h3>
            <div className="flex items-center">
              <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
                {course?.instructor?.user?.avatar && (
                  <img
                    src={course.instructor.user.avatar}
                    alt={course.instructor.user.fullName}
                    className="w-full h-full rounded-full object-cover"
                  />
                )}
              </div>
              <div>
                <p className="font-medium">{course?.instructor?.user?.fullName}</p>
                <p className="text-sm text-gray-600">Giảng viên</p>
              </div>
            </div>
            <button className="mt-3 w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
              Xem thông tin
            </button>
          </div>

          {/* Hiển thị tiến độ khóa học */}
          {courseProgress && courseProgress.modules && (
            <div className="mt-4 bg-white shadow-md rounded-md p-4">
              <h3 className="text-lg font-semibold mb-2">Tiến độ khóa học</h3>
              <div className="relative pt-1">
                <div className="flex mb-2 items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                      {courseProgress.overallProgressPercentage || 0}%
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-semibold inline-block text-green-600">
                      {courseProgress.completedCurricula || 0}/{courseProgress.totalCurricula || 0} hoàn thành
                    </span>
                  </div>
                </div>
                <div className="overflow-hidden h-2 mb-2 text-xs flex rounded bg-gray-200">
                  <div
                    style={{ width: `${courseProgress.overallProgressPercentage || 0}%` }}
                    className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
                  ></div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => router.push(`/courses/${courseId}`)}
                  className="w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium text-lg flex items-center justify-center gap-2"
                >
                  <span>Quay lại khóa học</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = quizData?.questions[currentQuestionIndex];

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Main content */}
      <div className="w-full md:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-4 border-b">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold">Câu hỏi {currentQuestionIndex + 1}</h1>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-gray-600">Thời gian còn lại:</p>
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

          <div className="p-6">
            {currentQuestion ? (
              <>
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
              </>
            ) : (
              <div className="text-center py-8">
                <p className="text-gray-500">Không tìm thấy câu hỏi</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sidebar */}
      <div className="w-full md:w-1/4 bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-3 bg-gray-50 border-b">
            <h2 className="text-xl font-bold text-gray-900">Nội dung khóa học</h2>
            <p className="text-sm text-gray-600">
              {course?.modules?.length} phần - {course?.modules?.reduce((acc, module) => acc + (module.curricula?.length || 0), 0)} bài giảng
            </p>
          </div>

          <ModuleNavigation
            courseId={courseId}
            modules={course?.modules || []}
            currentLessonId={quizId}
          />
        </div>

        <div className="mt-4 bg-white shadow-md rounded-md p-4">
          <div className="mb-4">
            <h2 className="font-medium mb-2">Danh sách câu hỏi</h2>
            {quizData && quizData.questions && quizData.questions.length > 0 ? (
              <div className="grid grid-cols-5 gap-2">
                {quizData.questions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionChange(index)}
                    className={`p-2 text-center border rounded ${currentQuestionIndex === index
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
            ) : (
              <p className="text-gray-500 text-sm">Đang tải danh sách câu hỏi...</p>
            )}
          </div>

          <div className="text-sm text-gray-600">
            <p className="mb-2">Chú thích:</p>
            <div className="flex items-center gap-2 mb-1">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Câu hỏi hiện tại</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 bg-gray-100 border rounded"></div>
              <span>Đã trả lời</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
