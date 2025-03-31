import { PaymentEnum } from '@/types/enum';
import { User } from '@/types/users';
import { OrderDetail } from '@/types/order_detail';

export interface Payment {
  paymentId: string | null;
  userId: string | null;
  amount: number | null;
  paymentMethod: string | null;
  status: PaymentEnum | null;
  transactionId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  orderDetails?: OrderDetail[] | null;
  user?: User | null; // Tham chiếu đến User
}
