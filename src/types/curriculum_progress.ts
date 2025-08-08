import { Curricula } from '@/types/curricula';
import { User } from '@/types/users';

export interface CurriculumProgress {
  progressId: string | null;
  userId?: string | null;
  curriculumId?: string | null;
  status?: string | null;
  completedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  curricula?: Curricula | null;
  user?: User | null;
}
