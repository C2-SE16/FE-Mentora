import { Curricula } from '@/types/curricula';

export interface Lecture {
  lectureId: string | null;
  curriculumId?: string | null;
  title?: string | null;
  description?: string | null;
  videoUrl?: string | null;
  articleContent?: string | null;
  duration?: number | null;
  isFree?: boolean | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  curricula?: Curricula | null;
}
