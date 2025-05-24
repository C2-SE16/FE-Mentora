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
  const [accessStatus, setAccessStatus] = useState<CourseAccessResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);

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
        }

        // Lấy tiến độ học tập của người dùng
        const progress = await ProgressService.getUserProgress();
        console.log('progress: ', progress);
        if (progress && progress.data) {
          setUserProgress(progress);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [courseId]);

  const isCurriculumCompleted = (curriculumId: string | null) => {
    if (!curriculumId || !userProgress?.data?.curriculumProgress) return false;
    return userProgress.data.curriculumProgress.some(
      (progress) => progress.curriculumId === curriculumId && progress.status === 'COMPLETED'
    );
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

  return (
    <div className="col-span-6 col-start-1 grid grid-cols-1 px-6 pb-4 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full">
      <div className="col-span-2 w-full">
        {isLoading ? (
          <p className="text-center py-4">Đang tải nội dung khóa học...</p>
        ) : (
          <Accordion type="multiple">
            {modules.map((module, index) => (
              <AccordionItem
                key={index}
                value={`section-${index}`}
                className="border-b border-gray-300"
              >
                <AccordionTrigger className="bg-gray-200 py-3 grid grid-cols-7 gap-4 font-bold text-black text-sm px-3">
                  <span className="col-span-3 col-start-1 text-sm text-black">{module.title}</span>
                  <span className="col-span-3 col-start-4 text-sm text-black">
                    {module.curricula?.length} bài giảng
                  </span>
                </AccordionTrigger>
                <AccordionContent className="bg-white px-3 py-2 space-y-2">
                  {(module.curricula ?? []).length > 0 ? (
                    (module.curricula ?? []).map((curriculum) => (
                      <div key={curriculum.curriculumId}>
                        {/* Lectures */}
                        {(curriculum.lectures ?? []).length > 0 &&
                          (curriculum.lectures ?? []).map((lecture) => (
                            <div
                              key={lecture.lectureId}
                              className="flex justify-between items-center text-sm text-black pl-4"
                            >
                              <div className="flex items-center gap-2">
                                {hasAccess(lecture.isFree) ? (
                                  isCurriculumCompleted(curriculum.curriculumId) ? (
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
                                    className="underline text-green-600"
                                  >
                                    {lecture.title}
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
                          ))}

                        {/* Quizzes */}
                        {(curriculum.quizzes ?? []).length > 0 &&
                          (curriculum.quizzes ?? []).map((quiz) => (
                            <div
                              key={quiz.quizId}
                              className="flex justify-between items-center text-sm text-green-600 pl-4"
                            >
                              <div className="flex items-center gap-2">
                                {hasAccess() ? (
                                  <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    height="20"
                                    viewBox="0 0 24 24"
                                    width="20"
                                    fill="currentColor"
                                  >
                                    <path d="M14.59 2.59c-.38-.38-.89-.59-1.42-.59H6c-1.1 0-2 .9-2 2v16c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8.83c0-.53-.21-1.04-.59-1.41l-4.82-4.83zM15 18H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm0-4H9c-.55 0-1-.45-1-1s.45-1 1-1h6c.55 0 1 .45 1 1s-.45 1-1 1zm-2-6V3.5L18.5 9H14c-.55 0-1-.45-1-1z" />
                                  </svg>
                                ) : (
                                  <Lock className="w-4 h-4 text-red-600" />
                                )}

                                {hasAccess() ? (
                                  <Link
                                    href={`/courses/${courseId}/curricula/quiz/${quiz.quizId}`}
                                    className="hover:text-green-600 transition-colors duration-200"
                                  >
                                    {quiz.title || 'Quiz'}
                                  </Link>
                                ) : (
                                  <span className="text-green-600">{quiz.title || 'Quiz'}</span>
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
                                <span className="text-blue-700">{quiz.passingScore || 0}</span>
                              </div>
                            </div>
                          ))}

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
            ))}
          </Accordion>
        )}
      </div>
    </div>
  );
};

export default CourseSectionMenu;
