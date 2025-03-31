import { Course } from '@/types/courses';
import { Payment } from '@/types/payment';
import { VoucherUsageHistory } from '@/types/voucher_usage_history';

export interface OrderDetail {
  orderDetailId: string | null;
  paymentId?: string | null;
  courseId?: string | null;
  price?: number | null;
  discount?: number | null;
  finalPrice?: number | null;
  createdAt?: Date | null;

  course?: Course | null;
  payment?: Payment | null;
  voucher_usage_history?: VoucherUsageHistory[] | null;
}
