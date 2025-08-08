'use client';
import { useState, useRef } from 'react';
import { toast } from 'react-hot-toast';
import CurriculumService from '@/apis/curriculumService';
import { Curriculum, CurriculumType } from '@/types/courses';
import CurriculumItem from './CurriculumItem';
import LectureService from '@/apis/lectureService';
import QuizService from '@/apis/quizService';

interface CurriculumListProps {
  curricula: Curriculum[];
  moduleId: string;
  courseId: string;
  animating: boolean;
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  onCurriculaChange: (moduleId: string, updatedCurricula: Curriculum[]) => void;
  fetchModules: () => Promise<void>;
}

export default function CurriculumList({
  curricula = [],
  moduleId,
  courseId,
  animating,
  setAnimating,
  onCurriculaChange,
  fetchModules,
}: CurriculumListProps) {
  const [movingCurriculumId, setMovingCurriculumId] = useState<string | null>(null);
  const curriculumRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cập nhật tiêu đề curriculum
  const handleCurriculumTitleChange = async (
    moduleId: string,
    curriculumId: string,
    newTitle: string
  ) => {
    try {
      // Tìm curriculum cần cập nhật
      const curriculumToUpdate = curricula.find((c) => c.curriculumId === curriculumId);
      if (!curriculumToUpdate) return;

      // Cập nhật UI trước
      const updatedCurricula = curricula.map((curriculum) => {
        if (curriculum.curriculumId === curriculumId) {
          // Cập nhật tiêu đề curriculum
          const updatedCurriculum = { ...curriculum, title: newTitle };

          // Cập nhật tiêu đề lecture hoặc quiz
          if (
            updatedCurriculum.type === 'LECTURE' &&
            updatedCurriculum.tbl_lectures &&
            updatedCurriculum.tbl_lectures.length > 0
          ) {
            updatedCurriculum.tbl_lectures[0].title = newTitle;
          } else if (
            updatedCurriculum.type === 'QUIZ' &&
            updatedCurriculum.tbl_quizzes &&
            updatedCurriculum.tbl_quizzes.length > 0
          ) {
            updatedCurriculum.tbl_quizzes[0].title = newTitle;
          }

          // Cập nhật content nếu có
          if (updatedCurriculum.content) {
            updatedCurriculum.content.title = newTitle;
          }

          return updatedCurriculum;
        }
        return curriculum;
      });

      onCurriculaChange(moduleId, updatedCurricula);

      // Gọi API để cập nhật
      await CurriculumService.updateCurriculum(curriculumId, { title: newTitle });

      // Cập nhật lecture hoặc quiz nếu có
      let contentId: string | undefined;

      if (
        curriculumToUpdate.type === 'LECTURE' &&
        curriculumToUpdate.tbl_lectures &&
        curriculumToUpdate.tbl_lectures.length > 0
      ) {
        contentId = curriculumToUpdate.tbl_lectures[0].lectureId;
        await LectureService.updateLecture(contentId, { title: newTitle });
      } else if (
        curriculumToUpdate.type === 'QUIZ' &&
        curriculumToUpdate.tbl_quizzes &&
        curriculumToUpdate.tbl_quizzes.length > 0
      ) {
        contentId = curriculumToUpdate.tbl_quizzes[0].quizId;
        await QuizService.updateQuiz(contentId, { title: newTitle });
      }
    } catch (error: any) {
      toast.error('Không thể cập nhật tiêu đề: ' + error.message);
      console.error('Lỗi khi cập nhật tiêu đề curriculum:', error);
      // Khôi phục lại dữ liệu nếu có lỗi
      fetchModules();
    }
  };

  // Thay đổi loại curriculum
  const handleCurriculumTypeChange = async (
    moduleId: string,
    curriculumId: string,
    newType: CurriculumType
  ) => {
    try {
      // Cập nhật UI trước
      const updatedCurricula = curricula.map((curriculum) => {
        if (curriculum.curriculumId === curriculumId) {
          return { ...curriculum, type: newType };
        }
        return curriculum;
      });

      onCurriculaChange(moduleId, updatedCurricula);

      // Gọi API để cập nhật
      await CurriculumService.updateCurriculum(curriculumId, { type: newType });
      toast.success('Đã cập nhật loại curriculum');
    } catch (error: any) {
      toast.error('Không thể cập nhật loại curriculum: ' + error.message);
      console.error('Lỗi khi cập nhật loại curriculum:', error);
      // Khôi phục lại dữ liệu nếu có lỗi
      fetchModules();
    }
  };

  // Xóa curriculum
  const handleDeleteCurriculum = async (moduleId: string, curriculumId: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa curriculum này không?')) {
      try {
        // Cập nhật UI trước
        const updatedCurricula = curricula.filter(
          (curriculum) => curriculum.curriculumId !== curriculumId
        );

        // Cập nhật lại orderIndex cho các curriculum còn lại
        updatedCurricula.forEach((curriculum, index) => {
          curriculum.orderIndex = index;
        });

        onCurriculaChange(moduleId, updatedCurricula);

        // Gọi API để xóa curriculum
        await CurriculumService.deleteCurriculum(curriculumId);

        // Cập nhật lại thứ tự các curriculum còn lại
        if (updatedCurricula.length > 0) {
          const curriculumIds = updatedCurricula.map((curriculum) => curriculum.curriculumId);
          await CurriculumService.reorderCurricula(moduleId, curriculumIds);
        }

        toast.success('Đã xóa curriculum thành công');
      } catch (error: any) {
        toast.error('Không thể xóa curriculum: ' + error.message);
        console.error('Lỗi khi xóa curriculum:', error);
        // Khôi phục lại dữ liệu nếu có lỗi
        fetchModules();
      }
    }
  };

  // Di chuyển curriculum lên
  const handleMoveCurriculumUp = async (moduleId: string, curriculumIndex: number) => {
    if (curriculumIndex <= 0 || animating) return;

    // Tạo bản sao của mảng curricula
    const curriculaCopy = [...curricula];
    const currentCurriculum = curriculaCopy[curriculumIndex];
    const targetCurriculum = curriculaCopy[curriculumIndex - 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingCurriculumId(currentCurriculum.curriculumId);

    // Lấy vị trí của các phần tử
    const currentCurriculumEl = curriculumRefs.current[currentCurriculum.curriculumId];
    const targetCurriculumEl = curriculumRefs.current[targetCurriculum.curriculumId];

    if (!currentCurriculumEl || !targetCurriculumEl) {
      setAnimating(false);
      setMovingCurriculumId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetCurriculumEl.offsetTop - currentCurriculumEl.offsetTop;

    // Áp dụng hiệu ứng
    currentCurriculumEl.style.position = 'relative';
    currentCurriculumEl.style.zIndex = '10';
    currentCurriculumEl.style.transition = 'transform 500ms ease-in-out';
    currentCurriculumEl.style.transform = `translateY(${distance}px)`;

    targetCurriculumEl.style.position = 'relative';
    targetCurriculumEl.style.zIndex = '5';
    targetCurriculumEl.style.transition = 'transform 500ms ease-in-out';
    targetCurriculumEl.style.transform = `translateY(${currentCurriculumEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newCurricula = [...curriculaCopy];

      // Hoán đổi vị trí
      const temp = newCurricula[curriculumIndex];
      newCurricula[curriculumIndex] = newCurricula[curriculumIndex - 1];
      newCurricula[curriculumIndex - 1] = temp;

      // Cập nhật orderIndex cho các curriculum bị ảnh hưởng
      newCurricula[curriculumIndex].orderIndex = curriculumIndex;
      newCurricula[curriculumIndex - 1].orderIndex = curriculumIndex - 1;

      // Reset style
      if (currentCurriculumEl) {
        currentCurriculumEl.style.transition = 'none';
        currentCurriculumEl.style.transform = '';
        currentCurriculumEl.style.position = '';
        currentCurriculumEl.style.zIndex = '';
      }

      if (targetCurriculumEl) {
        targetCurriculumEl.style.transition = 'none';
        targetCurriculumEl.style.transform = '';
        targetCurriculumEl.style.position = '';
        targetCurriculumEl.style.zIndex = '';
      }

      onCurriculaChange(moduleId, newCurricula);
      setMovingCurriculumId(null);

      try {
        // Lấy danh sách ID curriculum theo thứ tự mới
        const curriculumIds = newCurricula.map((curriculum) => curriculum.curriculumId);

        // Gọi API để cập nhật thứ tự
        await CurriculumService.reorderCurricula(moduleId, curriculumIds);
        toast.success('Đã di chuyển curriculum lên');
      } catch (error: any) {
        // Kiểm tra nếu thông báo lỗi thực sự là thông báo thành công
        if (error.message && error.message.includes('thành công')) {
          toast.success('Đã di chuyển curriculum lên');
        } else {
          toast.error('Không thể di chuyển curriculum: ' + error.message);
          console.error('Lỗi khi di chuyển curriculum:', error);
          // Khôi phục lại dữ liệu nếu có lỗi
          fetchModules();
        }
      } finally {
        setAnimating(false);
      }
    }, 500); // Thời gian hiệu ứng
  };

  // Di chuyển curriculum xuống
  const handleMoveCurriculumDown = async (moduleId: string, curriculumIndex: number) => {
    if (curriculumIndex >= curricula.length - 1 || animating) return;

    // Tạo bản sao của mảng curricula
    const curriculaCopy = [...curricula];
    const currentCurriculum = curriculaCopy[curriculumIndex];
    const targetCurriculum = curriculaCopy[curriculumIndex + 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingCurriculumId(currentCurriculum.curriculumId);

    // Lấy vị trí của các phần tử
    const currentCurriculumEl = curriculumRefs.current[currentCurriculum.curriculumId];
    const targetCurriculumEl = curriculumRefs.current[targetCurriculum.curriculumId];

    if (!currentCurriculumEl || !targetCurriculumEl) {
      setAnimating(false);
      setMovingCurriculumId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetCurriculumEl.offsetTop - currentCurriculumEl.offsetTop;

    // Áp dụng hiệu ứng
    currentCurriculumEl.style.position = 'relative';
    currentCurriculumEl.style.zIndex = '10';
    currentCurriculumEl.style.transition = 'transform 500ms ease-in-out';
    currentCurriculumEl.style.transform = `translateY(${distance}px)`;

    targetCurriculumEl.style.position = 'relative';
    targetCurriculumEl.style.zIndex = '5';
    targetCurriculumEl.style.transition = 'transform 500ms ease-in-out';
    targetCurriculumEl.style.transform = `translateY(-${currentCurriculumEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newCurricula = [...curriculaCopy];

      // Hoán đổi vị trí
      const temp = newCurricula[curriculumIndex];
      newCurricula[curriculumIndex] = newCurricula[curriculumIndex + 1];
      newCurricula[curriculumIndex + 1] = temp;

      // Cập nhật orderIndex cho các curriculum bị ảnh hưởng
      newCurricula[curriculumIndex].orderIndex = curriculumIndex;
      newCurricula[curriculumIndex + 1].orderIndex = curriculumIndex + 1;

      // Reset style
      if (currentCurriculumEl) {
        currentCurriculumEl.style.transition = 'none';
        currentCurriculumEl.style.transform = '';
        currentCurriculumEl.style.position = '';
        currentCurriculumEl.style.zIndex = '';
      }

      if (targetCurriculumEl) {
        targetCurriculumEl.style.transition = 'none';
        targetCurriculumEl.style.transform = '';
        targetCurriculumEl.style.position = '';
        targetCurriculumEl.style.zIndex = '';
      }

      onCurriculaChange(moduleId, newCurricula);
      setMovingCurriculumId(null);

      try {
        // Lấy danh sách ID curriculum theo thứ tự mới
        const curriculumIds = newCurricula.map((curriculum) => curriculum.curriculumId);

        // Gọi API để cập nhật thứ tự
        await CurriculumService.reorderCurricula(moduleId, curriculumIds);
        toast.success('Đã di chuyển curriculum xuống');
      } catch (error: any) {
        // Kiểm tra nếu thông báo lỗi thực sự là thông báo thành công
        if (error.message && error.message.includes('thành công')) {
          toast.success('Đã di chuyển curriculum xuống');
        } else {
          toast.error('Không thể di chuyển curriculum: ' + error.message);
          console.error('Lỗi khi di chuyển curriculum:', error);
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
      {curricula.length > 0 ? (
        curricula.map((curriculum, curriculumIndex) => (
          <CurriculumItem
            key={curriculum.curriculumId}
            curriculum={curriculum}
            curriculumIndex={curriculumIndex}
            moduleId={moduleId}
            courseId={courseId}
            curriculumRef={(el) => {
              if (el) curriculumRefs.current[el.getAttribute('data-curriculum-id') || ''] = el;
            }}
            movingCurriculumId={movingCurriculumId}
            handleCurriculumTitleChange={handleCurriculumTitleChange}
            handleCurriculumTypeChange={handleCurriculumTypeChange}
            handleMoveCurriculumUp={handleMoveCurriculumUp}
            handleMoveCurriculumDown={handleMoveCurriculumDown}
            handleDeleteCurriculum={handleDeleteCurriculum}
            totalCurricula={curricula.length}
            fetchModules={fetchModules}
          />
        ))
      ) : (
        <div className="p-4 text-center text-gray-500">Module này chưa có curriculum nào</div>
      )}
    </div>
  );
}
