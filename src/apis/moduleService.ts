import axiosInstance from '@/lib/api/axios';
import { Module } from '@/types/courses';

interface ApiResponse<T> {
  data: {
    success: boolean;
    data: T;
    message: string;
  };
  statusCode: number;
}

/**
 * Service để tương tác với API modules
 */
export const ModuleService = {
  /**
   * Tạo module mới
   */
  async createModule(moduleData: {
    title: string;
    courseId: string;
    orderIndex?: number;
    description?: string;
  }): Promise<Module> {
    try {
      const response = await axiosInstance.post<ApiResponse<Module>>('/modules', moduleData);

      if (response.data && response.data.statusCode === 201 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || 'Lỗi khi tạo module');
    } catch (error: any) {
      console.error('Lỗi khi tạo module:', error);

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
   * Lấy thông tin module theo ID
   */
  async getModuleById(moduleId: string): Promise<Module> {
    try {
      const response = await axiosInstance.get<ApiResponse<Module>>(`/modules/${moduleId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || `Lỗi khi lấy thông tin module ID ${moduleId}`);
    } catch (error: any) {
      console.error(`Lỗi khi lấy thông tin module ID ${moduleId}:`, error);

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
   * Lấy danh sách module theo khóa học
   */
  async getModulesByCourse(courseId: string): Promise<Module[]> {
    try {
      const response = await axiosInstance.get<ApiResponse<Module[]>>(
        `/modules/course/${courseId}`
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(
        response.data.data.message || `Lỗi khi lấy danh sách module cho khóa học ID ${courseId}`
      );
    } catch (error: any) {
      console.error(`Lỗi khi lấy danh sách module cho khóa học ID ${courseId}:`, error);

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
   * Cập nhật thông tin module
   */
  async updateModule(
    moduleId: string,
    moduleData: {
      title?: string;
      description?: string;
      orderIndex?: number;
    }
  ): Promise<Module> {
    try {
      const response = await axiosInstance.put<ApiResponse<Module>>(
        `/modules/${moduleId}`,
        moduleData
      );

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return response.data.data.data;
      }

      throw new Error(response.data.data.message || `Lỗi khi cập nhật module ID ${moduleId}`);
    } catch (error: any) {
      console.error(`Lỗi khi cập nhật module ID ${moduleId}:`, error);

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
   * Xóa module
   */
  async deleteModule(moduleId: string): Promise<boolean> {
    try {
      const response = await axiosInstance.delete<ApiResponse<any>>(`/modules/${moduleId}`);

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return true;
      }

      throw new Error(response.data.data.message || `Lỗi khi xóa module ID ${moduleId}`);
    } catch (error: any) {
      console.error(`Lỗi khi xóa module ID ${moduleId}:`, error);

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
   * Sắp xếp lại thứ tự các module
   */
  async reorderModules(courseId: string, moduleIds: string[]): Promise<boolean> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/modules/reorder', {
        courseId,
        moduleIds,
      });

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return true;
      }

      if (response.data && response.data.data.message && !response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      return true;
    } catch (error: any) {
      console.error('Lỗi khi sắp xếp lại thứ tự các module:', error);

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
   * Sắp xếp lại thứ tự các bài học trong module
   */
  async reorderLessons(moduleId: string, lessonIds: string[]): Promise<boolean> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/modules/lessons/reorder', {
        moduleId,
        lessonIds,
      });

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return true;
      }

      if (response.data && response.data.data.message && !response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      return true;
    } catch (error: any) {
      console.error('Lỗi khi sắp xếp lại thứ tự các bài học:', error);

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
   * Di chuyển bài học giữa các module
   */
  async moveLessonBetweenModules(
    lessonId: string,
    sourceModuleId: string,
    destinationModuleId: string,
    newIndex: number
  ): Promise<boolean> {
    try {
      const response = await axiosInstance.post<ApiResponse<any>>('/modules/lessons/move', {
        lessonId,
        sourceModuleId,
        destinationModuleId,
        newIndex,
      });

      if (response.data && response.data.statusCode === 200 && response.data.data.success) {
        return true;
      }

      if (response.data && response.data.data.message && !response.data.data.success) {
        throw new Error(response.data.data.message);
      }

      return true;
    } catch (error: any) {
      console.error('Lỗi khi di chuyển bài học giữa các module:', error);

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

export default ModuleService;
