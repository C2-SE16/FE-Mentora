import axiosInstance from '@/lib/api/axios';
import { CourseReview } from '@/types/course_review';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
}

/**
 * Service để tương tác với API Reviews
 */
export const ReviewService = {
  async createReview(createReviewDto: Partial<CourseReview>): Promise<CourseReview | null> {
    try {
      //   const token = localStorage.getItem('token'); // Lấy token từ localStorage
      const token =
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmIwY2Y1NC0zOGY3LTRiNzgtYjUwMS1lM2QxNzk2MWM2OGUiLCJlbWFpbCI6ImFuaGRhdEBnbWFpbC5jb20iLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc0MzUxOTQ5MywiZXhwIjoxNzQzNjA1ODkzfQ.mxNfYDGm4TfTUty1PzHGb1CWWT8fjkf2ScYXcB9LPHw';
      if (!token) {
        console.error('No authentication token found!');
        return null;
      }

      const response = await axiosInstance.post<ApiResponse<CourseReview>>(
        `/reviews`,
        createReviewDto,
        {
          headers: {
            Authorization: `Bearer ${token}`, // Truyền token vào headers
          },
        }
      );

      if (response.data && response.data.statusCode === 201) {
        console.log('Review created:', response.data.data);
        return response.data.data;
      }

      throw new Error('Failed to create review');
    } catch (error) {
      console.error('Create review error:', error);
      return null;
    }
  },
};

export default ReviewService;
