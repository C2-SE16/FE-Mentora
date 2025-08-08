import axiosInstance from '@/lib/api/axios';
import { CourseReview } from '@/types/course_review';
import { CurriculumProgress } from '@/types/curriculum_progress';
import { LectureProgress } from '@/types/lecture_progress';

export interface CreateCurriculumProgressDto {
  curriculumId: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  userId: string;
}

export interface CreateLectureProgressDto {
  lectureId: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  lastPosition?: number;
  userId: string;
}

export interface UpdateCurriculumProgressDto {
  progressId: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  completedAt?: string;
}

export interface UpdateLectureProgressDto {
  progressId: string;
  status?: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
  lastPosition?: number;
  completedAt?: string;
}

export interface UpdateVideoProgressDto {
  lectureId: string;
  currentTime: number;
  status: 'NOT_STARTED' | 'IN_PROGRESS' | 'COMPLETED';
}

export interface ProgressCheckResponse {
  canProceed: boolean;
  message: string;
  progress: {
    progressId: string;
    status: string;
    lastPosition?: number;
  };
  completionRatio: number;
  requiredDuration?: number;
  currentDuration?: number;
}

export interface CurriculumAccessCheckDto {
  currentCurriculumId: string;
  nextCurriculumId: string;
}

/**
 * Service để tương tác với API Progress
 */
export const ProgressService = {
  async createCurriculumProgress(body: CreateCurriculumProgressDto) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.post('/progress/curriculum', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response: ' + response);
    return response.data;
  },

  async createLectureProgress(body: CreateLectureProgressDto) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.post('/progress/lecture', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log('response: ' + response);
    return response.data;
  },

  async updateCurriculumProgress(body: UpdateCurriculumProgressDto) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.put('/progress/curriculum', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async updateLectureProgress(body: UpdateLectureProgressDto) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.put('/progress/lecture', body, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async getUserProgress() {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.get('/progress/user', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  // Thêm các API mới

  async updateVideoProgress(data: UpdateVideoProgressDto) {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      return null;
    }
    const response = await axiosInstance.post('/lecture-videos/update-progress', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async checkLectureCompletion(lectureId: string): Promise<ProgressCheckResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      throw new Error('Không tìm thấy token xác thực');
    }

    try {
      const response = await axiosInstance.get(`/progress/lecture-completion/${lectureId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log('Raw API response from lecture-completion:', response.data);

      // Kiểm tra và đảm bảo dữ liệu trả về đúng cấu trúc
      if (response.data && response.data.data) {
        // Ghi log chi tiết dữ liệu
        console.log('Dữ liệu giá trị canProceed từ API:', response.data.data.canProceed);
        console.log('Phân tích dữ liệu API nhận được:', {
          canProceed: response.data.data.canProceed,
          completionRatio: response.data.data.completionRatio,
          message: response.data.data.message,
          status: response.data.data.progress?.status
        });

        return response.data.data;
      } else {
        console.error('Dữ liệu không hợp lệ từ API:', response.data);
        throw new Error('Dữ liệu không hợp lệ từ API');
      }
    } catch (error) {
      console.error('Error in checkLectureCompletion:', error);
      throw error;
    }
  },

  async checkCurriculumCompletion(curriculumId: string): Promise<ProgressCheckResponse> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      throw new Error('Không tìm thấy token xác thực');
    }
    const response = await axiosInstance.get(`/curriculum-progress/${curriculumId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async checkCanProceed(currentLectureId: string, nextLectureId: string): Promise<{ canProceed: boolean; message: string; currentProgress?: ProgressCheckResponse }> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      throw new Error('Không tìm thấy token xác thực');
    }
    const response = await axiosInstance.get(`/progress/can-proceed/${currentLectureId}/${nextLectureId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  },

  async checkCurriculumAccess(data: CurriculumAccessCheckDto): Promise<{ canProceed: boolean; message: string; currentProgress?: ProgressCheckResponse }> {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      console.error('No authentication token found!');
      throw new Error('Không tìm thấy token xác thực');
    }
    const response = await axiosInstance.post('/curriculum-progress/check-access', data, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  }
};

export default ProgressService;
