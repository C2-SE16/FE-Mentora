import { CurriculumProgress } from '@/types/curriculum_progress';
import { CurriculumEnum } from '@/types/enum';
import { Lecture } from '@/types/lecture';
import { Module } from '@/types/module';
import { Quiz } from '@/types/quiz';

export interface Curricula {
  curriculumId: string | null;
  moduleId?: string | null;
  title?: string | null;
  orderIndex: number | null;
  type: CurriculumEnum | null;
  description?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  module?: Module;
  lectures?: Lecture[];
  quizzes?: Quiz[];
  curriculumProgress?: CurriculumProgress[];
}
