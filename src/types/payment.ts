import { OrderDetail } from '@/types/order_detail';
import { User } from '@/types/users';

export interface Payment {
  paymentId: string | null;
  userId?: string | null;
  amount?: number | null;
  paymentMethod?: string | null;
  status?: string | null;
  transactionId?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;

  order_details?: OrderDetail | null;
  users?: User | null;
}
