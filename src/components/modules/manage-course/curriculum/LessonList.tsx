'use client';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import LessonService from '@/apis/curriculumService';
import { Lesson, LessonType } from '@/types/courses';
import LessonItem from './LessonItem';

interface LessonListProps {
  lessons: Lesson[];
  moduleId: string;
  animating: boolean;
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  onLessonsChange: (moduleId: string, updatedLessons: Lesson[]) => void;
  fetchModules: () => Promise<void>;
}

export default function LessonList({
  lessons = [],
  moduleId,
  animating,
  setAnimating,
  onLessonsChange,
  fetchModules,
}: LessonListProps) {
  const [movingLessonId, setMovingLessonId] = useState<string | null>(null);
  const lessonRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cập nhật tiêu đề bài học
  const handleLessonTitleChange = async (moduleId: string, lessonId: string, newTitle: string) => {
    try {
      // Cập nhật UI trước
      const updatedLessons = lessons.map((lesson) => {
        if (lesson.lessonId === lessonId) {
          return { ...lesson, title: newTitle };
        }
        return lesson;
      });

      onLessonsChange(moduleId, updatedLessons);

      // Gọi API để cập nhật
      await LessonService.updateLesson(lessonId, { title: newTitle });
    } catch (error: any) {
      toast.error('Không thể cập nhật tiêu đề bài học: ' + error.message);
      console.error('Lỗi khi cập nhật tiêu đề bài học:', error);
      // Khôi phục lại dữ liệu nếu có lỗi
      fetchModules();
    }
  };

  // Thay đổi loại bài học
  const handleLessonTypeChange = async (
    moduleId: string,
    lessonId: string,
    newType: LessonType
  ) => {
    try {
      // Cập nhật UI trước
      const updatedLessons = lessons.map((lesson) => {
        if (lesson.lessonId === lessonId) {
          return { ...lesson, contentType: newType };
        }
        return lesson;
      });

      onLessonsChange(moduleId, updatedLessons);

      // Gọi API để cập nhật
      await LessonService.updateLesson(lessonId, { contentType: newType });
      toast.success('Đã cập nhật loại bài học');
    } catch (error: any) {
      toast.error('Không thể cập nhật loại bài học: ' + error.message);
      console.error('Lỗi khi cập nhật loại bài học:', error);
      // Khôi phục lại dữ liệu nếu có lỗi
      fetchModules();
    }
  };

  // Xóa bài học
  const handleDeleteLesson = async (moduleId: string, lessonId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa bài học này không?')) {
      try {
        // Cập nhật UI trước
        const updatedLessons = lessons.filter((lesson) => lesson.lessonId !== lessonId);

        // Cập nhật lại orderIndex cho các bài học còn lại
        updatedLessons.forEach((lesson, index) => {
          lesson.orderIndex = index;
        });

        onLessonsChange(moduleId, updatedLessons);

        // Gọi API để xóa bài học
        await LessonService.deleteLesson(lessonId);

        // Cập nhật lại thứ tự các bài học còn lại
        if (updatedLessons.length > 0) {
          const lessonIds = updatedLessons.map((lesson) => lesson.lessonId);
          await LessonService.reorderLessons(moduleId, lessonIds);
        }

        toast.success('Đã xóa bài học thành công');
      } catch (error: any) {
        toast.error('Không thể xóa bài học: ' + error.message);
        console.error('Lỗi khi xóa bài học:', error);
        // Khôi phục lại dữ liệu nếu có lỗi
        fetchModules();
      }
    }
  };

  // Di chuyển bài học lên
  const handleMoveLessonUp = async (moduleId: string, lessonIndex: number) => {
    if (lessonIndex <= 0 || animating) return;

    // Tạo bản sao của mảng lessons
    const lessonsCopy = [...lessons];
    const currentLesson = lessonsCopy[lessonIndex];
    const targetLesson = lessonsCopy[lessonIndex - 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingLessonId(currentLesson.lessonId);

    // Lấy vị trí của các phần tử
    const currentLessonEl = lessonRefs.current[currentLesson.lessonId];
    const targetLessonEl = lessonRefs.current[targetLesson.lessonId];

    if (!currentLessonEl || !targetLessonEl) {
      setAnimating(false);
      setMovingLessonId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetLessonEl.offsetTop - currentLessonEl.offsetTop;

    // Áp dụng hiệu ứng
    currentLessonEl.style.position = 'relative';
    currentLessonEl.style.zIndex = '10';
    currentLessonEl.style.transition = 'transform 500ms ease-in-out';
    currentLessonEl.style.transform = `translateY(${distance}px)`;

    targetLessonEl.style.position = 'relative';
    targetLessonEl.style.zIndex = '5';
    targetLessonEl.style.transition = 'transform 500ms ease-in-out';
    targetLessonEl.style.transform = `translateY(${currentLessonEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newLessons = [...lessonsCopy];

      // Hoán đổi vị trí
      const temp = newLessons[lessonIndex];
      newLessons[lessonIndex] = newLessons[lessonIndex - 1];
      newLessons[lessonIndex - 1] = temp;

      // Cập nhật orderIndex cho các bài học bị ảnh hưởng
      newLessons[lessonIndex].orderIndex = lessonIndex;
      newLessons[lessonIndex - 1].orderIndex = lessonIndex - 1;

      // Reset style
      if (currentLessonEl) {
        currentLessonEl.style.transition = 'none';
        currentLessonEl.style.transform = '';
        currentLessonEl.style.position = '';
        currentLessonEl.style.zIndex = '';
      }

      if (targetLessonEl) {
        targetLessonEl.style.transition = 'none';
        targetLessonEl.style.transform = '';
        targetLessonEl.style.position = '';
        targetLessonEl.style.zIndex = '';
      }

      onLessonsChange(moduleId, newLessons);
      setMovingLessonId(null);

      try {
        // Lấy danh sách ID bài học theo thứ tự mới
        const lessonIds = newLessons.map((lesson) => lesson.lessonId);

        // Gọi API để cập nhật thứ tự
        await LessonService.reorderLessons(moduleId, lessonIds);
        toast.success('Đã di chuyển bài học lên');
      } catch (error: any) {
        // Kiểm tra nếu thông báo lỗi thực sự là thông báo thành công
        if (error.message && error.message.includes('thành công')) {
          toast.success('Đã di chuyển bài học lên');
        } else {
          toast.error('Không thể di chuyển bài học: ' + error.message);
          console.error('Lỗi khi di chuyển bài học:', error);
          // Khôi phục lại dữ liệu nếu có lỗi
          fetchModules();
        }
      } finally {
        setAnimating(false);
      }
    }, 500); // Thời gian hiệu ứng
  };

  // Di chuyển bài học xuống
  const handleMoveLessonDown = async (moduleId: string, lessonIndex: number) => {
    if (lessonIndex >= lessons.length - 1 || animating) return;

    // Tạo bản sao của mảng lessons
    const lessonsCopy = [...lessons];
    const currentLesson = lessonsCopy[lessonIndex];
    const targetLesson = lessonsCopy[lessonIndex + 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingLessonId(currentLesson.lessonId);

    // Lấy vị trí của các phần tử
    const currentLessonEl = lessonRefs.current[currentLesson.lessonId];
    const targetLessonEl = lessonRefs.current[targetLesson.lessonId];

    if (!currentLessonEl || !targetLessonEl) {
      setAnimating(false);
      setMovingLessonId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetLessonEl.offsetTop - currentLessonEl.offsetTop;

    // Áp dụng hiệu ứng
    currentLessonEl.style.position = 'relative';
    currentLessonEl.style.zIndex = '10';
    currentLessonEl.style.transition = 'transform 500ms ease-in-out';
    currentLessonEl.style.transform = `translateY(${distance}px)`;

    targetLessonEl.style.position = 'relative';
    targetLessonEl.style.zIndex = '5';
    targetLessonEl.style.transition = 'transform 500ms ease-in-out';
    targetLessonEl.style.transform = `translateY(-${currentLessonEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newLessons = [...lessonsCopy];

      // Hoán đổi vị trí
      const temp = newLessons[lessonIndex];
      newLessons[lessonIndex] = newLessons[lessonIndex + 1];
      newLessons[lessonIndex + 1] = temp;

      // Cập nhật orderIndex cho các bài học bị ảnh hưởng
      newLessons[lessonIndex].orderIndex = lessonIndex;
      newLessons[lessonIndex + 1].orderIndex = lessonIndex + 1;

      // Reset style
      if (currentLessonEl) {
        currentLessonEl.style.transition = 'none';
        currentLessonEl.style.transform = '';
        currentLessonEl.style.position = '';
        currentLessonEl.style.zIndex = '';
      }

      if (targetLessonEl) {
        targetLessonEl.style.transition = 'none';
        targetLessonEl.style.transform = '';
        targetLessonEl.style.position = '';
        targetLessonEl.style.zIndex = '';
      }

      onLessonsChange(moduleId, newLessons);
      setMovingLessonId(null);

      try {
        // Lấy danh sách ID bài học theo thứ tự mới
        const lessonIds = newLessons.map((lesson) => lesson.lessonId);

        // Gọi API để cập nhật thứ tự
        await LessonService.reorderLessons(moduleId, lessonIds);
        toast.success('Đã di chuyển bài học xuống');
      } catch (error: any) {
        // Kiểm tra nếu thông báo lỗi thực sự là thông báo thành công
        if (error.message && error.message.includes('thành công')) {
          toast.success('Đã di chuyển bài học xuống');
        } else {
          toast.error('Không thể di chuyển bài học: ' + error.message);
          console.error('Lỗi khi di chuyển bài học:', error);
          // Khôi phục lại dữ liệu nếu có lỗi
          fetchModules();
        }
      } finally {
        setAnimating(false);
      }
    }, 500); // Thời gian hiệu ứng
  };

  return (
    <div className="divide-y divide-gray-200">
      {lessons.length > 0 ? (
        lessons.map((lesson, lessonIndex) => (
          <LessonItem
            key={lesson.lessonId}
            lesson={lesson}
            lessonIndex={lessonIndex}
            moduleId={moduleId}
            lessonRef={(el) => {
              if (el) lessonRefs.current[el.getAttribute('data-lesson-id') || ''] = el;
            }}
            movingLessonId={movingLessonId}
            handleLessonTitleChange={handleLessonTitleChange}
            handleLessonTypeChange={handleLessonTypeChange}
            handleMoveLessonUp={handleMoveLessonUp}
            handleMoveLessonDown={handleMoveLessonDown}
            handleDeleteLesson={handleDeleteLesson}
            totalLessons={lessons.length}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">Module này chưa có bài học nào</div>
      )}
    </div>
  );
}
