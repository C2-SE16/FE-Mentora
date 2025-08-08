'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useVideoProgress } from '@/hooks/useProgress';
import { ProgressService } from '@/apis/progressService';
import { useRouter } from 'next/navigation';
import './VideoPlayer.css';

// Định nghĩa kiểu dữ liệu cho tiến trình lưu cục bộ
interface LocalProgress {
  lectureId: string;
  currentTime: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  timestamp: number;
}

interface VideoPlayerProps {
  videoUrl: string;
  lectureId?: string;
  nextLectureId?: string;
  courseId?: string;
  onVideoCompleted?: () => void;
}

const VideoPlayer: React.FC<VideoPlayerProps> = ({ videoUrl, lectureId, nextLectureId, courseId, onVideoCompleted }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const { isLoggedIn } = useAuth();
  const { updateProgress, lastPosition } = useVideoProgress();
  const [progressTrackingId, setProgressTrackingId] = useState<NodeJS.Timeout | null>(null);
  const [showCompletionMessage, setShowCompletionMessage] = useState(false);
  const [isOnline, setIsOnline] = useState<boolean>(true);
  const [hasReachedCompletionThreshold, setHasReachedCompletionThreshold] = useState(false);
  const router = useRouter();

  // Lưu tiến trình học tập vào localStorage
  const saveLocalProgress = (data: Omit<LocalProgress, 'timestamp'>) => {
    if (!lectureId) return;

    try {
      // Lấy mảng tiến trình hiện có hoặc tạo mảng mới
      const localProgressList: LocalProgress[] = JSON.parse(
        localStorage.getItem('videoProgressCache') || '[]'
      );

      // Tìm và cập nhật tiến trình hiện tại hoặc thêm mới
      const existingIndex = localProgressList.findIndex(p => p.lectureId === data.lectureId);
      const newProgress: LocalProgress = {
        ...data,
        timestamp: Date.now()
      };

      if (existingIndex >= 0) {
        localProgressList[existingIndex] = newProgress;
      } else {
        localProgressList.push(newProgress);
      }

      // Lưu lại vào localStorage
      localStorage.setItem('videoProgressCache', JSON.stringify(localProgressList));
    } catch (error) {
      console.error('Lỗi khi lưu tiến trình cục bộ:', error);
    }
  };

  // Đồng bộ tiến trình từ localStorage lên server
  const syncLocalProgress = async () => {
    if (!isLoggedIn) return;

    try {
      const localProgressList: LocalProgress[] = JSON.parse(
        localStorage.getItem('videoProgressCache') || '[]'
      );

      if (localProgressList.length === 0) return;

      // Đồng bộ từng tiến trình lên server
      const syncPromises = localProgressList.map(async (progress) => {
        try {
          await updateProgress({
            lectureId: progress.lectureId,
            currentTime: progress.currentTime,
            status: progress.status
          });
          return progress.lectureId; // Trả về ID đã đồng bộ thành công
        } catch (error) {
          console.error(`Lỗi khi đồng bộ tiến trình cho ${progress.lectureId}:`, error);
          return null; // Trả về null nếu đồng bộ thất bại
        }
      });

      const syncResults = await Promise.allSettled(syncPromises);

      // Lọc ra các ID đã đồng bộ thành công
      const syncedIds = syncResults
        .filter(result => result.status === 'fulfilled' && result.value)
        .map(result => (result as PromiseFulfilledResult<string | null>).value);

      // Xóa các tiến trình đã đồng bộ thành công khỏi localStorage
      const updatedProgressList = localProgressList.filter(
        progress => !syncedIds.includes(progress.lectureId)
      );

      localStorage.setItem('videoProgressCache', JSON.stringify(updatedProgressList));
      console.log(`Đã đồng bộ ${syncedIds.length} tiến trình học tập`);
    } catch (error) {
      console.error('Lỗi khi đồng bộ tiến trình học tập:', error);
    }
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);

      // Kiểm tra nếu đã xem đủ 80% video thì đánh dấu là đã hoàn thành
      if (isLoggedIn && lectureId && video.currentTime / video.duration >= 0.8 && !hasReachedCompletionThreshold) {
        setHasReachedCompletionThreshold(true);

        // Chuẩn bị dữ liệu cập nhật tiến trình với trạng thái COMPLETED
        const progressData = {
          lectureId: lectureId,
          currentTime: video.currentTime,
          status: 'COMPLETED' as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        };

        if (isOnline) {
          updateProgress(progressData).then(() => {
            if (onVideoCompleted) {
              console.log('Đạt ngưỡng 80%, gọi onVideoCompleted');
              onVideoCompleted();

              // Gọi lại sau 1 giây để đảm bảo cập nhật
              setTimeout(() => {
                onVideoCompleted();
              }, 1000);
            }
          });
        } else {
          saveLocalProgress(progressData);
        }
      }
    };

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    const handleEnded = async () => {
      // Đặt trạng thái phát thành false
      setIsPlaying(false);

      // Nếu không có ID bài giảng, không làm gì cả
      if (!lectureId) return;

      try {
        // Chuẩn bị dữ liệu cập nhật tiến trình với trạng thái COMPLETED
        const progressData = {
          lectureId: lectureId,
          currentTime: video.duration,
          status: 'COMPLETED' as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        };

        let response;

        if (isOnline && isLoggedIn) {
          // Khi có kết nối mạng và đã đăng nhập, gửi tiến trình lên server
          response = await updateProgress(progressData);
          console.log('Video đã hoàn thành, cập nhật tiến trình thành công:', response);
        } else {
          // Khi không có kết nối mạng hoặc chưa đăng nhập, lưu vào localStorage
          saveLocalProgress(progressData);
          console.log('Video đã hoàn thành, lưu tiến trình vào bộ nhớ cục bộ');
        }

        // Nếu có callback onVideoCompleted và đã đăng nhập, gọi nó
        if (onVideoCompleted && isLoggedIn) {
          console.log('Gọi onVideoCompleted - cập nhật trạng thái hoàn thành');
          onVideoCompleted();

          // Gọi lại việc cập nhật tiến trình một lần nữa sau một khoảng thời gian ngắn
          // để đảm bảo server đã cập nhật xong trạng thái
          setTimeout(() => {
            console.log('Gọi onVideoCompleted lần 2 (sau 2 giây)');
            onVideoCompleted();

            // Kiểm tra thêm lần nữa sau 5 giây
            setTimeout(() => {
              console.log('Gọi onVideoCompleted lần 3 (sau 5 giây)');
              onVideoCompleted();
            }, 3000);
          }, 2000);
        }

        // Hiển thị thông báo hoàn thành
        setShowCompletionMessage(true);
      } catch (error) {
        console.error('Lỗi khi cập nhật tiến trình video:', error);
      }
    };

    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('ended', handleEnded);
    document.addEventListener('fullscreenchange', handleFullscreenChange);

    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('ended', handleEnded);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isLoggedIn, lectureId, updateProgress, onVideoCompleted, isOnline, saveLocalProgress]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePause);
    video.addEventListener('ended', handleEnded);

    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePause);
      video.removeEventListener('ended', handleEnded);
    };
  }, []);

  useEffect(() => {
    if (!isLoggedIn || !lectureId || !isPlaying) {
      if (progressTrackingId) {
        clearInterval(progressTrackingId);
        setProgressTrackingId(null);
      }
      return;
    }

    const intervalId = setInterval(() => {
      if (videoRef.current) {
        const currentTime = videoRef.current.currentTime;
        const videoDuration = videoRef.current.duration;

        let status = 'IN_PROGRESS';
        if (currentTime >= videoDuration * 0.9) {
          status = 'COMPLETED';
        }

        const progressData = {
          lectureId,
          currentTime,
          status: status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
        };

        if (isOnline && isLoggedIn) {
          // Khi có kết nối mạng, gửi tiến trình lên server
          updateProgress(progressData);
        } else {
          // Khi không có kết nối mạng, lưu vào localStorage
          saveLocalProgress(progressData);
        }
      }
    }, 15000);

    setProgressTrackingId(intervalId);

    return () => {
      clearInterval(intervalId);
    };
  }, [isLoggedIn, lectureId, isPlaying, updateProgress, isOnline]);

  useEffect(() => {
    if (!isLoggedIn || !lectureId || !lastPosition || !videoRef.current) return;

    if (lastPosition > 0 && lastPosition < videoRef.current.duration - 10) {
      videoRef.current.currentTime = lastPosition;
    }
  }, [isLoggedIn, lectureId, lastPosition]);

  useEffect(() => {
    if (!isLoggedIn || !lectureId) return;

    const video = videoRef.current;
    if (!video) return;

    const handlePause = () => {
      if (video.currentTime >= video.duration) return;

      let status = 'IN_PROGRESS';
      if (video.currentTime >= video.duration * 0.9) {
        status = 'COMPLETED';
      }

      const progressData = {
        lectureId,
        currentTime: video.currentTime,
        status: status as 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED'
      };

      if (isOnline && isLoggedIn) {
        // Khi có kết nối mạng, gửi tiến trình lên server
        updateProgress(progressData);
      } else {
        // Khi không có kết nối mạng, lưu vào localStorage
        saveLocalProgress(progressData);
      }
    };

    video.addEventListener('pause', handlePause);

    return () => {
      video.removeEventListener('pause', handlePause);
    };
  }, [isLoggedIn, lectureId, updateProgress, isOnline]);

  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setVolume(value);
    if (videoRef.current) {
      videoRef.current.volume = value;
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setCurrentTime(value);
    if (videoRef.current) {
      videoRef.current.currentTime = value;
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    setPlaybackRate(rate);
    if (videoRef.current) {
      videoRef.current.playbackRate = rate;
    }
  };

  const handleSeekForward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.min(
        videoRef.current.currentTime + 10,
        videoRef.current.duration
      );
    }
  };

  const handleSeekBackward = () => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
    }
  };

  const formatTime = (time: number): string => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;

    try {
      if (!isFullscreen) {
        if (container.requestFullscreen) {
          await container.requestFullscreen();
        } else if ((container as any).webkitRequestFullscreen) {
          await (container as any).webkitRequestFullscreen();
        } else if ((container as any).msRequestFullscreen) {
          await (container as any).msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if ((document as any).webkitExitFullscreen) {
          await (document as any).webkitExitFullscreen();
        } else if ((document as any).msExitFullscreen) {
          await (document as any).msExitFullscreen();
        }
      }
    } catch (error) {
      console.error('Error toggling fullscreen:', error);
    }
  };

  const handleNavigateToNext = () => {
    if (nextLectureId && courseId) {
      router.push(`/courses/${courseId}/curricula/lecture/${nextLectureId}`);
    }
  };

  // Xử lý ẩn thông báo hoàn thành sau một khoảng thời gian
  useEffect(() => {
    if (!showCompletionMessage) return;

    const timeoutId = setTimeout(() => {
      setShowCompletionMessage(false);
    }, 10000);

    return () => clearTimeout(timeoutId);
  }, [showCompletionMessage]);

  // Kiểm tra trạng thái kết nối mạng
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      syncLocalProgress();
    };

    const handleOffline = () => {
      setIsOnline(false);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Kiểm tra trạng thái kết nối hiện tại
    setIsOnline(navigator.onLine);

    // Nếu đang online, thử đồng bộ dữ liệu khi component mount
    if (navigator.onLine) {
      syncLocalProgress();
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [isLoggedIn, updateProgress]);

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-black flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-5xl text-white mb-4">video</h2>
          <h3 className="text-4xl text-white">display</h3>
        </div>
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative aspect-video bg-black group"
      onMouseEnter={() => setShowControls(true)}
      onMouseLeave={() => setShowControls(false)}
    >
      <video ref={videoRef} src={videoUrl} className="w-full h-full" onClick={togglePlay} />

      {/* Hiển thị thông báo khi không có kết nối mạng */}
      {!isOnline && (
        <div className="absolute top-4 left-4 bg-yellow-500 text-white p-2 rounded-lg z-20 flex items-center space-x-2 animate-fade-in">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          <span className="text-sm font-medium">Không có kết nối. Tiến trình đang được lưu cục bộ.</span>
        </div>
      )}

      {/* Hiển thị thông báo hoàn thành video */}
      {showCompletionMessage && nextLectureId && (
        <div className="absolute top-4 right-4 bg-green-600 text-white p-3 rounded-lg shadow-lg z-20 animate-fade-in pulse">
          <div className="flex items-center gap-2 mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            <span className="font-medium">Bạn đã hoàn thành bài học này!</span>
          </div>
          <button
            onClick={handleNavigateToNext}
            className="w-full bg-white text-green-700 px-3 py-1 rounded hover:bg-green-50 transition-colors font-medium text-sm"
          >
            Chuyển đến bài tiếp theo
          </button>
        </div>
      )}

      <div
        className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/90 to-transparent p-4 transition-all duration-300 ${showControls ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'}`}
      >
        <div className="flex items-center mb-3 group/progress relative h-1">
          <div className="absolute left-0 right-0 bottom-0 h-1 bg-gray-600/50 rounded-full">
            <div
              className="absolute left-0 h-full bg-green-500 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            />
            <div
              className="absolute h-full bg-white/30 rounded-full"
              style={{
                width: `${(currentTime / duration) * 100}%`,
                opacity: showControls ? 1 : 0,
                transition: 'opacity 0.2s',
              }}
            />
          </div>
          <input
            type="range"
            min="0"
            max={duration || 100}
            value={currentTime}
            onChange={handleSeek}
            className="absolute w-full h-1.5 appearance-none cursor-pointer opacity-0 group-hover/progress:opacity-100 transition-all duration-200 hover:h-2"
          />
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <button
              onClick={togglePlay}
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              {isPlaying ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M8 5v14l11-7z" />
                </svg>
              )}
            </button>

            <button
              onClick={handleSeekBackward}
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="currentColor"
              >
                <path d="M12 5V1L7 6l5 5V7c3.31 0 6 2.69 6 6s-2.69 6-6 6-6-2.69-6-6H4c0 4.42 3.58 8 8 8s8-3.58 8-8z" />
              </svg>
            </button>

            <button
              onClick={handleSeekForward}
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24"
                viewBox="0 0 24 24"
                width="24"
                fill="currentColor"
              >
                <path d="M12 5V1l5 5-5 5V7c-3.31 0-6 2.69-6 6s2.69 6 6 6 6-2.69 6-6h2c0 4.42-3.58 8-8 8s-8-3.58-8-8 3.58-8 8-8z" />
              </svg>
            </button>

            <div className="flex items-center space-x-5 group/volume">
              <button className="text-white hover:text-white/80 transition-colors duration-200">
                {volume === 0 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    fill="currentColor"
                  >
                    <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                  </svg>
                ) : volume < 0.5 ? (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    fill="currentColor"
                  >
                    <path d="M18.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM5 9v6h4l5 5V4L9 9H5z" />
                  </svg>
                ) : (
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24"
                    viewBox="0 0 24 24"
                    width="24"
                    fill="currentColor"
                  >
                    <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                  </svg>
                )}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                className="w-0 group-hover/volume:w-20 h-1 bg-gray-600/50 rounded-full appearance-none cursor-pointer transition-all duration-200 hover:h-1.5 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:hover:scale-110 [&::-webkit-slider-thumb]:transition-transform"
              />
            </div>

            <span className="text-white text-sm font-medium min-w-[85px]">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>

            <div className="relative group/playback">
              <button className="text-white hover:text-white/80 transition-colors duration-200">
                {playbackRate}x
              </button>
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 bg-black/90 rounded-lg p-2 opacity-0 invisible group-hover/playback:opacity-100 group-hover/playback:visible transition-all duration-200 delay-100">
                {[0.25, 0.5, 1, 1.5, 2].map((rate) => (
                  <button
                    key={rate}
                    onClick={() => handlePlaybackRateChange(rate)}
                    className={`block w-full text-left px-4 py-1 text-sm text-white hover:bg-white/10 rounded ${playbackRate === rate ? 'bg-white/20' : ''
                      }`}
                  >
                    {rate}x
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-6">
            <button
              onClick={toggleFullscreen}
              className="text-white hover:text-white/80 transition-colors duration-200"
            >
              {isFullscreen ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
                </svg>
              ) : (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24"
                  viewBox="0 0 24 24"
                  width="24"
                  fill="currentColor"
                >
                  <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
