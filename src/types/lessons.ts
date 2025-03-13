import { Course, Module, Lesson } from './courses';
import { Instructor } from './instructors';

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
  instructor: string | Instructor;
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