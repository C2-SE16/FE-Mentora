import React from 'react';
import { Card } from '@/components/ui/card';
import { formatDate } from '@/utils/dateUtils';

interface QuizAttemptCardProps {
  attemptId: string;
  quizTitle: string;
  score: number;
  isPassed: boolean;
  startedAt: string;
  completedAt: string;
  correctAnswers: number;
  totalQuestions: number;
  onViewResults?: () => void;
  onRetry?: () => void;
}

export const QuizAttemptCard: React.FC<QuizAttemptCardProps> = ({
  attemptId,
  quizTitle,
  score,
  isPassed,
  startedAt,
  completedAt,
  correctAnswers,
  totalQuestions,
  onViewResults,
  onRetry,
}) => {
  // Tính toán thời gian làm bài
  const startTime = new Date(startedAt).getTime();
  const endTime = new Date(completedAt).getTime();
  const timeSpentMs = endTime - startTime;

  // Chuyển đổi thời gian sang định dạng phút:giây
  const formatTimeSpent = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <Card className="overflow-hidden">
      <div className="p-4">
        <div className="flex justify-between items-start mb-3">
          <h3 className="font-medium text-gray-900 dark:text-gray-100">{quizTitle}</h3>
          <div className={`px-2 py-1 rounded text-xs font-medium ${isPassed
            ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
            : 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400'
            }`}>
            {isPassed ? 'Đạt' : 'Chưa đạt'}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Điểm số</div>
            <div className="font-semibold text-lg">{score}/100</div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 p-3 rounded">
            <div className="text-gray-500 dark:text-gray-400 text-xs mb-1">Câu trả lời đúng</div>
            <div className="font-semibold text-lg">{correctAnswers}/{totalQuestions}</div>
          </div>
        </div>

        <div className="flex justify-between text-xs text-gray-600 dark:text-gray-400 mb-4">
          <div>
            <span className="font-medium">Thời gian làm bài:</span> {formatTimeSpent(timeSpentMs)}
          </div>
          <div>
            <span className="font-medium">Ngày hoàn thành:</span> {formatDate(completedAt)}
          </div>
        </div>

        <div className="flex justify-between space-x-2">
          {onViewResults && (
            <button
              onClick={onViewResults}
              className="flex-1 text-center px-3 py-2 border border-blue-600 text-blue-600 rounded hover:bg-blue-50 dark:border-blue-500 dark:text-blue-400 dark:hover:bg-blue-900/20 text-sm font-medium transition-colors"
            >
              Xem kết quả
            </button>
          )}
          {onRetry && (
            <button
              onClick={onRetry}
              className="flex-1 text-center px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 dark:bg-blue-600 dark:hover:bg-blue-700 text-sm font-medium transition-colors"
            >
              Làm lại
            </button>
          )}
        </div>
      </div>
    </Card>
  );
};

export default QuizAttemptCard; 