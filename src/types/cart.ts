import { User } from '@/types/users';
import { CartItem } from '@/types/cart_item';

export interface Cart {
  cartId: string;
  userId: string | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  items?: CartItem[] | null;
  user?: User | null;
}
