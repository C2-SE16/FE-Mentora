import { VoucherScopeEnum } from '@/types/enum';
import { VoucherCourse } from '@/types/voucher_courses';
import { VoucherUsageHistory } from '@/types/voucher_usage_history';

export interface Voucher {
  voucherId: string;
  code: string | null;
  description: string | null;
  scope: VoucherScopeEnum | null;
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
  voucherCourses?: VoucherCourse[] | null;
  usageHistory?: VoucherUsageHistory[] | null;
}
