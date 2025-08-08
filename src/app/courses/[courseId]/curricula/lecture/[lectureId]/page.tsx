'use client';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import LectureHeader from '@/components/modules/lessons/LectureHeader';
import LectureContent from '@/components/modules/lessons/LectureContent';
import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';
import { ProgressService } from '@/apis/progressService';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJWT } from '@/utils/jwt';
import { checkCourseAccess } from '@/apis/courseAccessService';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Lecture } from '@/types/lecture';

export default function LecturePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressCreated, setProgressCreated] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [hasAccess, setHasAccess] = useState<boolean | null>(null);
  const [currentLecture, setCurrentLecture] = useState<Lecture | null>(null);
  const [accessLoading, setAccessLoading] = useState(true);

  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const requireAuth = searchParams?.get('requireAuth') === 'true';

  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
  const { user } = useAuth();
  const lectureId = Array.isArray(params?.lectureId)
    ? params?.lectureId[0]
    : params?.lectureId || '';

  // Log thông tin ban đầu
  useEffect(() => {
    console.log('[LECTURE PAGE] Initializing with params:', {
      courseId,
      lectureId,
      requireAuth,
      user: user ? 'logged in' : 'not logged in',
      searchParams: Object.fromEntries(searchParams?.entries() || []),
    });

    // Kiểm tra token
    const accessToken = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');
    console.log('[LECTURE PAGE] Token check:', {
      accessTokenExists: !!accessToken,
      tokenExists: !!token,
    });
  }, []);

  // Cập nhật lecture khi course thay đổi
  useEffect(() => {
    if (!course || !lectureId) {
      console.log('[LECTURE PAGE] No course or lectureId yet, waiting...', { course: !!course, lectureId });
      return;
    }

    console.log('[LECTURE PAGE] Looking for lecture in course data...');
    const foundLecture = course.modules?.flatMap(
      (module) =>
        module.curricula?.flatMap(
          (curriculum) =>
            curriculum.lectures?.filter((lecture) => lecture.lectureId === lectureId) || []
        ) || []
    )?.[0] || null;

    console.log('[LECTURE PAGE] Found lecture:', foundLecture ? {
      id: foundLecture.lectureId,
      title: foundLecture.title,
      isFree: foundLecture.isFree
    } : 'NOT FOUND');

    setCurrentLecture(foundLecture);
  }, [course, lectureId]);

  // Tải thông tin khóa học
  useEffect(() => {
    const fetchCourse = async () => {
      console.log('[LECTURE PAGE] Fetching course data for courseId:', courseId);
      try {
        if (!courseId) {
          console.log('[LECTURE PAGE] No courseId found in params.');
          return;
        }

        const response = await CourseService.getCourseInDetail(courseId);
        console.log('[LECTURE PAGE] Course data fetched:', response ? 'success' : 'failed');
        if (response) {
          setCourse(response);
        }
      } catch (error) {
        console.log('[LECTURE PAGE] Error fetching course:', error);
        setError(error instanceof Error ? error.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  // Kiểm tra quyền truy cập vào bài giảng
  useEffect(() => {
    const checkAccess = async () => {
      console.log('[LECTURE PAGE] Checking access permissions...');
      setAccessLoading(true);
      try {
        if (!courseId) {
          console.log('[LECTURE PAGE] No courseId for access check.');
          return;
        }

        // Kiểm tra xem người dùng có quyền truy cập vào khóa học không
        console.log('[LECTURE PAGE] Calling courseAccessService.checkCourseAccess()');
        const accessResponse = await checkCourseAccess(courseId);
        console.log('[LECTURE PAGE] Access response:', accessResponse);

        if (accessResponse && accessResponse.data) {
          const { hasAccess: canAccess, isEnrolled, isInstructor } = accessResponse.data;

          // Kiểm tra xem bài giảng có miễn phí không
          const isFree = currentLecture?.isFree === true;
          console.log('[LECTURE PAGE] Access check details:', {
            canAccess, isEnrolled, isInstructor, isFree,
            lectureId: currentLecture?.lectureId
          });

          // Trong trường hợp là instructor hoặc đã đăng ký
          if (isInstructor || isEnrolled) {
            console.log('[LECTURE PAGE] Access granted: User is instructor or enrolled.');
            setHasAccess(true);
          }
          // Hoặc bài giảng miễn phí
          else if (isFree) {
            console.log('[LECTURE PAGE] Access granted: Lecture is free.');
            setHasAccess(true);
          }
          // Hoặc có quyền khác
          else if (canAccess) {
            console.log('[LECTURE PAGE] Access granted: User has general access.');
            setHasAccess(true);
          }
          else {
            console.log('[LECTURE PAGE] Access denied:', { canAccess, isEnrolled, isInstructor });
            setHasAccess(false);
          }
        } else {
          console.log('[LECTURE PAGE] No access data from API.');
          setHasAccess(false);
        }
      } catch (error) {
        console.error('[LECTURE PAGE] Error checking access:', error);
        setHasAccess(false);
      } finally {
        setAccessLoading(false);
      }
    };

    // Chỉ kiểm tra khi đã có thông tin bài giảng
    if (course && currentLecture) {
      console.log('[LECTURE PAGE] Course and lecture data available, checking access...');
      checkAccess();
    } else {
      console.log('[LECTURE PAGE] Waiting for course and lecture data before access check.');
    }
  }, [course, courseId, currentLecture]);

  useEffect(() => {
    // Set start time when component mounts
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    const createProgress = async () => {
      try {
        if (progressCreated || !currentLecture || !currentLecture.curriculumId) {
          return;
        }

        // Kiểm tra thời gian xem
        if (!startTime) return;
        const currentTime = new Date();
        const timeDiff = currentTime.getTime() - startTime.getTime();
        const minutesDiff = Math.floor(timeDiff / 1000 / 60);

        if (minutesDiff < 3) {
          console.log(`Chưa đủ 3 phút, còn ${3 - minutesDiff} phút nữa`);
          return;
        }

        const token = localStorage.getItem('accessToken');
        if (!token) {
          throw new Error('No token found');
        }
        const decodedToken = decodeJWT(token);
        if (!decodedToken || !decodedToken.sub) {
          throw new Error('Invalid token');
        }
        const userId = decodedToken.sub;

        console.log('Creating progress with data:', {
          curriculumId: currentLecture.curriculumId,
          status: 'COMPLETED',
          userId: userId,
        });

        const curriculumProgress = await ProgressService.createCurriculumProgress({
          curriculumId: currentLecture.curriculumId,
          status: 'COMPLETED',
          userId: userId,
        });
        console.log('Progress created successfully:', curriculumProgress);
        setProgressCreated(true);
      } catch (error) {
        console.error('Error creating progress:', error);
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response: { data: any; status: number } };
          console.error('Error response data:', axiosError.response.data);
          console.error('Error response status:', axiosError.response.status);
        }
        setError(error instanceof Error ? error.message : 'Failed to create progress');
      }
    };

    // Kiểm tra mỗi phút
    const interval = setInterval(createProgress, 60000);
    createProgress(); // Kiểm tra ngay lần đầu

    return () => clearInterval(interval);
  }, [currentLecture, progressCreated, startTime]);

  if (loading || accessLoading) {
    console.log('[LECTURE PAGE] Still loading:', { loading, accessLoading });
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <p className="text-gray-700">Đang tải nội dung bài giảng...</p>
      </div>
    );
  }

  if (error) {
    console.log('[LECTURE PAGE] Error occurred:', error);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">{error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  if (hasAccess === false) {
    console.log('[LECTURE PAGE] Access denied, redirecting to course page.');
    // Chuyển hướng đến trang khóa học với thông báo
    router.push(`/courses/${courseId}?accessDenied=true`);
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">
            Bạn không có quyền truy cập vào bài giảng này. Vui lòng đăng ký khóa học để tiếp tục.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  // Nếu không tìm thấy bài giảng
  if (!currentLecture) {
    console.log('[LECTURE PAGE] Lecture not found in course data.');
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <Alert className="max-w-xl border-red-300 bg-red-50">
          <AlertDescription className="text-red-700">
            Không tìm thấy bài giảng. Vui lòng kiểm tra lại đường dẫn hoặc liên hệ admin.
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  console.log('[LECTURE PAGE] Rendering lecture content:', {
    lectureId: currentLecture.lectureId,
    title: currentLecture.title
  });

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LectureHeader
        courseTitle={course?.title || ''}
        lectureTitle={currentLecture?.title || ''}
        progress={0}
      />

      <div className="px-[95px]">
        <LectureContent lecture={currentLecture || undefined} course={course ?? undefined} />
      </div>
    </div>
  );
}
