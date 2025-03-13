import { Course, Module, Lesson } from './courses';

export interface LessonHeaderProps {
  courseTitle: string;
  lessonTitle: string;
  progress?: number;
}

export interface LessonContentProps {
  courseId: string;
  lessonId: string;
  lesson: Lesson;
  module: Module;
  modules: Module[];
  instructor: string;
  rating?: number;
  ratingCount?: number;
}

export interface VideoPlayerProps {
  videoUrl?: string;
  lessonId: string;
  onProgress?: (progress: number) => void;
}

export interface ModuleNavigationProps {
  courseId: string;
  modules: Module[];
  currentLessonId: string;
} 