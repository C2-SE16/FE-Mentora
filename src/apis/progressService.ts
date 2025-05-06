import axiosInstance from '@/lib/api/axios';
import { CourseReview } from '@/types/course_review';

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
};

export default ProgressService;
