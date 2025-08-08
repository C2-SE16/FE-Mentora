import axiosInstance from '@/lib/api/axios';
import { Lecture } from '@/types/lecture';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

export const LectureService = {
  /**
   * Lấy thông tin lecture theo ID
   */
  async getLectureById(lectureId: string): Promise<Lecture> {
    try {
      const response = await axiosInstance.get<ApiResponse<Lecture>>(`/lectures/${lectureId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy thông tin lecture ID ${lectureId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi lấy thông tin lecture ID ${lectureId}:`, error);

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
   * Cập nhật thông tin lecture
   */
  async updateLecture(
    lectureId: string,
    data: {
      title?: string;
      description?: string;
      videoUrl?: string;
      articleContent?: string;
      duration?: number;
      isFree?: boolean;
    }
  ): Promise<Lecture> {
    try {
      const response = await axiosInstance.put<ApiResponse<Lecture>>(
        `/lectures/${lectureId}`,
        data
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || `Lỗi khi cập nhật lecture ID ${lectureId}`);
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật lecture ID ${lectureId}:`, error);

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
   * Cập nhật mô tả của lecture
   */
  async updateLectureDescription(lectureId: string, description: string): Promise<Lecture> {
    try {
      const response = await axiosInstance.put<ApiResponse<Lecture>>(`/lectures/${lectureId}`, {
        description,
      });

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi cập nhật mô tả lecture ID ${lectureId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật mô tả lecture ID ${lectureId}:`, error);

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
   * Cập nhật đầy đủ thông tin lecture
   */
  async updateFullLecture(
    lectureId: string,
    lectureData: {
      title: string;
      description: string;
      videoUrl: string;
      articleContent: string;
      duration: number;
      isFree: boolean;
    }
  ): Promise<Lecture> {
    try {
      const response = await axiosInstance.put<ApiResponse<Lecture>>(
        `/lectures/${lectureId}`,
        lectureData
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message ||
          `Lỗi khi cập nhật thông tin đầy đủ cho lecture ID ${lectureId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật thông tin đầy đủ cho lecture ID ${lectureId}:`, error);

      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },
};

export default LectureService;
