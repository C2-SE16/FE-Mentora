import { User } from '@/types/users';
import { Course } from './courses';

export interface Instructor {
  instructorId: string;
  userId: string | null;
  instructorName: string | null;
  bio: string | null;
  profilePicture: string | null;
  experience: string | null;
  average_rating: number | null;
  isVerified: boolean | null;
  createdAt: Date | null;
  updatedAt: Date | null;

  // Relationships
  courses?: Course[] | null;
  user?: User | null;
}
