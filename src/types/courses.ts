import { Category, CourseCategory } from './categories';
import { Instructor } from './instructors';
import { OrderDetail } from './orders';
import { CartItem } from './cart';
import { Favorite } from './favorites';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED'
}

export interface Course {
  courseId: string;
  instructorId: string | null;
  title: string | null;
  description: string | null;
  overview: string | null;
  durationTime: number | null;
  price: number | null;
  approved: ApprovalStatus | null;
  rating: number | null;
  ratingCount?: number;
  comment: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  
  // Relationships
  instructor?: Instructor;
  modules?: Module[];
  courseCategories?: CourseCategory[];
  categories?: Category[];
  reviews?: CourseReview[];
  enrollments?: CourseEnrollment[];
  cartItems?: CartItem[];
  favorites?: Favorite[];
  orderDetails?: OrderDetail[];
}

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
  lessons?: Lesson[];
}

export enum LessonType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ'
}

export interface Lesson {
  lessonId: string;
  moduleId: string | null;
  title: string | null;
  contentType: LessonType;
  contentUrl: string | null;
  duration: number | null;
  orderIndex: number;
  description: string | null;
  isFree: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  
  // Relationships
  module?: Module;
  progress?: LessonProgress[];
}

export enum LessonProgressStatus {
  NOT_STARTED = 'NOT_STARTED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED'
}

export interface LessonProgress {
  lessonProgressId: string;
  userId: string | null;
  lessonId: string | null;
  status: LessonProgressStatus | null;
  progressPercentage: number | null;
  lastWatchPosition: number | null;
  completedAt: Date | null;
  
  // Relationships
  lesson?: Lesson;
  user?: any; // Tham chiếu đến User
}

export interface CourseEnrollment {
  courseEnrollmentId: string;
  courseId: string | null;
  userId: string | null;
  enrolledAt: Date | null;
  
  // Relationships
  course?: Course;
  user?: any; // Tham chiếu đến User
}

export interface CourseReview {
  reviewId: string;
  courseId: string | null;
  userId: string | null;
  rating: number;
  comment: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  
  // Relationships
  course?: Course;
  user?: any; // Tham chiếu đến User
}

// Props interfaces
export interface CourseInfoProps {
  title: string;
  instructor: string;
  rating: number;
  ratingCount?: number;
  enrollments: number;
  language: string;
  features: string[];
} 