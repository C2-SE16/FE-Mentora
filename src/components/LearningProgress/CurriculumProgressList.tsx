import React, { useMemo } from 'react';
import { useProgressTracking } from '@/hooks/useProgress';
import Link from 'next/link';
import { Curricula } from '@/types/curricula';

interface CurriculumProgressListProps {
  courseId: string;
  curricula: Curricula[];
  currentCurriculumId?: string;
}

export const CurriculumProgressList: React.FC<CurriculumProgressListProps> = ({
  courseId,
  curricula,
  currentCurriculumId,
}) => {
  const { userProgress, isCompleted } = useProgressTracking();

  // Nhóm danh sách curriculum theo moduleId
  const curriculaByModule = useMemo(() => {
    if (!curricula?.length) return {};

    return curricula.reduce((acc: Record<string, Curricula[]>, curr) => {
      const moduleId = curr.moduleId || 'unknown';
      if (!acc[moduleId]) {
        acc[moduleId] = [];
      }
      acc[moduleId].push(curr);
      return acc;
    }, {});
  }, [curricula]);

  // Lấy danh sách tất cả module ID duy nhất
  const moduleIds = useMemo(() => {
    return Object.keys(curriculaByModule);
  }, [curriculaByModule]);

  // Nhận biết trạng thái của một curriculum
  const getCurriculumStatus = (curriculum: Curricula) => {
    if (!curriculum.curriculumId) return 'not-started';

    if (isCompleted(curriculum.curriculumId)) {
      return 'completed';
    }

    const inProgress = userProgress.curriculumProgress.some(
      progress => progress.curriculumId === curriculum.curriculumId && progress.status === 'IN_PROGRESS'
    );

    if (inProgress) {
      return 'in-progress';
    }

    return 'not-started';
  };

  return (
    <div className="space-y-6">
      {moduleIds.map((moduleId) => {
        const moduleItems = curriculaByModule[moduleId] || [];
        // Tìm module name từ item đầu tiên
        const moduleName = moduleItems[0]?.module?.title || 'Không có tên';

        // Tính số lượng bài học đã hoàn thành trong module
        const completedCount = moduleItems.filter(
          item => getCurriculumStatus(item) === 'completed'
        ).length;

        const progress = moduleItems.length > 0
          ? Math.round((completedCount / moduleItems.length) * 100)
          : 0;

        return (
          <div key={moduleId} className="border rounded-lg overflow-hidden">
            <div className="bg-gray-100 dark:bg-gray-800 px-4 py-3 border-b">
              <div className="flex justify-between items-center">
                <h3 className="font-medium">{moduleName}</h3>
                <span className="text-sm text-gray-600 dark:text-gray-300">
                  {completedCount}/{moduleItems.length} hoàn thành
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-1.5 mt-2 dark:bg-gray-700">
                <div
                  className="bg-blue-600 h-1.5 rounded-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
            <ul className="divide-y">
              {moduleItems.map((curriculum) => {
                const status = getCurriculumStatus(curriculum);

                return (
                  <li key={curriculum.curriculumId} className="relative">
                    <Link
                      href={`/courses/${courseId}/learn/${curriculum.curriculumId}`}
                      className={`block px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors
                        ${currentCurriculumId === curriculum.curriculumId ? 'bg-blue-50 dark:bg-blue-900/20' : ''}
                      `}
                    >
                      <div className="flex items-center">
                        {/* Status icon */}
                        <div className="mr-3 flex-shrink-0">
                          {status === 'completed' ? (
                            <div className="w-5 h-5 rounded-full bg-green-500 flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          ) : status === 'in-progress' ? (
                            <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center">
                              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full border-2 border-gray-300 dark:border-gray-600"></div>
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1">
                          <h4 className={`font-medium ${status === 'completed'
                            ? 'text-green-600 dark:text-green-400'
                            : status === 'in-progress'
                              ? 'text-blue-600 dark:text-blue-400'
                              : 'text-gray-800 dark:text-gray-200'
                            }`}>
                            {curriculum.title || 'Không có tiêu đề'}
                          </h4>
                          <div className="flex items-center mt-1 text-sm text-gray-500 dark:text-gray-400">
                            {/* Curriculum type icon */}
                            {curriculum.type === 'LECTURE' ? (
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            ) : curriculum.type === 'QUIZ' ? (
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            ) : (
                              <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                            )}
                            <span>
                              {curriculum.type === 'LECTURE' ? 'Bài giảng' :
                                curriculum.type === 'QUIZ' ? 'Bài kiểm tra' :
                                  'Tài liệu học tập'}
                            </span>
                          </div>
                        </div>

                        {/* Locked indicator */}
                        {status === 'not-started' && (
                          <div className="ml-2">
                            <svg className="w-5 h-5 text-gray-400 dark:text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                            </svg>
                          </div>
                        )}
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default CurriculumProgressList; 