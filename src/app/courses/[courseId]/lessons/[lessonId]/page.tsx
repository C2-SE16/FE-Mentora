import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import LessonHeader from '@/components/modules/lessons/LessonHeader';
import LessonContent from '@/components/modules/lessons/LessonContent';
import { getCourse, findLessonAndModule } from '@/data/courses';

interface LessonPageProps {
  params: {
    courseId: string;
    lessonId: string;
  };
}

export async function generateMetadata({ params }: LessonPageProps): Promise<Metadata> {
  try {
    // Trong thực tế, bạn sẽ lấy dữ liệu bài học từ database
    return {
      title: 'Chi tiết bài học',
      description: 'Xem chi tiết bài học và học ngay',
    };
  } catch (error) {
    return {
      title: 'Không tìm thấy bài học',
      description: 'Bài học không tồn tại hoặc đã bị xóa',
    };
  }
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { courseId, lessonId } = params;

  // Lấy thông tin khóa học
  const course = getCourse(courseId);

  // Tìm bài học hiện tại
  const { currentLesson, currentModule, modules } = findLessonAndModule(lessonId);

  if (!currentLesson || !currentModule) {
    notFound();
  }

  // Trong thực tế, bạn sẽ lấy tiến độ học từ database
  const progress = 35; // Giả sử tiến độ là 35%

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <LessonHeader
        courseTitle={course.title || ''}
        lessonTitle={currentLesson.title || ''}
        progress={progress}
      />

      <div className="px-[95px]">
        <LessonContent
          courseId={courseId}
          lessonId={lessonId}
          lesson={currentLesson}
          module={currentModule}
          modules={modules}
          instructor={
            typeof course.instructor === 'string'
              ? course.instructor
              : course.instructor?.instructorId || ''
          }
          rating={course.rating || 0}
          ratingCount={course.ratingCount || 0}
        />
      </div>
    </div>
  );
}
