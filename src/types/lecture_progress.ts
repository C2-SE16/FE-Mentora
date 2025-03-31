import { Lecture } from '@/types/lecture';
import { User } from '@/types/users';

export interface LectureProgress {
  progressId: string | null;
  userId?: string | null;
  lectureId?: string | null;
  status?: string | null;
  lastPosition?: number | null;
  completedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  lecture?: Lecture | null;
  user?: User | null;
}
