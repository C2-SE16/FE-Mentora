'use client';

import React, { useState, useEffect } from 'react';
import { Module } from '@/types/module';
import Link from 'next/link';
import { CheckCircle2, Lock, MonitorPlay } from 'lucide-react';
import { formatDurationToMinutesSeconds } from '@/utils/time';
import { ProgressService } from '@/apis/progressService';
import { useAuth } from '@/contexts/AuthContext';
import { useProgressTracking } from '@/hooks/useProgress';
import { useLectureCompletion } from '@/hooks/useProgress';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import CourseProgressService, { CourseProgressResponse, ModuleProgress, CurriculumDetail } from '@/apis/courseProgressService';

interface ModuleNavigationProps {
  modules: Module[];
  currentLessonId?: string;
  courseId?: string;
}

// Interface dưới đây được giữ lại để tương thích với code cũ
interface CurriculumProgress {
  progressId: string;
  userId: string;
  curriculumId: string;
  status: string;
  completedAt: string;
  tbl_curricula?: {
    curriculumId: string;
    moduleId: string;
    title: string | null;
    orderIndex: number;
    type: string;
    description: string | null;
  };
}

interface LectureProgress {
  progressId: string;
  userId: string;
  lectureId: string;
  status: string;
  lastPosition?: number;
  completedAt?: string;
}

interface UserProgress {
  data: {
    curriculumProgress?: CurriculumProgress[];
    lectureProgress?: LectureProgress[];
  };
  statusCode: number;
}

// Lưu trữ ánh xạ giữa curriculumId và lectureId
interface CurriculumToLectureMap {
  [curriculumId: string]: string[];
}

