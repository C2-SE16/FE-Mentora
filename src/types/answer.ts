import { Question } from '@/types/question';

export interface Answer {
  answerId: string | null;
  questionId?: string | null;
  answerText: string | null;
  isCorrect: boolean | null;
  explanation?: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  question?: Question | null;
}
