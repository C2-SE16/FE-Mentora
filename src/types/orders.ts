import { Course } from './courses';
import { VoucherUsageHistory } from './vouchers';

export enum PaymentStatus {
  COMPLETED = 'COMPLETED',
  PENDING = 'PENDING',
  FAILED = 'FAILED'
}

export interface Payment {
  paymentId: string;
  userId: string | null;
  amount: number | null;
  paymentMethod: string | null;
  status: PaymentStatus | null;
  transactionId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;
  
  // Relationships
  orderDetails?: OrderDetail[];
  user?: any; // Tham chiếu đến User
}

export interface OrderDetail {
  orderDetailId: string;
  paymentId: string | null;
  courseId: string | null;
  price: number | null;
  discount: number | null;
  finalPrice: number | null;
  createdAt: Date | null;
  
  // Relationships
  course?: Course;
  payment?: Payment;
  voucherUsageHistory?: VoucherUsageHistory[];
} 