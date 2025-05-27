import { Category } from './categories';
import { Favorite } from './favorites';
import { TargetAudience } from '@/types/target_audiences';
import { Requirement } from '@/types/requirements';
import { LearningObjective } from '@/types/learning-object';
import { ApproveEnum } from '@/types/enum';
import { Module as ImportedModule } from '@/types/module';
import { CourseReview as ImportedCourseReview } from './course_review';
import { CourseEnrollment as ImportedCourseEnrollment } from '@/types/course_enrollment';
import { CartItem } from '@/types/cart_item';
import { OrderDetail } from '@/types/order_detail';
import { Voucher } from './vouchers';

export interface Price {
  s: number;
  e: number;
  d: number[];
}

export interface Rating {
  s: number;
  e: number;
  d: number[];
}

export interface Instructor {
  instructorId: string;
  userId: string;
  bio: string;
  profilePicture: string;
  experience: string;
  averageRating: number;
  isVerified: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    userId: string;
    email: string;
    fullName: string;
    avatar: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface CourseCategory {
  courseCategoryId: string;
  categoryId: string;
  courseId: string;
  category?: Category;
}

export interface Course {
  courseId: string;
  instructorId: string;
  title: string;
  description: string;
  overview: string;
  durationTime: number;
  price: Price | string | number;
  approved: string;
  rating: number;
  comment: string | null;
  createdAt: string;
  updatedAt: string;
  isBestSeller: boolean;
  isRecommended: boolean;
  thumbnail: string;
  publicId?: string;
  categories: Category[];
  instructor: Instructor;
  currentPrice: number;
  originalPrice: number;
  hasDiscount: boolean;
  appliedVoucher: Voucher | null;
  availableVouchers: Voucher[];
  tbl_instructors: Instructor;
  finalPrice: number;
  // Relationships
  modules?: ImportedModule[];
  courseCategories?: CourseCategory[];
  reviews?: ImportedCourseReview[];
  enrollments?: ImportedCourseEnrollment[];
  cartItems?: CartItem[];
  favorites?: Favorite[];
  orderDetails?: OrderDetail[];
  learningObjectives: LearningObjective[];
  targetAudience?: TargetAudience[];
  requirements?: Requirement[];
}

export type CurriculumType = 'LECTURE' | 'QUIZ' | 'CODING_EXERCISE' | 'PRACTICE' | 'ASSIGNMENT';

export interface Curriculum {
  curriculumId: string;
  moduleId: string;
  title: string;
  orderIndex: number;
  type: CurriculumType;
  description: string;
  createdAt: string;
  updatedAt: string;
  tbl_lectures?: Lecture[];
  tbl_quizzes?: Quiz[];
  content?: Lecture | Quiz;
}

export interface Lecture {
  lectureId: string;
  curriculumId: string;
  title: string;
  description: string;
  videoUrl: string | null;
  articleContent: string | null;
  duration: number | null;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Quiz {
  quizId: string;
  curriculumId: string;
  title: string;
  description: string;
  timeLimit: number | null;
  passingScore: number;
  isFree: boolean;
  createdAt: string;
  updatedAt: string;
  questions?: QuizQuestion[];
}

export interface QuizQuestion {
  questionId: string;
  quizId: string;
  questionText: string;
  questionType: 'MULTIPLE_CHOICE' | 'SINGLE_CHOICE';
  orderIndex: number;
  options?: QuizOption[];
}

export interface QuizOption {
  optionId: string;
  questionId: string;
  optionText: string;
  isCorrect: boolean;
  orderIndex: number;
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
  curricula?: Curriculum[];
}

export enum LessonType {
  VIDEO = 'VIDEO',
  ARTICLE = 'ARTICLE',
  QUIZ = 'QUIZ',
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
  COMPLETED = 'COMPLETED',
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
