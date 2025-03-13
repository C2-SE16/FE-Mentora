export interface Course {
  courseId: string;
  title: string;
  description: string;
  rating: number;
  ratingCount?: number;
  enrollments: number;
  price: number;
  instructor: string;
  language: string;
  features: string[];
}

export interface Module {
  moduleId: string;
  title: string;
  lessons: Lesson[];
}

export interface Lesson {
  lessonId: string;
  title: string;
  type: 'VIDEO' | 'QUIZ' | 'TEXT';
  isFree: boolean;
  contentUrl?: string;
  duration?: number;
}

export interface CourseInfoProps {
  title: string;
  instructor: string;
  rating: number;
  ratingCount?: number;
  enrollments: number;
  language: string;
  features: string[];
} 