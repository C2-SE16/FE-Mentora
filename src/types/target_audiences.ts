import { Course } from '@/types/courses';

export interface TargetAudience {
  audienceId: string | null;
  courseId: string | null;
  description: string | null;
  orderIndex: number | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  course?: Course | null;
}
