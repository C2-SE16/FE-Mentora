export const formatDuration = (minutes: number): string => {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;
  return `${hours}h${remainingMinutes > 0 ? `${remainingMinutes}ph` : ''}`;
};

/**
 * Định dạng thời lượng sang định dạng phút:giây
 * @param seconds Thời lượng tính bằng giây
 * @returns Chuỗi định dạng "phút:giây"
 */
export const formatDurationToMinutesSeconds = (seconds?: number | null): string => {
  if (seconds === undefined || seconds === null) return '0:00';

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};
