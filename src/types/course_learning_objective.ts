import { Course } from '@/types/courses';

export interface CourseLearningObjective {
  objectiveId: string | null;
  courseId?: string | null;
  description: string | null;
  orderIndex: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  course?: Course | null;
}
