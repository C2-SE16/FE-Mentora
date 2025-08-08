import React, { useEffect, useRef, useState } from 'react';
import { useVideoProgress } from '@/hooks/useProgress';

interface VideoProgressTrackerProps {
  lectureId: string;
  videoRef: React.RefObject<HTMLVideoElement>;
  onProgressUpdate?: (currentTime: number, duration: number) => void;
  autoSaveInterval?: number; // Thời gian tự động lưu, tính bằng giây
}

export const VideoProgressTracker: React.FC<VideoProgressTrackerProps> = ({
  lectureId,
  videoRef,
  onProgressUpdate,
  autoSaveInterval = 30, // Mặc định lưu mỗi 30 giây
}) => {
  const { updateProgress, isUpdating, lastPosition } = useVideoProgress();
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const lastUpdateRef = useRef<number>(0);

  // Theo dõi trạng thái video và cập nhật tiến trình
  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const handleTimeUpdate = () => {
      if (!videoElement) return;

      const currentTime = Math.floor(videoElement.currentTime);
      const duration = Math.floor(videoElement.duration);

      onProgressUpdate?.(currentTime, duration);

      // Chỉ cập nhật nếu thời gian hiện tại đã thay đổi ít nhất 5 giây so với lần cuối
      if (Math.abs(currentTime - lastUpdateRef.current) >= 5) {
        lastUpdateRef.current = currentTime;

        // Xác định trạng thái dựa trên tiến trình xem
        let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';

        // Nếu đã xem hơn 90% video, đánh dấu là hoàn thành
        if (currentTime >= duration * 0.9) {
          status = 'COMPLETED';
        } else if (currentTime <= 3) {
          status = 'NOT_STARTED';
        }

        // Lưu tiến trình
        updateProgress({
          lectureId,
          currentTime,
          status,
        });
      }
    };

    const handlePlay = () => {
      setIsPlaying(true);
    };

    const handlePause = () => {
      setIsPlaying(false);

      // Khi tạm dừng video, luôn cập nhật tiến trình
      if (videoElement) {
        const currentTime = Math.floor(videoElement.currentTime);
        const duration = Math.floor(videoElement.duration);

        let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';

        if (currentTime >= duration * 0.9) {
          status = 'COMPLETED';
        } else if (currentTime <= 3) {
          status = 'NOT_STARTED';
        }

        updateProgress({
          lectureId,
          currentTime,
          status,
        });
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);

      // Khi video kết thúc, đánh dấu là đã hoàn thành
      if (videoElement) {
        updateProgress({
          lectureId,
          currentTime: Math.floor(videoElement.duration),
          status: 'COMPLETED',
        });
      }
    };

    // Thêm các event listener
    videoElement.addEventListener('timeupdate', handleTimeUpdate);
    videoElement.addEventListener('play', handlePlay);
    videoElement.addEventListener('pause', handlePause);
    videoElement.addEventListener('ended', handleEnded);

    // Thiết lập timer cho việc tự động lưu
    if (autoSaveInterval > 0) {
      timerRef.current = setInterval(() => {
        if (isPlaying && videoElement) {
          const currentTime = Math.floor(videoElement.currentTime);
          const duration = Math.floor(videoElement.duration);

          let status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED' = 'IN_PROGRESS';

          if (currentTime >= duration * 0.9) {
            status = 'COMPLETED';
          } else if (currentTime <= 3) {
            status = 'NOT_STARTED';
          }

          updateProgress({
            lectureId,
            currentTime,
            status,
          });
        }
      }, autoSaveInterval * 1000);
    }

    // Cleanup function
    return () => {
      videoElement.removeEventListener('timeupdate', handleTimeUpdate);
      videoElement.removeEventListener('play', handlePlay);
      videoElement.removeEventListener('pause', handlePause);
      videoElement.removeEventListener('ended', handleEnded);

      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [lectureId, videoRef, updateProgress, onProgressUpdate, autoSaveInterval, isPlaying]);

  // Component này không render bất kỳ thứ gì
  return null;
};

export default VideoProgressTracker; 