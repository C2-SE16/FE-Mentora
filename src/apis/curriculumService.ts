import axiosInstance from '@/lib/api/axios';
import { Curriculum, CurriculumType } from '@/types/courses';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

/**
 * Service để tương tác với API curricula
 */
export const CurriculumService = {
  /**
   * Tạo curriculum mới
   */
  async createCurriculum(data: {
    title: string;
    moduleId: string;
    type: CurriculumType;
    orderIndex: number;
    description?: string;
  }): Promise<Curriculum> {
    try {
      const response = await axiosInstance.post<ApiResponse<Curriculum>>('/curricula', data);

      if (response.data && response.data.statusCode === 201 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || 'Lỗi khi tạo curriculum');
    } catch (error: any) {
      console.error('Lỗi khi tạo curriculum:', error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        if (error.response.data && error.response.data.message) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message;
          throw new Error(`Lỗi: ${errorMessage}`);
        }

        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Lấy thông tin curriculum theo ID
   */
  async getCurriculumById(curriculumId: string): Promise<Curriculum> {
    try {
      const response = await axiosInstance.get<ApiResponse<Curriculum>>(
        `/curricula/${curriculumId}`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy thông tin curriculum ID ${curriculumId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi lấy thông tin curriculum ID ${curriculumId}:`, error);

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
   * Lấy danh sách curriculum theo module
   */
  async getCurriculaByModuleId(moduleId: string): Promise<Curriculum[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Curriculum[]>>(
        `/curricula/module/${moduleId}`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        // Dữ liệu trả về đã bao gồm thông tin về lectures và quizzes
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy danh sách curriculum cho module ID ${moduleId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi lấy danh sách curriculum cho module ID ${moduleId}:`, error);

      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }

      return []; // Trả về mảng rỗng trong trường hợp lỗi
    }
  },

  /**
   * Cập nhật thông tin curriculum
   */
  async updateCurriculum(
    curriculumId: string,
    data: {
      title?: string;
      type?: CurriculumType;
      orderIndex?: number;
      description?: string;
    }
  ): Promise<Curriculum> {
    try {
      const response = await axiosInstance.put<ApiResponse<Curriculum>>(
        `/curricula/${curriculumId}`,
        data
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi cập nhật curriculum ID ${curriculumId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật curriculum ID ${curriculumId}:`, error);

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        if (error.response.data && error.response.data.message) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message;
          throw new Error(`Lỗi: ${errorMessage}`);
        }

        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },

  /**
   * Xóa curriculum
   */
  async deleteCurriculum(curriculumId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(`/curricula/${curriculumId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return true;
      }

      throw new Error(response.data.data.message || `Lỗi khi xóa curriculum ID ${curriculumId}`);
    } catch (error: any) {
      console.error(`Lỗi khi xóa curriculum ID ${curriculumId}:`, error);

      if (error.response) {
        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }

    return false;
  },

  /**
   * Sắp xếp lại thứ tự các curriculum
   */
  async reorderCurricula(moduleId: string, curriculumIds: string[]): Promise<Curriculum[]> {
    try {
      const response = await axiosInstance.post<ApiResponse<Curriculum[]>>('/curricula/reorder', {
        moduleId,
        curriculumIds,
      });

      // Kiểm tra nếu API trả về thành công, bất kể có data.success hay không
      if (response.data && response.data.statusCode === 200) {
        // Nếu có data.data, trả về nó
        if (response.data.data && response.data.data.data) {
          return response.data.data.data;
        }

        // Nếu không có data.data, trả về mảng rỗng
        console.log('API trả về thành công nhưng không có dữ liệu:', response.data);
        return [];
      }

      // Nếu không thành công, ném lỗi
      throw new Error(
        response.data && response.data.data && response.data.data.message
          ? response.data.data.message
          : 'Lỗi khi sắp xếp lại thứ tự các curriculum'
      );
    } catch (error: any) {
      // Nếu lỗi có chứa từ "thành công", không ném lỗi mà trả về mảng rỗng
      if (error.message && error.message.includes('thành công')) {
        console.log('Phát hiện thông báo thành công trong lỗi:', error.message);
        return [];
      }

      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);

        if (error.response.data && error.response.data.message) {
          const errorMessage = Array.isArray(error.response.data.message)
            ? error.response.data.message.join(', ')
            : error.response.data.message;
          throw new Error(`Lỗi: ${errorMessage}`);
        }

        throw new Error(`Lỗi server: ${error.response.status}`);
      } else if (error.request) {
        throw new Error('Không nhận được phản hồi từ server');
      } else {
        throw error;
      }
    }
  },
};

export default CurriculumService;
