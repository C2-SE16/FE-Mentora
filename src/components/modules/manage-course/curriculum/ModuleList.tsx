'use client';
import { useRef, useState } from 'react';
import { toast } from 'react-hot-toast';
import ModuleService from '@/apis/moduleService';
import CurriculumService from '@/apis/curriculumService';
import { Module, Curriculum, CurriculumType } from '@/types/courses';
import ModuleItem from './ModuleItem';

interface ModuleListProps {
  modules: Module[];
  setModules: React.Dispatch<React.SetStateAction<Module[]>>;
  courseId: string;
  animating: boolean;
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  fetchModules: () => Promise<void>;
}

export default function ModuleList({
  modules,
  setModules,
  courseId,
  animating,
  setAnimating,
  fetchModules,
}: ModuleListProps) {
  const [movingModuleId, setMovingModuleId] = useState<string | null>(null);
  const [highlightModuleId, setHighlightModuleId] = useState<string | null>(null);
  const [isAddingCurriculum, setIsAddingCurriculum] = useState(false);
  const moduleRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});

  // Cập nhật tiêu đề module
  const handleModuleTitleChange = async (moduleId: string, newTitle: string) => {
    try {
      // Cập nhật UI trước
      const updatedModules = modules.map((module) => {
        if (module.moduleId === moduleId) {
          return { ...module, title: newTitle };
        }
        return module;
      });
      setModules(updatedModules);

      // Gọi API để cập nhật
      await ModuleService.updateModule(moduleId, { title: newTitle });
    } catch (error: any) {
      toast.error('Không thể cập nhật tiêu đề module: ' + error.message);
      console.error('Lỗi khi cập nhật tiêu đề module:', error);
      // Khôi phục lại dữ liệu nếu có lỗi
      fetchModules();
    }
  };

  // Thêm curriculum mới vào module
  const handleAddCurriculum = async (moduleId: string, type: CurriculumType) => {
    if (isAddingCurriculum) return;

    setIsAddingCurriculum(true);
    setHighlightModuleId(moduleId);
    try {
      // Tìm module trong danh sách
      const moduleIndex = modules.findIndex((m) => m.moduleId === moduleId);
      if (moduleIndex === -1) {
        throw new Error('Không tìm thấy module');
      }

      // Lấy số thứ tự cho curriculum mới
      const orderIndex = modules[moduleIndex].curricula?.length || 0;

      // Tạo curriculum trống mới
      const newCurriculum = await CurriculumService.createCurriculum({
        title:
          type === 'LECTURE'
            ? 'Bài giảng mới'
            : type === 'QUIZ'
              ? 'Bài kiểm tra mới'
              : type === 'CODING_EXERCISE'
                ? 'Bài tập lập trình mới'
                : type === 'PRACTICE'
                  ? 'Bài thực hành mới'
                  : 'Bài tập mới',
        moduleId: moduleId,
        type: type,
        orderIndex: orderIndex,
        description: '',
      });

      // Cập nhật UI
      const updatedModules = [...modules];
      if (!updatedModules[moduleIndex].curricula) {
        updatedModules[moduleIndex].curricula = [];
      }
      updatedModules[moduleIndex].curricula.push(newCurriculum);

      setModules(updatedModules);
      toast.success(
        `Đã thêm ${
          type === 'LECTURE'
            ? 'bài giảng'
            : type === 'QUIZ'
              ? 'bài kiểm tra'
              : type === 'CODING_EXERCISE'
                ? 'bài tập lập trình'
                : type === 'PRACTICE'
                  ? 'bài thực hành'
                  : 'bài tập'
        } mới`
      );
    } catch (error: any) {
      toast.error(`Không thể thêm curriculum: ${error.message}`);
      console.error('Lỗi khi thêm curriculum:', error);
    } finally {
      setIsAddingCurriculum(false);
      setHighlightModuleId(null);
    }
  };

  // Xóa module
  const handleDeleteModule = async (moduleId: string) => {
    if (
      confirm(
        'Bạn có chắc chắn muốn xóa module này không? Tất cả các curriculum trong module cũng sẽ bị xóa.'
      )
    ) {
      try {
        // Cập nhật UI trước
        const updatedModules = modules.filter((module) => module.moduleId !== moduleId);

        // Cập nhật lại orderIndex cho các module còn lại
        updatedModules.forEach((module, index) => {
          module.orderIndex = index;
        });

        setModules(updatedModules);

        // Gọi API để xóa module
        await ModuleService.deleteModule(moduleId);

        // Cập nhật lại thứ tự các module còn lại
        if (updatedModules.length > 0) {
          const moduleIds = updatedModules.map((module) => module.moduleId);
          await ModuleService.reorderModules(courseId, moduleIds);
        }

        toast.success('Đã xóa module');
      } catch (error: any) {
        toast.error('Không thể xóa module: ' + error.message);
        console.error('Lỗi khi xóa module:', error);
        // Khôi phục lại dữ liệu nếu có lỗi
        fetchModules();
      }
    }
  };

  // Cập nhật danh sách curricula trong module
  const handleCurriculaChange = (moduleId: string, updatedCurricula: Curriculum[]) => {
    const updatedModules = modules.map((module) => {
      if (module.moduleId === moduleId) {
        return { ...module, curricula: updatedCurricula };
      }
      return module;
    });

    setModules(updatedModules);
  };

  // Di chuyển module lên
  const handleMoveModuleUp = async (moduleIndex: number) => {
    if (moduleIndex <= 0 || animating) return;

    // Tạo bản sao của mảng modules
    const modulesCopy = [...modules];
    const currentModule = modulesCopy[moduleIndex];
    const targetModule = modulesCopy[moduleIndex - 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingModuleId(currentModule.moduleId);

    // Lấy vị trí của các phần tử
    const currentModuleEl = moduleRefs.current[currentModule.moduleId];
    const targetModuleEl = moduleRefs.current[targetModule.moduleId];

    if (!currentModuleEl || !targetModuleEl) {
      setAnimating(false);
      setMovingModuleId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetModuleEl.offsetTop - currentModuleEl.offsetTop;

    // Áp dụng hiệu ứng
    currentModuleEl.style.position = 'relative';
    currentModuleEl.style.zIndex = '10';
    currentModuleEl.style.transition = 'transform 500ms ease-in-out';
    currentModuleEl.style.transform = `translateY(${distance}px)`;

    targetModuleEl.style.position = 'relative';
    targetModuleEl.style.zIndex = '5';
    targetModuleEl.style.transition = 'transform 500ms ease-in-out';
    targetModuleEl.style.transform = `translateY(${currentModuleEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newModules = [...modulesCopy];

      // Hoán đổi vị trí
      const temp = newModules[moduleIndex];
      newModules[moduleIndex] = newModules[moduleIndex - 1];
      newModules[moduleIndex - 1] = temp;

      // Cập nhật orderIndex cho các module bị ảnh hưởng
      newModules[moduleIndex].orderIndex = moduleIndex;
      newModules[moduleIndex - 1].orderIndex = moduleIndex - 1;

      // Reset style
      if (currentModuleEl) {
        currentModuleEl.style.transition = 'none';
        currentModuleEl.style.transform = '';
        currentModuleEl.style.position = '';
        currentModuleEl.style.zIndex = '';
      }

      if (targetModuleEl) {
        targetModuleEl.style.transition = 'none';
        targetModuleEl.style.transform = '';
        targetModuleEl.style.position = '';
        targetModuleEl.style.zIndex = '';
      }

      setModules(newModules);
      setMovingModuleId(null);

      try {
        // Lấy danh sách ID module theo thứ tự mới
        const moduleIds = newModules.map((module) => module.moduleId);

        // Gọi API để cập nhật thứ tự
        await ModuleService.reorderModules(courseId, moduleIds);
        toast.success('Đã di chuyển module lên');
      } catch (error: any) {
        toast.error('Không thể di chuyển module: ' + error.message);
        console.error('Lỗi khi di chuyển module:', error);
        // Khôi phục lại dữ liệu nếu có lỗi
        fetchModules();
      } finally {
        setAnimating(false);
      }
    }, 500); // Thời gian hiệu ứng
  };

  // Di chuyển module xuống
  const handleMoveModuleDown = async (moduleIndex: number) => {
    if (moduleIndex >= modules.length - 1 || animating) return;

    // Tạo bản sao của mảng modules
    const modulesCopy = [...modules];
    const currentModule = modulesCopy[moduleIndex];
    const targetModule = modulesCopy[moduleIndex + 1];

    // Đánh dấu đang di chuyển
    setAnimating(true);
    setMovingModuleId(currentModule.moduleId);

    // Lấy vị trí của các phần tử
    const currentModuleEl = moduleRefs.current[currentModule.moduleId];
    const targetModuleEl = moduleRefs.current[targetModule.moduleId];

    if (!currentModuleEl || !targetModuleEl) {
      setAnimating(false);
      setMovingModuleId(null);
      return;
    }

    // Tính toán khoảng cách di chuyển
    const distance = targetModuleEl.offsetTop - currentModuleEl.offsetTop;

    // Áp dụng hiệu ứng
    currentModuleEl.style.position = 'relative';
    currentModuleEl.style.zIndex = '10';
    currentModuleEl.style.transition = 'transform 500ms ease-in-out';
    currentModuleEl.style.transform = `translateY(${distance}px)`;

    targetModuleEl.style.position = 'relative';
    targetModuleEl.style.zIndex = '5';
    targetModuleEl.style.transition = 'transform 500ms ease-in-out';
    targetModuleEl.style.transform = `translateY(-${currentModuleEl.offsetHeight}px)`;

    // Sau khi hoàn thành hiệu ứng, cập nhật dữ liệu
    setTimeout(async () => {
      // Hoán đổi vị trí trong mảng
      const newModules = [...modulesCopy];

      // Hoán đổi vị trí
      const temp = newModules[moduleIndex];
      newModules[moduleIndex] = newModules[moduleIndex + 1];
      newModules[moduleIndex + 1] = temp;

      // Cập nhật orderIndex cho các module bị ảnh hưởng
      newModules[moduleIndex].orderIndex = moduleIndex;
      newModules[moduleIndex + 1].orderIndex = moduleIndex + 1;

      // Reset style
      if (currentModuleEl) {
        currentModuleEl.style.transition = 'none';
        currentModuleEl.style.transform = '';
        currentModuleEl.style.position = '';
        currentModuleEl.style.zIndex = '';
      }

      if (targetModuleEl) {
        targetModuleEl.style.transition = 'none';
        targetModuleEl.style.transform = '';
        targetModuleEl.style.position = '';
        targetModuleEl.style.zIndex = '';
      }

      setModules(newModules);
      setMovingModuleId(null);

      try {
        // Lấy danh sách ID module theo thứ tự mới
        const moduleIds = newModules.map((module) => module.moduleId);

        // Gọi API để cập nhật thứ tự
        await ModuleService.reorderModules(courseId, moduleIds);
        toast.success('Đã di chuyển module xuống');
      } catch (error: any) {
        toast.error('Không thể di chuyển module: ' + error.message);
        console.error('Lỗi khi di chuyển module:', error);
        // Khôi phục lại dữ liệu nếu có lỗi
        fetchModules();
      } finally {
        setAnimating(false);
      }
    }, 500); // Thời gian hiệu ứng
  };

  return (
    <>
      {modules.map((module, moduleIndex) => (
        <ModuleItem
          key={module.moduleId}
          module={module}
          moduleIndex={moduleIndex}
          courseId={courseId}
          moduleRef={(el) => (moduleRefs.current[module.moduleId] = el)}
          movingModuleId={movingModuleId}
          highlightModuleId={highlightModuleId}
          animating={animating || isAddingCurriculum}
          setAnimating={setAnimating}
          handleModuleTitleChange={handleModuleTitleChange}
          handleDeleteModule={handleDeleteModule}
          handleMoveModuleUp={handleMoveModuleUp}
          handleMoveModuleDown={handleMoveModuleDown}
          handleAddCurriculum={handleAddCurriculum}
          onCurriculaChange={handleCurriculaChange}
          fetchModules={fetchModules}
          totalModules={modules.length}
        />
      ))}
    </>
  );
}
