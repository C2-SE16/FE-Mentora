import { Course } from '@/types/courses';
import { Voucher } from '@/types/vouchers';

export interface VoucherCourse {
  voucherCourseId: string | null;
  voucherId?: string | null;
  courseId?: string | null;
  createdAt?: Date | null;
  course?: Course | null;
  voucher?: Voucher | null;
}
