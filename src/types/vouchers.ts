import { Course } from './courses';

export enum VoucherScope {
  ALL_COURSES = 'ALL_COURSES',
  SPECIFIC_COURSES = 'SPECIFIC_COURSES',
  CATEGORY = 'CATEGORY'
}

export interface Voucher {
  voucherId: string;
  code: string | null;
  description: string | null;
  scope: VoucherScope | null;
  discountType: string | null;
  discountValue: number | null;
  maxDiscount: number | null;
  startDate: Date | null;
  endDate: Date | null;
  maxUsage: number | null;
  isActive: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  
  // Relationships
  voucherCourses?: VoucherCourse[];
  usageHistory?: VoucherUsageHistory[];
}

export interface VoucherCourse {
  voucherCourseId: string;
  voucherId: string | null;
  courseId: string | null;
  createdAt: Date | null;
  
  // Relationships
  voucher?: Voucher;
  course?: Course;
}

export interface VoucherUsageHistory {
  usageId: string;
  voucherId: string | null;
  userId: string | null;
  orderId: string | null;
  usedAt: Date | null;
  discountAmount: number | null;
  
  // Relationships
  voucher?: Voucher;
  user?: any; // Tham chiếu đến User
  orderDetail?: any; // Tham chiếu đến OrderDetail
} 