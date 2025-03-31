import { Curricula } from '@/types/curricula';

export interface Quiz {
  quizId: string | null;
  curriculumId?: string | null;
  title?: string | null;
  description?: string | null;
  passingScore?: number | null;
  timeLimit?: number | null;
  isFree?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  curricula?: Curricula | null;
}
