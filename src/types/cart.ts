import { Course } from './courses';

export interface Cart {
  cartId: string;
  userId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  items?: CartItem[];
  user?: any; // Tham chiếu đến User
}

export interface CartItem {
  cartItemId: string;
  courseId: string | null;
  cartId: string | null;
  price: number | null;
  discount: number | null;
  appliedVoucherId: string | null;
  finalPrice: number | null;

  // Relationships
  cart?: Cart;
  course?: Course;
}
