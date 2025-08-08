import { User } from '@/types/users';
import { Course } from './courses';

export interface Favorite {
  favoriteId: string;
  userId: string | null;
  courseId: string | null;

  // Relationships
  course?: Course | null;
  user?: User | null;
}
