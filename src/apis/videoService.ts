import api from './api';

interface UploadChunkResponse {
  message: string;
  fileName: string;
}

interface MergeChunksResponse {
  success: boolean;
  message: string;
  filePath: string;
  courseId?: string;
  lectureId?: string;
}

/**
 * Service để xử lý việc upload video
 */
export const VideoService = {
  /**
   * Upload một chunk video thông thường
   */
  async uploadChunk(
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number,
    fileName: string
  ): Promise<UploadChunkResponse> {
    try {
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', fileName);

      const response = await api.post('/upload/chunk', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi upload chunk:', error);

      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Yêu cầu server ghép các chunks thành file hoàn chỉnh
   */
  async mergeChunks(fileName: string, totalChunks: number): Promise<MergeChunksResponse> {
    try {
      const response = await api.post('/upload/merge', {
        fileName,
        totalChunks,
      });

      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi ghép file video:', error);

      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Upload một chunk video bài giảng
   */
  async uploadLectureVideoChunk(
    chunk: Blob,
    chunkIndex: number,
    totalChunks: number,
    fileName: string,
    courseId: string,
    lectureId: string
  ): Promise<UploadChunkResponse> {
    try {
      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', chunkIndex.toString());
      formData.append('totalChunks', totalChunks.toString());
      formData.append('fileName', fileName);
      formData.append('courseId', courseId);
      formData.append('lectureId', lectureId);

      console.log('Gửi request tải lên chunk với tên file:', fileName);
      const response = await api.post('/upload/lecture-video', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response từ server khi tải lên chunk:', response.data);

      return response.data;
    } catch (error: any) {
      console.error('Lỗi khi tải lên phần video bài giảng:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Yêu cầu server ghép các chunks thành video bài giảng hoàn chỉnh
   */
  async mergeLectureVideoChunks(
    fileName: string,
    totalChunks: number,
    courseId: string,
    lectureId: string
  ): Promise<MergeChunksResponse> {
    try {
      console.log('Gửi request ghép chunks với tên file:', fileName);
      const response = await api.post('/upload/merge-lecture-video', {
        fileName,
        totalChunks,
        courseId,
        lectureId,
      });

      // Log đầy đủ response để debug
      console.log('Response đầy đủ từ server:', response);

      // Kiểm tra cấu trúc response
      const responseData = response.data?.data || response.data;
      console.log('Dữ liệu từ response:', responseData);

      // Đảm bảo response có cấu trúc đúng
      return {
        success: true,
        message: responseData?.message || 'Video bài giảng đã được tải lên thành công!',
        filePath: responseData?.filePath,
        courseId: responseData?.courseId,
        lectureId: responseData?.lectureId,
      };
    } catch (error: any) {
      console.error('Lỗi khi ghép file video bài giảng:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Tải lên video bài giảng hoàn chỉnh (xử lý cả quá trình chia nhỏ và ghép file)
   */
  async uploadLectureVideo(
    file: File,
    courseId: string,
    lectureId: string,
    onProgressUpdate?: (progress: number) => void
  ): Promise<string> {
    try {
      const chunkSize = 5 * 1024 * 1024; // 5MB mỗi chunk
      const totalChunks = Math.ceil(file.size / chunkSize);

      // Tạo tên file an toàn (thêm timestamp để tránh trùng lặp)
      const timestamp = new Date().getTime();
      const fileExtension = file.name.split('.').pop() || '';
      let safeFileName = `${file.name.split('.')[0].replace(/[^a-zA-Z0-9]/g, '_')}_${timestamp}.${fileExtension}`;

      // Upload từng chunk
      for (let i = 0; i < totalChunks; i++) {
        const start = i * chunkSize;
        const end = Math.min(file.size, start + chunkSize);
        const chunk = file.slice(start, end);

        const response = await this.uploadLectureVideoChunk(
          chunk,
          i,
          totalChunks,
          safeFileName,
          courseId,
          lectureId
        );

        // Cập nhật tên file từ response của server (chỉ cần lấy từ chunk đầu tiên)
        if (i === 0 && response.fileName) {
          safeFileName = response.fileName;
          console.log('Đã cập nhật tên file từ server:', safeFileName);
        }

        // Cập nhật tiến trình nếu có callback
        if (onProgressUpdate) {
          onProgressUpdate(((i + 1) / totalChunks) * 100);
        }
      }

      // Ghép các chunks
      const mergeResponse = await this.mergeLectureVideoChunks(
        safeFileName,
        totalChunks,
        courseId,
        lectureId
      );

      console.log('Merge response in uploadLectureVideo:', mergeResponse);

      if (!mergeResponse.filePath) {
        // Tạo đường dẫn mặc định nếu server không trả về
        console.warn('Server không trả về đường dẫn file, sử dụng đường dẫn mặc định');
        return `/uploads/videos/${courseId}/${lectureId}.mp4`;
      }

      return mergeResponse.filePath;
    } catch (error) {
      console.error('Lỗi trong quá trình tải lên video bài giảng:', error);
      throw error;
    }
  },
};

export default VideoService;
