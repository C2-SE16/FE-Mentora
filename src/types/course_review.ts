import { Course } from '@/types/courses';
import { User } from '@/types/users';

export interface CourseReview {
  reviewId: string;
  courseId?: string | null;
  userId?: string | null;
  rating: number | null;
  comment?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  course?: Course | null;
  user?: User | null;
}