const ModuleNavigation: React.FC<ModuleNavigationProps> = ({ modules, currentLessonId, courseId }) => {
  console.log('ModuleNavigation render - modules:', modules);
  console.log('ModuleNavigation render - currentLessonId:', currentLessonId);
  console.log('ModuleNavigation render - courseId:', courseId);

  const [userProgress, setUserProgress] = useState<UserProgress | null>(null);
  const [courseProgress, setCourseProgress] = useState<CourseProgressResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [completedLectures, setCompletedLectures] = useState<{ [key: string]: boolean }>({});
  const [inProgressLectures, setInProgressLectures] = useState<{ [key: string]: boolean }>({});
  const [completedQuizzes, setCompletedQuizzes] = useState<{ [key: string]: boolean }>({});
  const [curriculumToLectureMap, setCurriculumToLectureMap] = useState<CurriculumToLectureMap>({});
  const { isLoggedIn } = useAuth();
  const { calculateCourseProgress } = useProgressTracking();
  // Sử dụng hook kiểm tra hoàn thành bài giảng hiện tại
  const lectureCompletion = useLectureCompletion(currentLessonId || '');

  console.log('lectureCompletion hook:', lectureCompletion);

  // Tạo ánh xạ từ curriculumId sang lectureId
  useEffect(() => {
    const map: CurriculumToLectureMap = {};

    modules.forEach(module => {
      module.curricula?.forEach(curriculum => {
        if (curriculum.curriculumId) {
          const currId = curriculum.curriculumId;
          map[currId] = [];

          // Thêm tất cả các lectureId thuộc curriculum này
          curriculum.lectures?.forEach(lecture => {
            if (lecture.lectureId) {
              map[currId].push(lecture.lectureId);
            }
          });
        }
      });
    });

    console.log('Curriculum to Lecture mapping:', map);
    setCurriculumToLectureMap(map);
  }, [modules]);

  // Thêm bài giảng đã hoàn thành vào danh sách
  const markLectureAsCompleted = (lectureId: string) => {
    if (!lectureId) return;
    console.log('Marking lecture as completed:', lectureId);
    setCompletedLectures(prev => ({
      ...prev,
      [lectureId]: true
    }));
  };

  // Thêm bài quiz đã hoàn thành vào danh sách
  const markQuizAsCompleted = (quizId: string) => {
    if (!quizId) return;
    console.log('Marking quiz as completed:', quizId);
    setCompletedQuizzes(prev => ({
      ...prev,
      [quizId]: true
    }));
  };

  useEffect(() => {
    // Lấy tiến độ của người dùng sử dụng API mới
    const fetchCourseProgress = async () => {
      if (!isLoggedIn || !courseId) {
        console.log('User not logged in or courseId missing, skipping progress fetch');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Lấy tiến độ khóa học mới
        const progress = await CourseProgressService.getCourseProgress(courseId);
        console.log('Course progress data (new API):', progress);

        if (progress && progress.modules) {
          setCourseProgress(progress);

          const completedLecturesMap: { [key: string]: boolean } = {};
          const inProgressLecturesMap: { [key: string]: boolean } = {};
          const completedQuizzesMap: { [key: string]: boolean } = {};

          // Xử lý dữ liệu từ API mới
          progress.modules.forEach(module => {
            if (module && module.curricula) {
              module.curricula.forEach(curriculum => {
                // Xử lý bài giảng
                if (curriculum.type === 'LECTURE' && curriculum.lecture) {
                  if (curriculum.progress && curriculum.progress.status === 'COMPLETED') {
                    completedLecturesMap[curriculum.lecture.lectureId] = true;
                  } else if (curriculum.progress && curriculum.progress.status === 'IN_PROGRESS') {
                    inProgressLecturesMap[curriculum.lecture.lectureId] = true;
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

          // Đánh dấu bài giảng hiện tại là đã hoàn thành nếu có
          if (currentLessonId && lectureCompletion.canProceed) {
            console.log(`Current lesson ${currentLessonId} can proceed, marking as completed`);
            completedLecturesMap[currentLessonId] = true;
          }

          setCompletedLectures(completedLecturesMap);
          setInProgressLectures(inProgressLecturesMap);
          setCompletedQuizzes(completedQuizzesMap);

          console.log('Final completed lectures map:', completedLecturesMap);
          console.log('Final in progress lectures map:', inProgressLecturesMap);
          console.log('Final completed quizzes map:', completedQuizzesMap);
        } else {
          console.warn('Received invalid course progress data:', progress);
        }
      } catch (error) {
        console.error('Error fetching course progress:', error);
        // Fallback: Nếu API mới không hoạt động, sử dụng API cũ
        fetchUserProgress();
      } finally {
        setIsLoading(false);
      }
    };

    // Lấy tiến độ từ API cũ (dùng như fallback)
    const fetchUserProgress = async () => {
      if (!isLoggedIn) {
        console.log('User not logged in, skipping legacy progress fetch');
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        // Lấy tiến độ học tập của tất cả các khóa học
        const progress = await ProgressService.getUserProgress();
        console.log('User progress data (legacy API):', progress);

        if (progress && progress.data) {
          setUserProgress(progress);

          const completedMap: { [key: string]: boolean } = {};
          const inProgressMap: { [key: string]: boolean } = {};

          // Xử lý dữ liệu curriculumProgress
          if (progress.data.curriculumProgress && progress.data.curriculumProgress.length > 0) {
            console.log('Processing curriculum progress data...');

            progress.data.curriculumProgress.forEach((item: CurriculumProgress) => {
              console.log(`Curriculum ${item.curriculumId} - status: ${item.status}`);

              if (item.status === 'COMPLETED' && item.curriculumId) {
                console.log(`Curriculum ${item.curriculumId} is completed`);

                // Đánh dấu tất cả các bài giảng thuộc curriculum này là đã hoàn thành
                const lectureIds = curriculumToLectureMap[item.curriculumId] || [];
                console.log(`Lectures in this curriculum: ${lectureIds.join(', ')}`);

                lectureIds.forEach(lectureId => {
                  console.log(`Marking lecture ${lectureId} as completed from curriculum progress`);
                  completedMap[lectureId] = true;
                });
              }
            });
          }

          // Xử lý dữ liệu lectureProgress nếu có
          if (progress.data.lectureProgress && progress.data.lectureProgress.length > 0) {
            console.log('Processing lecture progress data...');
            progress.data.lectureProgress.forEach((item: LectureProgress) => {
              console.log(`Lecture ${item.lectureId} - status: ${item.status}, lastPosition: ${item.lastPosition}`);

              if (item.status === 'COMPLETED') {
                console.log(`Lecture ${item.lectureId} marked as COMPLETED`);
                completedMap[item.lectureId] = true;
              } else if (item.status === 'IN_PROGRESS' || (item.lastPosition && item.lastPosition > 0)) {
                console.log(`Lecture ${item.lectureId} marked as IN_PROGRESS`);
                inProgressMap[item.lectureId] = true;
              }
            });
          } else {
            console.log('No lecture progress data found in API response');
          }

          setCompletedLectures(completedMap);
          setInProgressLectures(inProgressMap);

          console.log('Final completed lectures map:', completedMap);
          console.log('Final in progress lectures map:', inProgressMap);
        }
      } catch (error) {
        console.error('Error fetching user progress (legacy):', error);
      } finally {
        setIsLoading(false);
      }
    };

    console.log('Fetching course progress...');
    fetchCourseProgress();
  }, [isLoggedIn, courseId, currentLessonId, lectureCompletion.canProceed, curriculumToLectureMap]);

  // Cập nhật trạng thái hoàn thành cho bài giảng hiện tại từ hook useLectureCompletion
  useEffect(() => {
    console.log('Current lesson effect - currentLessonId:', currentLessonId);
    console.log('Current lesson effect - lectureCompletion:', lectureCompletion);

    if (currentLessonId && lectureCompletion.canProceed) {
      console.log(`Current lesson ${currentLessonId} can proceed, marking as completed in effect`);
      markLectureAsCompleted(currentLessonId);

      // Nếu bài giảng đã hoàn thành, không còn là in progress nữa
      setInProgressLectures(prev => {
        const updated = { ...prev };
        delete updated[currentLessonId];
        return updated;
      });
    } else if (currentLessonId && lectureCompletion.completionRatio > 0) {
      // Nếu đang học dở
      console.log(`Current lesson ${currentLessonId} in progress (${lectureCompletion.completionRatio})`);
      setInProgressLectures(prev => ({
        ...prev,
        [currentLessonId]: true
      }));
    }
  }, [currentLessonId, lectureCompletion.canProceed, lectureCompletion.completionRatio]);

  // Kiểm tra xem bài giảng đã hoàn thành hay chưa
  const isLectureCompleted = (lectureId: string | null) => {
    if (!lectureId) return false;

    // Nếu là bài giảng hiện tại và đã hoàn thành theo hook
    if (lectureId === currentLessonId && lectureCompletion.canProceed) {
      return true;
    }

    // Kiểm tra trong completedLectures
    return completedLectures[lectureId] || false;
  };

  // Kiểm tra xem bài quiz đã hoàn thành hay chưa
  const isQuizCompleted = (quizId: string | null) => {
    if (!quizId) return false;
    return completedQuizzes[quizId] || false;
  };

  // Kiểm tra xem bài giảng đang học dở hay chưa
  const isLectureInProgress = (lectureId: string | null) => {
    if (!lectureId) return false;

    // Nếu là bài giảng hiện tại và đang học dở theo hook
    if (lectureId === currentLessonId && lectureCompletion.completionRatio > 0 && !lectureCompletion.canProceed) {
      return true;
    }

    // Kiểm tra trong inProgressLectures
    return inProgressLectures[lectureId] || false;
  };

  // Đếm số bài học đã hoàn thành trong một module dựa trên API mới
  const getModuleProgressFromAPI = (moduleId: string) => {
    if (!moduleId) return null;

    if (courseProgress && courseProgress.modules && Array.isArray(courseProgress.modules)) {
      const moduleData = courseProgress.modules.find(m => m && m.moduleId === moduleId);
      if (moduleData) {
        return {
          completed: moduleData.completedCurricula,
          total: moduleData.totalCurricula,
          percentage: moduleData.progressPercentage
        };
      }
    }
    return null;
  };

  // Đếm số bài học đã hoàn thành trong một module (fallback method)
  const countCompletedLecturesInModule = (module: Module) => {
    // Nếu có dữ liệu từ API mới, sử dụng nó
    const apiProgress = getModuleProgressFromAPI(module.moduleId || '');
    if (apiProgress) {
      return apiProgress;
    }

    // Nếu không có dữ liệu từ API mới, tính toán bằng phương pháp cũ
    let total = 0;
    let completed = 0;

    module.curricula?.forEach(curriculum => {
      if (curriculum.lectures) {
        curriculum.lectures.forEach(lecture => {
          total++;
          if (isLectureCompleted(lecture.lectureId)) {
            completed++;
          }
        });
      }

      // Thêm cả quiz vào tổng số bài học
      if (curriculum.quizzes) {
        total += curriculum.quizzes.length;
        curriculum.quizzes.forEach(quiz => {
          if (isQuizCompleted(quiz.quizId)) {
            completed++;
          }
        });
      }
    });

    console.log(`Module ${module.title}: ${completed}/${total} completed`);
    return { completed, total, percentage: total > 0 ? Math.round((completed / total) * 100) : 0 };
  };

  // In ra console tất cả các bài giảng và trạng thái của chúng
  useEffect(() => {
    if (!isLoading && modules) {
      console.log('======= DEBUGGING ALL LECTURES STATUS =======');
      modules.forEach((module, moduleIndex) => {
        console.log(`Module ${moduleIndex + 1}: ${module.title}`);

        module.curricula?.forEach((curriculum, currIndex) => {
          console.log(`  Curriculum ${currIndex + 1}: ${curriculum.title || 'Untitled'}`);
          console.log(`  Curriculum ID: ${curriculum.curriculumId}`);

          curriculum.lectures?.forEach((lecture, lectureIndex) => {
            const completed = isLectureCompleted(lecture.lectureId);
            const inProgress = isLectureInProgress(lecture.lectureId);
            const isCurrent = lecture.lectureId === currentLessonId;

            console.log(`    Lecture ${lectureIndex + 1}: ${lecture.title}`);
            console.log(`      ID: ${lecture.lectureId}`);
            console.log(`      Completed: ${completed}`);
            console.log(`      In Progress: ${inProgress}`);
            console.log(`      Current: ${isCurrent}`);
          });

          curriculum.quizzes?.forEach((quiz, quizIndex) => {
            const completed = isQuizCompleted(quiz.quizId);
            const isCurrent = quiz.quizId === currentLessonId;

            console.log(`    Quiz ${quizIndex + 1}: ${quiz.title || 'Untitled Quiz'}`);
            console.log(`      ID: ${quiz.quizId}`);
            console.log(`      Completed: ${completed}`);
            console.log(`      Current: ${isCurrent}`);
          });
        });
      });
      console.log('=========================================');
    }
  }, [isLoading, modules, completedLectures, inProgressLectures, completedQuizzes, currentLessonId]);

  // Lấy tổng tiến độ khóa học từ API mới
  const getOverallCourseProgress = () => {
    if (courseProgress) {
      return {
        completed: courseProgress.completedCurricula,
        total: courseProgress.totalCurricula,
        percentage: courseProgress.overallProgressPercentage
      };
    }
    return null;
  };

  return (
    <div className="w-full">
      {isLoading ? (
        <p className="text-center py-2 text-sm text-gray-500">Đang tải...</p>
      ) : (
        <Accordion type="multiple" defaultValue={modules.map((_, index) => `section-${index}`)}>
          {modules.map((module, index) => {
            const progress = countCompletedLecturesInModule(module);
            const completionPercentage = progress.percentage;

            return (
              <AccordionItem
                key={index}
                value={`section-${index}`}
                className="border-b border-gray-300"
              >
                <AccordionTrigger className="bg-gray-50 py-2 px-3 text-sm font-medium text-gray-800 hover:bg-gray-100">
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center gap-2">
                      <span>{module.title}</span>
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
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-gray-500">
                        {progress.completed}/{progress.total} hoàn thành
                      </span>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="bg-white px-3 py-2 space-y-2">
                  {module.curricula?.map((curriculum) => {
                    return (
                      <div key={curriculum.curriculumId}>
                        {/* Bài giảng */}
                        {curriculum.lectures?.map((lecture) => {
                          // Kiểm tra xem bài giảng đã hoàn thành hay chưa
                          const isCompleted = isLectureCompleted(lecture.lectureId);
                          const isInProgress = isLectureInProgress(lecture.lectureId);
                          const isCurrent = lecture.lectureId === currentLessonId;

                          return (
                            <div
                              key={lecture.lectureId}
                              className={`flex justify-between items-center py-2 text-sm ${isCurrent ? 'bg-blue-50 pl-2' : 'pl-4'}`}
                            >
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                                ) : isInProgress ? (
                                  <MonitorPlay className="w-5 h-5 text-yellow-600" />
                                ) : (
                                  <MonitorPlay className="w-5 h-5 text-gray-600" />
                                )}
                                <Link
                                  href={`/courses/${courseId}/curricula/lecture/${lecture.lectureId}`}
                                  className={`${isCurrent ? 'font-semibold text-blue-700' : isCompleted ? 'text-green-600' : isInProgress ? 'text-yellow-600' : 'text-gray-700'}`}
                                >
                                  {lecture.title}
                                  {isCompleted && (
                                    <span className="ml-1 text-xs text-green-600">(✓)</span>
                                  )}
                                </Link>
                              </div>
                              <span className="text-gray-500">{formatDurationToMinutesSeconds(lecture.duration)}</span>
                            </div>
                          );
                        })}

                        {/* Bài kiểm tra */}
                        {curriculum.quizzes?.map((quiz) => {
                          const isCurrent = quiz.quizId === currentLessonId;
                          const isCompleted = isQuizCompleted(quiz.quizId);

                          return (
                            <div
                              key={quiz.quizId}
                              className={`flex justify-between items-center py-2 text-sm ${isCompleted ? 'text-green-600' : 'text-blue-700'} ${isCurrent ? 'bg-blue-50 pl-2' : 'pl-4'}`}
                            >
                              <div className="flex items-center gap-2">
                                {isCompleted ? (
                                  <CheckCircle2 className="w-5 h-5 text-green-600" />
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
                                )}
                                <Link
                                  href={`/courses/${courseId}/curricula/quiz/${quiz.quizId}`}
                                  className={`${isCurrent ? 'font-semibold' : ''}`}
                                >
                                  {quiz.title || 'Bài kiểm tra'}
                                  {isCompleted && (
                                    <span className="ml-1 text-xs text-green-600">(✓)</span>
                                  )}
                                </Link>
                              </div>
                              <div className="text-xs bg-indigo-100 text-indigo-800 px-1.5 py-0.5 rounded">
                                Quiz
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    );
                  })}
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
      )}

      {/* Hiển thị tổng tiến độ khóa học từ API mới nếu có */}
      {courseProgress && (
        <div className="mt-4 p-3 bg-gray-50 border rounded">
          <p className="text-sm font-medium text-gray-700 mb-1">Tiến độ khóa học</p>
          <div className="relative pt-1">
            <div className="flex mb-2 items-center justify-between">
              <div>
                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-green-600 bg-green-200">
                  {courseProgress.overallProgressPercentage}%
                </span>
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold inline-block text-green-600">
                  {courseProgress.completedCurricula}/{courseProgress.totalCurricula} bài học
                </span>
              </div>
            </div>
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200">
              <div
                style={{ width: `${courseProgress.overallProgressPercentage}%` }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-green-500"
              ></div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModuleNavigation;
