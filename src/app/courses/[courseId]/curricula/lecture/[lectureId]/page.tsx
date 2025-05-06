'use client';
import { useParams } from 'next/navigation';
import LectureHeader from '@/components/modules/lessons/LectureHeader';
import LectureContent from '@/components/modules/lessons/LectureContent';
import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';
import { ProgressService } from '@/apis/progressService';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJWT } from '@/utils/jwt';
export default function LecturePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progressCreated, setProgressCreated] = useState(false);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const params = useParams();
  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
  const { user } = useAuth();
  const lectureId = Array.isArray(params?.lectureId)
    ? params?.lectureId[1]
    : params?.lectureId || '';
  console.log(courseId);
  console.log(lectureId);
  const lecture = course?.modules?.flatMap(
    (module) =>
      module.curricula?.flatMap(
        (curriculum) =>
          curriculum.lectures?.filter((lecture) => lecture.lectureId === lectureId) || []
      ) || []
  )?.[0];

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          console.log('No courseId found in params.');
          return;
        }

        const response = await CourseService.getCourseInDetail(courseId);
        if (response) {
          setCourse(response);
        }
      } catch (error) {
        console.log(error);
        setError(error instanceof Error ? error.message : 'Failed to fetch course');
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [courseId]);

  useEffect(() => {
    // Set start time when component mounts
    setStartTime(new Date());
  }, []);

  useEffect(() => {
    const createProgress = async () => {
      try {
        if (progressCreated || !lecture || !lecture.curriculumId) {
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
          curriculumId: lecture.curriculumId,
          status: 'COMPLETED',
          userId: userId,
        });

        const curriculumProgress = await ProgressService.createCurriculumProgress({
          curriculumId: lecture.curriculumId,
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
  }, [lecture, progressCreated, startTime]);

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LectureHeader
        courseTitle={course?.title || ''}
        lectureTitle={lecture?.title || ''}
        progress={0}
      />

      <div className="px-[95px]">
        <LectureContent lecture={lecture} course={course ?? undefined} />
      </div>
    </div>
  );
}
