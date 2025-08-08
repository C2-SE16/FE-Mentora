'use client';
import { useState } from 'react';
import { Module, Curriculum, CurriculumType } from '@/types/courses';
import CurriculumList from './CurriculumList';

interface ModuleItemProps {
  module: Module;
  moduleIndex: number;
  courseId: string;
  moduleRef: (el: HTMLDivElement | null) => void;
  movingModuleId: string | null;
  highlightModuleId: string | null;
  animating: boolean;
  setAnimating: React.Dispatch<React.SetStateAction<boolean>>;
  handleModuleTitleChange: (moduleId: string, newTitle: string) => void;
  handleDeleteModule: (moduleId: string) => void;
  handleMoveModuleUp: (moduleIndex: number) => void;
  handleMoveModuleDown: (moduleIndex: number) => void;
  handleAddCurriculum: (moduleId: string, type: CurriculumType) => void;
  onCurriculaChange: (moduleId: string, updatedCurricula: Curriculum[]) => void;
  fetchModules: () => Promise<void>;
  totalModules: number;
}

export default function ModuleItem({
  module,
  moduleIndex,
  courseId,
  moduleRef,
  movingModuleId,
  highlightModuleId,
  animating,
  setAnimating,
  handleModuleTitleChange,
  handleDeleteModule,
  handleMoveModuleUp,
  handleMoveModuleDown,
  handleAddCurriculum,
  onCurriculaChange,
  fetchModules,
  totalModules,
}: ModuleItemProps) {
  const [showCurriculumOptions, setShowCurriculumOptions] = useState(false);

  return (
    <div
      ref={moduleRef}
      className={`border border-gray-200 rounded-lg mb-4 transition-all duration-300 ease-in-out ${
        movingModuleId === module.moduleId ? 'z-20' : ''
      } ${highlightModuleId === module.moduleId ? 'module-highlight' : ''}`}
    >
      <div className="bg-gray-50 p-3 flex items-center justify-between">
        <div className="flex-1">
          <input
            type="text"
            value={module.title || ''}
            onChange={(e) => handleModuleTitleChange(module.moduleId, e.target.value)}
            placeholder="Nhập tiêu đề module"
            className="w-full border-0 bg-transparent focus:ring-0 text-gray-800 font-medium"
          />
        </div>

        <div className="flex items-center">
          <button
            onClick={() => handleMoveModuleUp(moduleIndex)}
            disabled={moduleIndex === 0 || animating}
            className={`p-1 mr-1 ${moduleIndex === 0 || animating ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleMoveModuleDown(moduleIndex)}
            disabled={moduleIndex === totalModules - 1 || animating}
            className={`p-1 mr-1 ${moduleIndex === totalModules - 1 || animating ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteModule(module.moduleId)}
            disabled={animating}
            className={`${animating ? 'text-gray-400' : 'text-red-500 hover:text-red-700'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Danh sách các curriculum trong module */}
      <CurriculumList
        curricula={module.curricula || []}
        moduleId={module.moduleId}
        courseId={courseId}
        animating={animating}
        setAnimating={setAnimating}
        onCurriculaChange={onCurriculaChange}
        fetchModules={fetchModules}
      />

      {/* Nút thêm curriculum mới vào module */}
      <div className="p-3 border-t border-gray-200">
        {showCurriculumOptions ? (
          <div className="flex items-center space-x-2 p-2 border border-dashed border-gray-300 rounded-md">
            <button
              onClick={() => {
                handleAddCurriculum(module.moduleId, 'LECTURE');
                setShowCurriculumOptions(false);
              }}
              disabled={animating}
              className="px-3 py-1 bg-blue-100 text-blue-700 rounded-md hover:bg-blue-200 text-sm"
            >
              + Lecture
            </button>
            <button
              onClick={() => {
                handleAddCurriculum(module.moduleId, 'QUIZ');
                setShowCurriculumOptions(false);
              }}
              disabled={animating}
              className="px-3 py-1 bg-purple-100 text-purple-700 rounded-md hover:bg-purple-200 text-sm"
            >
              + Quiz
            </button>
            <button
              onClick={() => {
                handleAddCurriculum(module.moduleId, 'CODING_EXERCISE');
                setShowCurriculumOptions(false);
              }}
              disabled={animating}
              className="px-3 py-1 bg-green-100 text-green-700 rounded-md hover:bg-green-200 text-sm"
            >
              + Coding Exercise
            </button>
            <button
              onClick={() => {
                handleAddCurriculum(module.moduleId, 'PRACTICE');
                setShowCurriculumOptions(false);
              }}
              disabled={animating}
              className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md hover:bg-yellow-200 text-sm"
            >
              + Practice
            </button>
            <button
              onClick={() => {
                handleAddCurriculum(module.moduleId, 'ASSIGNMENT');
                setShowCurriculumOptions(false);
              }}
              disabled={animating}
              className="px-3 py-1 bg-red-100 text-red-700 rounded-md hover:bg-red-200 text-sm"
            >
              + Assignment
            </button>
            <button
              onClick={() => setShowCurriculumOptions(false)}
              className="ml-auto text-gray-500 hover:text-gray-700"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </button>
          </div>
        ) : (
          <button
            onClick={() => setShowCurriculumOptions(true)}
            disabled={animating}
            className={`text-blue-600 hover:text-blue-800 flex items-center text-sm ${animating ? 'opacity-50 cursor-not-allowed' : ''}`}
          >
            {animating && highlightModuleId === module.moduleId ? (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-blue-600"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            ) : (
              <svg
                className="w-4 h-4 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
            )}
            {animating && highlightModuleId === module.moduleId
              ? 'Đang thêm curriculum...'
              : 'Thêm nội dung'}
          </button>
        )}
      </div>
    </div>
  );
}
