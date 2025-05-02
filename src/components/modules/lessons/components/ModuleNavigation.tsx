'use client';

import { Module } from '@/types/module';
import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface ModuleNavigationProps {
  courseId?: string;
  modules?: Module[];
  currentLessonId?: string;
}

export default function ModuleNavigation({
  courseId,
  modules = [],
  currentLessonId,
}: ModuleNavigationProps) {
  const [expandedModules, setExpandedModules] = useState<{ [key: string]: boolean }>({});
  const pathname = usePathname();

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => ({
      ...prev,
      [moduleId]: !prev[moduleId],
    }));
  };

  return (
    <div className="divide-y divide-gray-200">
      {modules.map((module) => (
        <div key={module.moduleId} className="py-2">
          <button
            onClick={() => toggleModule(module.moduleId)}
            className="w-full flex items-center justify-between px-4 py-2 text-left hover:bg-gray-50"
          >
            <span className="font-medium">{module.title}</span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                expandedModules[module.moduleId] ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {expandedModules[module.moduleId] && (
            <div className="pl-4 space-y-1">
              {module.curricula?.map((curriculum) => (
                <div key={curriculum.curriculumId} className="py-1">
                  <div className="font-medium text-sm text-gray-700 mb-1">{curriculum.title}</div>
                  <div className="space-y-1">
                    {curriculum.lectures?.map((lecture) => (
                      <Link
                        key={lecture.lectureId}
                        href={`/course/${courseId}/lecture/${lecture.lectureId}`}
                        className={`block px-4 py-2 text-sm rounded-md ${
                          lecture.lectureId === currentLessonId
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                            />
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                          </svg>
                          <span>{lecture.title}</span>
                          {lecture.isFree && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Miễn phí
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                    {curriculum.quizzes?.map((quiz) => (
                      <Link
                        key={quiz.quizId}
                        href={`/course/${courseId}/quiz/${quiz.quizId}`}
                        className={`block px-4 py-2 text-sm rounded-md ${
                          quiz.quizId === currentLessonId
                            ? 'bg-blue-50 text-blue-600'
                            : 'text-gray-600 hover:bg-gray-50'
                        }`}
                      >
                        <div className="flex items-center">
                          <svg
                            className="w-4 h-4 mr-2"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                          </svg>
                          <span>{quiz.title}</span>
                          {quiz.isFree && (
                            <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded">
                              Miễn phí
                            </span>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
