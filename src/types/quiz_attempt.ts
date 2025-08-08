import { Quiz } from '@/types/quiz';
import { QuizAnswer } from '@/types/quiz_answer';
import { User } from '@/types/users';

export interface QuizAttempt {
  attemptId: string | null;
  userId?: string | null;
  quizId?: string | null;
  score: number | null;
  isPassed: boolean | null;
  startedAt: Date | null;
  completedAt?: Date | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
  quiz?: Quiz | null;
  user?: User | null;
  quizAnswers?: QuizAnswer[] | null;
}
