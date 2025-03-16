import { Cart } from './cart';
import { CourseEnrollment, CourseReview, LessonProgress } from './courses';
import { Favorite } from './favorites';
import { Instructor } from './instructors';
import { Payment } from './orders';
import { VoucherUsageHistory } from './vouchers';

export enum UserRole {
  ADMIN = 'ADMIN',
  STUDENT = 'STUDENT',
  INSTRUCTOR = 'INSTRUCTOR',
  SUPPORT_STAFF = 'SUPPORT_STAFF',
  ANONYMOUS = 'ANONYMOUS',
}

export interface User {
  userId: string;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: UserRole | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  cart?: Cart[];
  courseEnrollments?: CourseEnrollment[];
  courseReviews?: CourseReview[];
  favorites?: Favorite[];
  instructor?: Instructor[];
  lessonProgress?: LessonProgress[];
  payments?: Payment[];
  voucherUsageHistory?: VoucherUsageHistory[];
}
