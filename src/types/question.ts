import { Answer } from '@/types/answer';
import { Quiz } from '@/types/quiz';

export interface Question {
  questionId: string | null;
  quizId?: string | null;
  questionText: string | null;
  questionType: string | null;
  orderIndex: number | null;
  points: number | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  quiz?: Quiz | null;
  answers?: Answer[] | null;
}
