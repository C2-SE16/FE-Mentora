import { QuizAttempt } from '@/types/quiz_attempt';

export interface QuizAnswer {
  userAnswerId: string | null;
  attemptId?: string | null;
  questionId?: string | null;
  answerId?: string | null;
  isCorrect: boolean | null;
  createdAt?: Date | null;
  quizAttempt?: QuizAttempt | null;
}
