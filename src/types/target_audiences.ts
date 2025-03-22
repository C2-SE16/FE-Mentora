import { Course } from '@/types/courses';

export interface TargetAudience {
  audienceId: string;
  courseId: string;
  description: string;
  orderIndex: number;
  createdAt: Date;
  updatedAt: Date;

  // Relationships
  course?: Course;
}
