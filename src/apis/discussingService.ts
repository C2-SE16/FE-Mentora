import axiosInstance from '@/lib/api/axios';
import { CourseReview } from '@/types/course_review';

export interface Discussing {
  discussingId: string;
  userId?: string;
  curriculumId: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  user: {
    fullName: string;
    avatar: string;
  };
}

export interface CreateDiscussingDto {
  title: string;
  content: string;
  curriculumId: string;
}

export interface UpdateDiscussingDto {
  title: string;
  content: string;
}

export interface DiscussingResponse {
  data: {
    statusCode: number;
    message: string;
    data: Discussing[];
  };
  statusCode: number;
}

export const DiscussingService = {
  async createDiscussing(dto: CreateDiscussingDto): Promise<Discussing | null> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No authentication token found!');
        return null;
      }

      const response = await axiosInstance.post<{ data: Discussing }>('/discussing', dto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data.data;
    } catch (error) {
      console.error('Create discussing error:', error);
      return null;
    }
  },

  async getAllByCurriculumId(curriculumId: string): Promise<DiscussingResponse> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No authentication token found!');
        return {
          data: {
            statusCode: 401,
            message: 'Unauthorized',
            data: [],
          },
          statusCode: 401,
        };
      }

      const response = await axiosInstance.get<DiscussingResponse>(
        `/discussing/curriculum/${curriculumId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return response.data;
    } catch (error) {
      console.error('Get discussions error:', error);
      return {
        data: {
          statusCode: 500,
          message: 'Internal server error',
          data: [],
        },
        statusCode: 500,
      };
    }
  },

  async deleteDiscussing(discussingId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No authentication token found!');
        return false;
      }

      await axiosInstance.delete(`/discussing/${discussingId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error('Delete discussing error:', error);
      return false;
    }
  },

  async updateDiscussing(discussingId: string, dto: UpdateDiscussingDto): Promise<boolean> {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        console.error('No authentication token found!');
        return false;
      }

      await axiosInstance.put(`/discussing/${discussingId}`, dto, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return true;
    } catch (error) {
      console.error('Update discussing error:', error);
      return false;
    }
  },
};

export default DiscussingService;
