import { OrderDetail } from '@/types/order_detail';
import { User } from '@/types/users';
import { Voucher } from '@/types/vouchers';

export interface VoucherUsageHistory {
  usageId: string | null;
  voucherId?: string | null;
  userId?: string | null;
  orderId?: string | null;
  usedAt?: Date | null;
  discountAmount?: number | null;
  orderDetail?: OrderDetail | null;
  user?: User | null;
  voucher?: Voucher | null;
}
