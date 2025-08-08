'use client';
import { useState, useRef } from 'react';
import { Lecture } from '@/types/courses';
import VideoService from '@/apis/videoService';
import LectureService from '@/apis/lectureService';
import { toast } from 'react-hot-toast';

interface LectureContentUploaderProps {
  lecture: Lecture;
  courseId: string;
  onClose: () => void;
  onSuccess: () => void;
}

export default function LectureContentUploader({
  lecture,
  courseId,
  onClose,
  onSuccess,
}: LectureContentUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');
  const [videoUrl, setVideoUrl] = useState<string | null>(lecture.videoUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Xử lý khi chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Lấy file đầu tiên từ input
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      setMessage('');
    }
  };

  // Upload video bài giảng
  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn file video');
      return;
    }

    setIsUploading(true);
    setMessage('');

    try {
      // Sử dụng service để upload video
      const videoPath = await VideoService.uploadLectureVideo(
        selectedFile,
        courseId,
        lecture.lectureId,
        (progress) => setUploadProgress(progress)
      );

      // Cập nhật videoUrl cho lecture
      await LectureService.updateLecture(lecture.lectureId, {
        videoUrl: videoPath,
        // Tính toán thời lượng video (giả định 5 phút cho mỗi MB)
        duration: Math.round((selectedFile.size / (1024 * 1024)) * 5 * 60),
      });

      setVideoUrl(videoPath);
      setMessage('Video đã được tải lên thành công!');
      toast.success('Video đã được tải lên thành công!');
      onSuccess(); // Gọi callback để cập nhật UI
    } catch (error: any) {
      setMessage(`Tải lên thất bại: ${error.message}`);
      toast.error(`Tải lên thất bại: ${error.message}`);
    } finally {
      setIsUploading(false);
    }
  };

  // Xử lý khi nhấn nút chọn file
  const handleSelectFileClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        <h2 className="text-xl font-bold mb-4">Tải lên video bài giảng</h2>
        <p className="text-gray-600 mb-6">
          Tải lên video cho bài giảng "{lecture.title}". Video sẽ được lưu trữ và phát trực tuyến
          cho học viên.
        </p>

        <div className="space-y-6">
          {/* Hiển thị video hiện tại nếu có */}
          {videoUrl && !isUploading && (
            <div className="mb-4">
              <h3 className="text-sm font-medium mb-2">Video hiện tại:</h3>
              <video
                controls
                className="w-full h-auto rounded border border-gray-200"
                src={videoUrl}
              >
                Trình duyệt của bạn không hỗ trợ thẻ video.
              </video>
            </div>
          )}

          {/* Input chọn file ẩn */}
          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="hidden"
          />

          {/* UI chọn file */}
          <div
            onClick={handleSelectFileClick}
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer hover:bg-gray-50 ${
              isUploading ? 'opacity-50 pointer-events-none' : ''
            }`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
              />
            </svg>
            <p className="mt-2 text-sm text-gray-600">
              Nhấp để chọn video hoặc kéo và thả file vào đây
            </p>
            <p className="mt-1 text-xs text-gray-500">MP4, MOV, AVI, MKV (tối đa 2GB)</p>
          </div>

          {/* Hiển thị file đã chọn */}
          {selectedFile && (
            <div className="text-sm bg-blue-50 p-3 rounded">
              <p className="font-medium">File đã chọn:</p>
              <p className="text-gray-600 truncate">{selectedFile.name}</p>
              <p className="text-gray-500">{(selectedFile.size / (1024 * 1024)).toFixed(2)} MB</p>
            </div>
          )}

          {/* Thanh tiến trình */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex justify-between text-sm mb-1">
                <span>Đang tải lên...</span>
                <span>{Math.round(uploadProgress)}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Thông báo */}
          {message && (
            <div
              className={`p-3 rounded text-sm ${
                message.includes('thất bại')
                  ? 'bg-red-50 text-red-700'
                  : 'bg-green-50 text-green-700'
              }`}
            >
              {message}
            </div>
          )}

          {/* Nút tải lên */}
          <div className="flex justify-end space-x-3 mt-6">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
              disabled={isUploading}
            >
              Hủy
            </button>
            <button
              onClick={handleUpload}
              disabled={!selectedFile || isUploading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 ${
                !selectedFile || isUploading ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              {isUploading ? 'Đang tải lên...' : 'Tải lên video'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
