'use client';
import { useParams } from 'next/navigation';
import LectureHeader from '@/components/modules/lessons/LectureHeader';
import LectureContent from '@/components/modules/lessons/LectureContent';
import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import CourseService from '@/apis/courseService';

export default function LecturePage() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const params = useParams();
  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';
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
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  });
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LectureHeader
        courseTitle={course?.title || ''}
        lectureTitle={lecture?.title || ''}
        progress={0} // bạn cần thêm logic tính progress nếu có
      />

      <div className="px-[95px]">
        <LectureContent lecture={lecture} course={course ?? undefined} />
      </div>
    </div>
  );
}
