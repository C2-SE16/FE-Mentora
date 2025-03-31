import { Category } from '@/types/categories';
import { Course } from '@/types/courses';

export interface CourseCategory {
  courseCategoryId: string;
  categoryId: string | null;
  courseId: string | null;
  category?: Category | null;
  course?: Course | null;
}
