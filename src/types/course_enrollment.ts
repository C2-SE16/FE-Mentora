import { Course } from '@/types/courses';
import { User } from '@/types/users';

export interface CourseEnrollment {
  courseEnrollmentId: string;
  courseId?: string;
  enrolledAt?: Date;
  userId?: string;
  course?: Course | null;
  user?: User | null;
}
