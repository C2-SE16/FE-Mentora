'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ModuleNavigation from './components/ModuleNavigation';
import { Course, LessonType } from '@/types/courses';
import { Lecture } from '@/types/lecture';
import DiscussingTab from './components/DiscussingTab';
import { ProgressService } from '@/apis/progressService';
import { decodeJWT } from '@/utils/jwt';
import { formatDuration, formatDurationToMinutesSeconds } from '@/utils/time';
import { useProgressTracking } from '@/hooks/useProgress';
import { useAuth } from '@/contexts/AuthContext';
import { ChevronLeft, ChevronRight, CheckCircle2, PlayCircle, Video, FileText } from 'lucide-react';
import { useNavigationCheck } from '@/hooks/useProgress';
import { useRouter } from 'next/navigation';
import { useLectureCompletion } from '@/hooks/useProgress';

interface LectureContentProps {
  lecture?: Lecture;
  course?: Course;
  requirements?: {
    requirementId: string;
    courseId: string;
    description: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
  }[];
  targetAudience?: {
    audienceId: string;
    courseId: string;
    description: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function LectureContent({ lecture, course }: LectureContentProps) {
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'requirements' | 'targetAudience' | 'discussing'>(
    'requirements'
  );
  const [prevLectureId, setPrevLectureId] = useState<string | null>(null);
  const [nextLectureId, setNextLectureId] = useState<string | null>(null);

  const { calculateCourseProgress } = useProgressTracking();
  const { isLoggedIn } = useAuth();
  const { checkCanProceed } = useNavigationCheck();
  const router = useRouter();

  // Sử dụng hook kiểm tra hoàn thành bài giảng
  const lectureCompletion = useLectureCompletion(lecture?.lectureId || '');

  // Debug log để kiểm tra giá trị canProceed
  useEffect(() => {
    console.log('Lecture completion state:', {
      lectureId: lecture?.lectureId,
      canProceed: lectureCompletion.canProceed,
      completionRatio: lectureCompletion.completionRatio,
      message: lectureCompletion.message
    });
  }, [lecture?.lectureId, lectureCompletion.canProceed, lectureCompletion.completionRatio, lectureCompletion.message]);

  // Tìm bài học trước và sau
  useEffect(() => {
    if (!course || !lecture) return;

    let foundPrev = null;
    let foundNext = null;
    let foundCurrent = false;

    // Duyệt qua tất cả module và curriculum để tìm bài học trước và sau
    for (const module of course.modules || []) {
      for (const curriculum of module.curricula || []) {
        for (const currLecture of curriculum.lectures || []) {
          if (foundCurrent && !foundNext) {
            foundNext = currLecture.lectureId;
            break;
          }

          if (currLecture.lectureId === lecture.lectureId) {
            foundCurrent = true;
          } else if (!foundCurrent) {
            foundPrev = currLecture.lectureId;
          }
        }

        if (foundNext) break;
      }
      if (foundNext) break;
    }

    setPrevLectureId(foundPrev);
    setNextLectureId(foundNext);
  }, [course, lecture]);

  // Xử lý điều hướng đến bài học trước
  const navigateToPrev = () => {
    if (prevLectureId) {
      router.push(`/courses/${course?.courseId}/curricula/lecture/${prevLectureId}`);
    }
  };

  // Xử lý điều hướng đến bài học tiếp theo
  const navigateToNext = () => {
    if (!nextLectureId || !lecture?.lectureId) return;

    // Thêm log để kiểm tra giá trị từ API
    console.log("Trạng thái hoàn thành bài học:", {
      canProceed: lectureCompletion.canProceed,
      completionRatio: lectureCompletion.completionRatio,
      message: lectureCompletion.message
    });

    // Lấy thông tin về bài học tiếp theo để xác định loại
    const findNextLessonType = (): 'LECTURE' | 'QUIZ' | undefined => {
      if (!course || !lecture) return undefined;

      let foundCurrent = false;

      // Duyệt qua tất cả module và curriculum để tìm bài học hiện tại và tiếp theo
      for (const module of course.modules || []) {
        for (const curriculum of module.curricula || []) {
          // Duyệt qua các bài giảng
          for (const lec of curriculum.lectures || []) {
            if (foundCurrent && lec.lectureId === nextLectureId) {
              return 'LECTURE';
            }

            if (lec.lectureId === lecture.lectureId) {
              foundCurrent = true;
            }
          }

          // Duyệt qua các bài quiz
          for (const quiz of curriculum.quizzes || []) {
            if (foundCurrent && quiz.quizId === nextLectureId) {
              return 'QUIZ';
            }
          }
        }
      }

      return undefined;
    };

    const nextLessonType = findNextLessonType();
    console.log("Loại bài học tiếp theo:", nextLessonType);

    // Nếu chưa đăng nhập, cho phép chuyển tiếp không cần kiểm tra
    if (!isLoggedIn) {
      if (nextLessonType === 'QUIZ') {
        router.push(`/courses/${course?.courseId}/curricula/quiz/${nextLectureId}`);
      } else {
        router.push(`/courses/${course?.courseId}/curricula/lecture/${nextLectureId}`);
      }
      return;
    }

    // Nếu API cho phép chuyển tiếp, chuyển ngay
    if (lectureCompletion.canProceed) {
      if (nextLessonType === 'QUIZ') {
        router.push(`/courses/${course?.courseId}/curricula/quiz/${nextLectureId}`);
      } else {
        router.push(`/courses/${course?.courseId}/curricula/lecture/${nextLectureId}`);
      }
      return;
    }

    // Nếu chưa đủ điều kiện, hiển thị thông báo xác nhận
    const willProceed = window.confirm(
      `Bạn chưa hoàn thành bài học này (${Math.round(lectureCompletion.completionRatio * 100)}%). ${lectureCompletion.message || 'Bạn có chắc muốn chuyển sang bài tiếp theo?'}`
    );

    if (willProceed) {
      if (nextLessonType === 'QUIZ') {
        router.push(`/courses/${course?.courseId}/curricula/quiz/${nextLectureId}`);
      } else {
        router.push(`/courses/${course?.courseId}/curricula/lecture/${nextLectureId}`);
      }
    }
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Video Player và Nội dung bài học */}
      <div className="w-full md:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <VideoPlayer
            videoUrl={`http://localhost:9090/videos/${course?.courseId}/${lecture?.lectureId}.mp4`}
            lectureId={lecture?.lectureId || undefined}
            nextLectureId={nextLectureId || undefined}
            courseId={course?.courseId}
            onVideoCompleted={() => lectureCompletion.checkCompletion()}
          />

          <div className="p-4 border-b">
            <div className="mb-4">
              <div className="flex items-center gap-2">
                {isLoggedIn && (
                  <div className="flex-shrink-0" title={lectureCompletion.canProceed ? 'Đã hoàn thành bài học' : lectureCompletion.completionRatio > 0 ? `Đang học - ${Math.round(lectureCompletion.completionRatio * 100)}% hoàn thành` : 'Chưa bắt đầu học'}>
                    {lectureCompletion.canProceed ? (
                      <div className="flex justify-center items-center w-6 h-6 rounded-full bg-green-100">
                        <CheckCircle2 className="h-4 w-4 text-green-600" />
                      </div>
                    ) : lectureCompletion.completionRatio > 0 ? (
                      <div className="flex justify-center items-center w-6 h-6 rounded-full bg-yellow-100">
                        <PlayCircle className="h-4 w-4 text-yellow-600" />
                      </div>
                    ) : (
                      <div className="flex justify-center items-center w-6 h-6 rounded-full bg-gray-100">
                        <Video className="h-4 w-4 text-gray-500" />
                      </div>
                    )}
                  </div>
                )}
                <h2 className="text-xl font-semibold">{lecture?.title || 'Chọn một bài học'}</h2>
              </div>
              <div className="flex items-center mt-1">
                {isLoggedIn && lectureCompletion.completionRatio > 0 && (
                  <div className="flex items-center gap-1 text-sm">
                    <div className="px-2 py-0.5 bg-gray-100 rounded-full text-sm flex items-center">
                      <span className={`text-xs ${lectureCompletion.canProceed ? 'text-green-600' : 'text-yellow-600'}`}>
                        {lectureCompletion.canProceed
                          ? 'Đã hoàn thành'
                          : `Đang học - ${Math.round(lectureCompletion.completionRatio * 100)}%`}
                      </span>
                    </div>
                  </div>
                )}
                <div className="flex items-center"></div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Thời lượng:{' '}
                {lecture?.duration ? formatDurationToMinutesSeconds(lecture.duration) : 'N/A'}
              </p>
            </div>

            {/* Nút điều hướng bài học */}
            <div className="flex justify-between mb-4">
              <button
                onClick={navigateToPrev}
                disabled={!prevLectureId}
                className={`flex items-center gap-1 px-3 py-1.5 rounded ${prevLectureId
                  ? 'text-blue-600 hover:bg-blue-50 transition-colors'
                  : 'text-gray-400 cursor-not-allowed'
                  }`}
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Bài trước</span>
              </button>

              {/* Hiển thị trạng thái hoàn thành bài học */}
              {isLoggedIn && (
                <div className="flex items-center">
                  <div className="px-3 py-1 bg-gray-100 rounded-full text-sm flex items-center">
                    <div className="w-24 bg-gray-200 rounded-full h-2 mr-2">
                      <div
                        className="h-2 rounded-full bg-green-500"
                        style={{ width: `${lectureCompletion.completionRatio * 100}%` }}
                      ></div>
                    </div>
                    <span className="text-gray-600 text-xs">
                      {lectureCompletion.canProceed ? 'Đã hoàn thành' : `${Math.round(lectureCompletion.completionRatio * 100)}%`}
                    </span>
                  </div>
                </div>
              )}

              <button
                onClick={navigateToNext}
                className={`flex items-center gap-1 px-3 py-1.5 rounded ${nextLectureId
                  ? isLoggedIn && !lectureCompletion.canProceed
                    ? 'text-yellow-600 hover:bg-yellow-50 transition-colors'
                    : 'text-blue-600 hover:bg-blue-50 transition-colors'
                  : 'text-gray-400 pointer-events-none'
                  }`}
                title={
                  !nextLectureId
                    ? 'Không có bài tiếp theo'
                    : isLoggedIn && !lectureCompletion.canProceed
                      ? `Chưa hoàn thành bài học. ${lectureCompletion.message}`
                      : 'Chuyển đến bài tiếp theo'
                }
              >
                <span>Bài tiếp theo</span>
                <ChevronRight className="w-4 h-4" />
                {isLoggedIn && lectureCompletion.canProceed && (
                  <CheckCircle2 className="w-4 h-4 text-green-600 ml-1" />
                )}
              </button>
            </div>

            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'requirements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('requirements')}
              >
                Yêu cầu
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'targetAudience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('targetAudience')}
              >
                Đối tượng học viên
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'discussing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('discussing')}
              >
                Thảo luận
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'requirements' && (
              <div>
                <div className="space-y-4 bg-blue-50 p-4 rounded-md">
                  <ul className="list-disc pl-5 space-y-2">
                    {course?.requirements?.map((req) => (
                      <li key={req.requirementId} className="text-gray-700">
                        {req.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'targetAudience' && (
              <div>
                <div className="space-y-4 bg-blue-50 p-4 rounded-md">
                  <ul className="list-disc pl-5 space-y-2">
                    {course?.targetAudience?.map((audience) => (
                      <li key={audience.audienceId} className="text-gray-700">
                        {audience.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'discussing' && lecture && (
              <DiscussingTab curriculumId={lecture.curriculumId || ''} />
            )}
          </div>
        </div>
      </div>

      {/* Danh sách bài học */}

      <div className="w-full md:w-1/4 bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-3 bg-gray-50 border-b">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-gray-900">Nội dung khóa học</h2>
            </div>
            <p className="text-sm text-gray-600 mt-1">
              {course?.modules?.length} phần - {course?.modules?.reduce((acc, module) => acc + (module.curricula?.length || 0), 0)} bài giảng - N/A
            </p>
          </div>

          <ModuleNavigation
            courseId={course?.courseId}
            modules={course?.modules || []}
            currentLessonId={lecture?.lectureId || ''}
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
      </div>
    </div>
  );
}
