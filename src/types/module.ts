import { Course } from '@/types/courses';
import { Curricula } from '@/types/curricula';

export interface Module {
  moduleId: string;
  courseId: string | null;
  title: string | null;
  orderIndex: number;
  description: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  course?: Course;
  curricula?: Curricula[];
}
