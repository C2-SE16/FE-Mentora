import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressBarProps {
  progress: number; // 0-100
  showPercentage?: boolean;
  className?: string;
  height?: string;
  color?: 'primary' | 'success' | 'warning' | 'danger';
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  showPercentage = true,
  className = '',
  height = 'h-2',
  color = 'primary',
  animate = true,
}) => {
  const safeProgress = Math.min(Math.max(progress, 0), 100);

  const colorClasses = {
    primary: 'bg-blue-600',
    success: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500'
  };

  return (
    <div className="w-full flex items-center gap-2">
      <div
        className={cn(
          "w-full bg-gray-200 rounded-full overflow-hidden dark:bg-gray-700",
          height,
          className
        )}
      >
        <div
          className={cn(
            colorClasses[color],
            height,
            animate && "transition-all duration-500 ease-in-out",
          )}
          style={{ width: `${safeProgress}%` }}
          role="progressbar"
          aria-valuenow={safeProgress}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
      {showPercentage && (
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300 min-w-[40px]">
          {safeProgress}%
        </span>
      )}
    </div>
  );
};

export default ProgressBar; 