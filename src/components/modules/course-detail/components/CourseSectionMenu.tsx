import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Module } from '@/types/module';
import { CheckCircle2, Lock, MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import ProgressService from '@/apis/progressService';
import { checkCourseAccess, CourseAccessResponse, ApiResponse } from '@/apis/courseAccessService';
import { formatDurationToMinutesSeconds } from '@/utils/time';
import { useProgressTracking } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import CourseProgressService, { CourseProgressResponse } from '@/apis/courseProgressService';

interface CourseSectionMenuProps {
  modules?: Module[];
  courseId?: string;
}

interface UserProgress {
  data: {
    curriculumProgress: Array<{
      progressId: string;
      userId: string;
      curriculumId: string;
      status: string;
      completedAt: string;
    }>;
  };
  statusCode: number;
}

const CourseSectionMenu: React.FC<CourseSectionMenuProps> = ({ modules = [], courseId }) => {
  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressResponse | null>(null);
  const [accessStatus, setAccessStatus] = useState<CourseAccessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedSections, setExpandedSections] = useState<{ [key: string]: boolean }>({});
  const [completedLectures, setCompletedLectures] = useState<{ [key: string]: boolean }>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: string]: boolean }>({});
  const { calculateCourseProgress } = useProgressTracking();
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Kiểm tra quyền truy cập khóa học
        if (courseId) {
          const accessResponse = await checkCourseAccess(courseId);
          console.log('Access status:', accessResponse);
          if (accessResponse && accessResponse.data) {
            setAccessStatus(accessResponse.data);
          }

          // Lấy tiến độ từ API mới
          try {
            const progress = await CourseProgressService.getCourseProgress(courseId);
            console.log('Course progress data (new API):', progress);

            if (progress && progress.modules) {
              setCourseProgress(progress);

              const completedLecturesMap: { [key: string]: boolean } = {};
              const completedQuizzesMap: { [key: string]: boolean } = {};

              // Xử lý dữ liệu từ API mới
              progress.modules.forEach(module => {
                if (module && module.curricula) {
                  module.curricula.forEach(curriculum => {
                    // Xử lý bài giảng
                    if (curriculum.type === 'LECTURE' && curriculum.lecture) {
                      if (curriculum.progress && curriculum.progress.status === 'COMPLETED') {
                        completedLecturesMap[curriculum.lecture.lectureId] = true;
                      }
                    }
                    // Xử lý bài quiz
                    else if (curriculum.type === 'QUIZ' && curriculum.quiz) {
                      if (curriculum.progress && curriculum.progress.status === 'COMPLETED') {
                        completedQuizzesMap[curriculum.quiz.quizId] = true;
                      }
                    }
                  });
                }
              });

              setCompletedLectures(completedLecturesMap);
              setCompletedQuizzes(completedQuizzesMap);
            }
          } catch (error) {
            console.error('Error fetching course progress (new API):', error);
            // Fallback: Nếu API mới không hoạt động, sử dụng API cũ
            fetchLegacyProgress();
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        fetchLegacyProgress();
      } finally {
        setIsLoading(false);
      }
    };

    // Lấy tiến độ từ API cũ (dùng như fallback)
    const fetchLegacyProgress = async () => {
      try {
        // Lấy tiến độ học tập của người dùng từ API cũ
        const progress = await ProgressService.getUserProgress();
        console.log('Legacy progress data:', progress);
        if (progress && progress.data) {
          setUserProgress(progress);
        }
      } catch (error) {
        console.error('Error fetching legacy progress:', error);
      }
    };

    fetchData();
  }, [courseId]);

  // Kiểm tra xem bài giảng đã hoàn thành hay chưa từ API mới
  const isLectureCompletedFromAPI = (lectureId: string | null) => {
    if (!lectureId) return false;
    return completedLectures[lectureId] || false;
  };

  // Kiểm tra xem bài quiz đã hoàn thành hay chưa từ API mới
  const isQuizCompletedFromAPI = (quizId: string | null) => {
    if (!quizId) return false;
    return completedQuizzes[quizId] || false;
  };

  // Kiểm tra xem curriculum đã hoàn thành hay chưa từ API cũ (fallback)
  const isCurriculumCompleted = (curriculumId: string | null) => {
    if (!curriculumId || !userProgress?.data?.curriculumProgress) return false;
    return userProgress.data.curriculumProgress.some(
      (progress) => progress.curriculumId === curriculumId && progress.status === 'COMPLETED'
    );
  };

  // Lấy tiến độ module từ API mới
  const getModuleProgressFromAPI = (moduleId: string) => {
    if (!moduleId || !courseProgress || !courseProgress.modules) return null;

    const moduleData = courseProgress.modules.find(m => m && m.moduleId === moduleId);
    if (moduleData) {
      return {
        completed: moduleData.completedCurricula,
        total: moduleData.totalCurricula,
        percentage: moduleData.progressPercentage
      };
    }
    return null;
  };

  // Kiểm tra xem người dùng có quyền truy cập vào bài giảng hay không
  const hasAccess = (isFree: boolean | null | undefined = false): boolean => {
    // Nếu bài giảng miễn phí, cho phép truy cập
    if (isFree === true) return true;

    // Nếu chưa có dữ liệu về quyền truy cập, đang tải hoặc có lỗi, mặc định không cho truy cập
    if (!accessStatus) return false;

    // Cho phép truy cập nếu người dùng đã đăng ký khóa học hoặc là instructor
    return accessStatus.hasAccess || accessStatus.isEnrolled || accessStatus.isInstructor;
  };

  const toggleSection = (moduleId: string) => {
    setExpandedSections((prevSections) => ({
      ...prevSections,
      [moduleId]: !prevSections[moduleId],
    }));
  };

  return (
    <div className="col-span-6 col-start-1 grid grid-cols-1 px-6 pb-4 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full">
      <div className="col-span-2 w-full">
        {isLoading ? (
          <p className="text-center py-4">Đang tải Nội dung khóa học...</p>
        ) : (
          <Accordion type="multiple">
            {modules.map((module, index) => {
              // Lấy tiến độ module từ API mới
              const moduleProgress = getModuleProgressFromAPI(module.moduleId || '');
              const completionPercentage = moduleProgress
                ? moduleProgress.percentage
                : (isLoggedIn ? calculateCourseProgress([module.moduleId || '']) : 0);

              return (
                <AccordionItem
                  key={index}
                  value={`section-${index}`}
                  className="border-b border-gray-300"
                >
                  <AccordionTrigger className="bg-gray-200 py-3 grid grid-cols-7 gap-4 font-bold text-black text-sm px-3">
                    <div className="col-span-3 col-start-1 flex items-center gap-2">
                      <span className="text-sm text-black">{module.title}</span>
                      {isLoggedIn && module.moduleId && (
                        <div className="relative h-6 w-6 ml-2">
                          <svg className="w-6 h-6" viewBox="0 0 36 36">
                            <circle cx="18" cy="18" r="15.5" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                            <circle
                              cx="18"
                              cy="18"
                              r="15.5"
                              fill="none"
                              stroke="#1dbe70"
                              strokeWidth="3"
                              strokeDasharray={`${completionPercentage * 0.97} 100`}
                              strokeLinecap="round"
                              transform="rotate(-90 18 18)"
                            />
                            <text
                              x="18"
                              y="18"
                              dominantBaseline="middle"
                              textAnchor="middle"
                              fontSize="8"
                              fontWeight="bold"
                            >
                              {completionPercentage}%
                            </text>
                          </svg>
                        </div>
                      )}
                    </div>
                    <span className="col-span-3 col-start-4 text-sm text-black">
                      {moduleProgress ? `${moduleProgress.completed}/${moduleProgress.total} hoàn thành` : `${module.curricula?.length} bài giảng`}
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white px-3 py-2 space-y-2">
                    {(module.curricula ?? []).length > 0 ? (
                      (module.curricula ?? []).map((curriculum) => (
                        <div key={curriculum.curriculumId}>
                          {/* Lectures */}
                          {(curriculum.lectures ?? []).length > 0 &&
                            (curriculum.lectures ?? []).map((lecture) => {
                              const isCompleted = isLectureCompletedFromAPI(lecture.lectureId) ||
                                isCurriculumCompleted(curriculum.curriculumId);

                              return (
                                <div
                                  key={lecture.lectureId}
                                  className="flex justify-between items-center text-sm text-black pl-4 py-1"
                                >
                                  <div className="flex items-center gap-2">
                                    {hasAccess(lecture.isFree) ? (
                                      isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <MonitorPlay className="w-4 h-4 text-gray-600" />
                                      )
                                    ) : (
                                      <Lock className="w-4 h-4 text-red-600" />
                                    )}

                                    {hasAccess(lecture.isFree) ? (
                                      <Link
                                        href={`/courses/${courseId}/curricula/lecture/${lecture.lectureId}`}
                                        className={`${isCompleted ? 'text-green-600' : 'text-blue-600'} hover:underline`}
                                      >
                                        {lecture.title}
                                        {isCompleted && (
                                          <span className="ml-1 text-xs text-green-600">(✓)</span>
                                        )}
                                      </Link>
                                    ) : (
                                      <span className="text-gray-700">{lecture.title}</span>
                                    )}

                                    {lecture.isFree === true && (
                                      <span className="text-green-600 text-xs ml-2">Miễn phí</span>
                                    )}
                                  </div>
                                  <span className="text-black">
                                {formatDurationToMinutesSeconds(lecture.duration)}
                              </span>
                                </div>
                              );
                            })}

                          {/* Quizzes */}
                          {(curriculum.quizzes ?? []).length > 0 &&
                            (curriculum.quizzes ?? []).map((quiz) => {
                              const isCompleted = isQuizCompletedFromAPI(quiz.quizId);

                              return (
                                <div
                                  key={quiz.quizId}
                                  className={`flex justify-between items-center text-sm py-1 pl-4 ${isCompleted ? 'text-green-600' : 'text-green-600'}`}
                                >
                                  <div className="flex items-center gap-2">
                                    {hasAccess() ? (
                                      isCompleted ? (
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                      ) : (
                                        <svg
                                          xmlns="http://www.w3.org/2000/svg"
                                          height="20"
                                          viewBox="0 0 24 24"
                                          width="20"
                                          fill="currentColor"
                                        >
                                          <path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z" />
                                        </svg>
                                      )
                                    ) : (
                                      <Lock className="w-4 h-4 text-red-600" />
                                    )}

                                    {hasAccess() ? (
                                      <Link
                                        href={`/courses/${courseId}/curricula/quiz/${quiz.quizId}`}
                                        className="hover:underline"
                                      >
                                        {quiz.title || 'Quiz'}
                                        {isCompleted && (
                                          <span className="ml-1 text-xs text-green-600">(✓)</span>
                                        )}
                                      </Link>
                                    ) : (
                                      <span className="text-gray-700">{quiz.title || 'Quiz'}</span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <svg
                                      xmlns="http://www.w3.org/2000/svg"
                                      height="20"
                                      viewBox="0 0 24 24"
                                      width="20"
                                      fill="currentColor"
                                    >
                                      <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 2h1.5v3l2-3h1.7l-2 3 2 3h-1.7l-2-3v3H12V5zM7 7.25h2.5V6.5H7V5h4v3.75H8.5v.75H11V11H7V7.25zM19 13l-6 6-4-4-4 4v-2.5l4-4 4 4 6-6V13z" />
                                    </svg>
                                    <span>{quiz.passingScore || 0}</span>
                                  </div>
                                </div>
                              );
                            })}

                          {/* Chỉ hiện nếu không có lecture và không có quiz */}
                          {curriculum.lectures?.length === 0 && curriculum.quizzes?.length === 0 && (
                            <p className="text-sm text-gray-500 pl-4">Không có bài giảng nào</p>
                          )}
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">Không có nội dung nào</p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              );
            })}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CourseSectionMenu;
