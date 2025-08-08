import { RoleEnum } from '@/types/enum';
import { Cart } from './cart';
import { Favorite } from './favorites';
import { Instructor } from './instructors';
import { Payment } from './orders';
import { CourseEnrollment } from '@/types/course_enrollment';
import { CourseReview } from '@/types/course_review';
import { VoucherUsageHistory } from '@/types/voucher_usage_history';
import { LectureProgress } from '@/types/lecture_progress';
import { QuizAttempt } from '@/types/quiz_attempt';
import { CurriculumProgress } from '@/types/curriculum_progress';

export interface User {
  userId: string;
  email: string | null;
  password: string | null;
  firstName: string | null;
  lastName: string | null;
  avatar: string | null;
  role: RoleEnum | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  cart?: Cart[] | null;
  courseEnrollments?: CourseEnrollment[] | null;
  courseReviews?: CourseReview[] | null;
  favorites?: Favorite[] | null;
  instructor?: Instructor[] | null;
  payments?: Payment[] | null;
  voucherUsageHistory?: VoucherUsageHistory[] | null;
  lectureProgress?: LectureProgress[] | null;
  quizAttempt?: QuizAttempt[] | null;
  curriculumProgress?: CurriculumProgress[] | null;
}
