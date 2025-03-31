import { Category } from './categories';
import { Instructor } from './instructors';
import { Favorite } from './favorites';
import { TargetAudience } from '@/types/target_audiences';
import { Requirement } from '@/types/requirements';
import { LearningObjective } from '@/types/learning-object';
import { ApproveEnum } from '@/types/enum';
import { Module } from '@/types/module';
import { CourseReview } from '@/types/course_review';
import { CourseEnrollment } from '@/types/course_enrollment';
import { CourseCategory } from '@/types/course_category';
import { CartItem } from '@/types/cart_item';
import { OrderDetail } from '@/types/order_detail';

export interface Course {
  courseId: string;
  instructorId: string | null;
  title: string | null;
  description: string | null;
  overview: string | null;
  durationTime: number | null;
  price: number | null;
  approved: ApproveEnum | null;
  rating: number | null;
  comment: string | null;
  thumbnail: string | null;
  isBestSeller: boolean | null;
  isRecommended: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  instructor?: Instructor | null;
  modules?: Module[];
  courseCategories?: CourseCategory[] | null;
  categories?: Category[] | null;
  reviews?: CourseReview[] | null;
  enrollments?: CourseEnrollment[] | null;
  cartItems?: CartItem[] | null;
  favorites?: Favorite[] | null;
  orderDetails?: OrderDetail[] | null;
  learningObjectives: LearningObjective[] | null;
  targetAudiences?: TargetAudience[] | null;
  requirements?: Requirement[] | undefined;
}
