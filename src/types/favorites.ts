import { Course } from './courses';

export interface Favorite {
  favoriteId: string;
  userId: string | null;
  courseId: string | null;
  
  // Relationships
  course?: Course;
  user?: any; // Tham chiếu đến User
} 