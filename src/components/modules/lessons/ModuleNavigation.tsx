'use client';

import { useState } from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { ModuleNavigationProps } from '@/types/lessons';

export default function ModuleNavigation({
  courseId,
  modules,
  currentLessonId,
}: ModuleNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<string[]>(modules.map((m) => m.moduleId));

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) =>
      prev.includes(moduleId) ? prev.filter((id) => id !== moduleId) : [...prev, moduleId]
    );
  };

  return (
    <div>
      {modules.map((module) => (
        <div key={module.moduleId} className="border-b">
          <div
            className="p-3 bg-gray-100 flex items-center justify-between cursor-pointer"
            onClick={() => toggleModule(module.moduleId)}
          >
            <span className="font-medium">
              {expandedModules.includes(module.moduleId) ? '▼' : '►'} {module.title}
            </span>
          </div>

          {expandedModules.includes(module.moduleId) && (
            <div className="bg-white">
              {module.lessons.map((lesson) => (
                <Link
                  key={lesson.lessonId}
                  href={`/courses/${courseId}/lessons/${lesson.lessonId}`}
                >
                  <div
                    className={cn(
                      'p-3 border-t flex items-center hover:bg-gray-50 cursor-pointer',
                      currentLessonId === lesson.lessonId && 'bg-blue-50'
                    )}
                  >
                    <div className="mr-3">
                      {lesson.type === 'VIDEO' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : lesson.type === 'QUIZ' ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                            clipRule="evenodd"
                          />
                        </svg>
                      ) : (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 text-gray-500"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="text-sm">{lesson.title}</p>
                      {lesson.isFree && <span className="text-xs text-green-600">Miễn phí</span>}
                    </div>
                    {lesson.duration && (
                      <span className="text-xs text-gray-500">
                        {Math.floor(lesson.duration / 60)}:
                        {(lesson.duration % 60).toString().padStart(2, '0')}
                      </span>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
