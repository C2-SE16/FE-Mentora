'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { toast } from 'react-hot-toast';
import ModuleService from '@/apis/moduleService';
import CurriculumService from '@/apis/curriculumService';
import { Module } from '@/types/courses';
import ModuleList from '@/components/modules/manage-course/curriculum/ModuleList';
import EmptyState from '@/components/modules/manage-course/curriculum/EmptyState';
import CurriculumHeader from '@/components/modules/manage-course/curriculum/CurriculumHeader';
import CurriculumFooter from '@/components/modules/manage-course/curriculum/CurriculumFooter';

export default function CurriculumPage() {
  const pathname = usePathname();
  const courseId = pathname ? pathname.split('/')[3] : '';

  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [modules, setModules] = useState<Module[]>([]);
  const [animating, setAnimating] = useState(false);

  // Lấy danh sách module khi component được tải
  useEffect(() => {
    if (courseId) {
      fetchModules();
    }
  }, [courseId]);

  // Hàm lấy danh sách module từ API
  const fetchModules = async () => {
    setIsFetching(true);
    try {
      const moduleList = await ModuleService.getModulesByCourse(courseId);

      // Tải curriculum cho từng module
      const modulesWithCurricula = await Promise.all(
        moduleList.map(async (module) => {
          try {
            const curricula = await CurriculumService.getCurriculaByModuleId(module.moduleId);
            return { ...module, curricula };
          } catch (error) {
            console.error(`Lỗi khi tải curriculum cho module ${module.moduleId}:`, error);
            return module; // Trả về module không có curriculum nếu có lỗi
          }
        })
      );

      setModules(modulesWithCurricula);
    } catch (error: any) {
      toast.error('Lỗi khi tải danh sách module: ' + error.message);
      console.error('Lỗi khi tải danh sách module:', error);
    } finally {
      setIsFetching(false);
    }
  };

  // Thêm module mới
  const handleAddModule = async () => {
    try {
      const newModule = await ModuleService.createModule({
        title: 'Module mới',
        courseId: courseId,
        orderIndex: modules.length,
      });

      setModules([...modules, { ...newModule, curricula: [] }]);
      toast.success('Đã thêm module mới');
    } catch (error: any) {
      toast.error('Không thể thêm module: ' + error.message);
      console.error('Lỗi khi thêm module:', error);
    }
  };

  // Lưu thay đổi
  const handleSave = () => {
    toast.success('Đã lưu thay đổi');
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      <CurriculumHeader isFetching={isFetching} />

      <div className="relative">
        {modules.length === 0 ? (
          <EmptyState onAddModule={handleAddModule} />
        ) : (
          <ModuleList
            modules={modules}
            setModules={setModules}
            courseId={courseId}
            animating={animating}
            setAnimating={setAnimating}
            fetchModules={fetchModules}
          />
        )}
      </div>

      <CurriculumFooter
        handleAddModule={handleAddModule}
        handleSave={handleSave}
        isLoading={isLoading}
        animating={animating}
      />

      <style jsx global>{`
        .module-highlight {
          animation: fadeInOut 600ms ease-in-out;
          box-shadow:
            0 4px 6px -1px rgba(0, 0, 0, 0.1),
            0 2px 4px -1px rgba(0, 0, 0, 0.06);
        }

        @keyframes fadeInOut {
          0% {
            background-color: transparent;
          }
          30% {
            background-color: #dbeafe;
          } /* blue-100 */
          70% {
            background-color: #dbeafe;
          } /* blue-100 */
          100% {
            background-color: transparent;
          }
        }
      `}</style>
    </div>
  );
}
