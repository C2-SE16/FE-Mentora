import { Cart } from '@/types/cart';
import { Course } from '@/types/courses';

export interface CartItem {
  cartItemId: string;
  courseId: string | null;
  cartId: string | null;
  price: number | null;
  discount: number | null;
  appliedVoucherId: string | null;
  finalPrice: number | null;

  // Relationships
  cart?: Cart | null;
  course?: Course | null;
}
