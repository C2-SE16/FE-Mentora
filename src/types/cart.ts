import { User } from '@/types/users';
import { CartItem } from '@/types/cart_item';
import { Course } from './courses';

export interface Cart {
  data: {
    courses: Course[];
    totalItems: number;
  };
  statusCode: number;
}
