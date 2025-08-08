import axiosInstance from '@/lib/api/axios';
import { CourseReview } from '@/types/course_review';

interface ApiResponse<T> {
  data: T;
  statusCode: number;
}
interface ReviewListResponse {
  reviews: CourseReview[];
  ratingCount: { [key: number]: number };
  total: number;
  currentPage: number;
  totalPages: number;
}

/**
 * Service để tương tác với API Reviews
 */
export const ReviewService = {
  async createReview(createReviewDto: Partial<CourseReview>): Promise<CourseReview | null> {
    try {
      const token = localStorage.getItem('accessToken'); // Lấy token từ localStorage
      // const token =
      // 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmIwY2Y1NC0zOGY3LTRiNzgtYjUwMS1lM2QxNzk2MWM2OGUiLCJlbWFpbCI6ImFuaGRhdEBnbWFpbC5jb20iLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc0MzY1Mjg1MywiZXhwIjoxNzQzNzM5MjUzfQ.ICfPI6k7S8FdKz7vDWShmEu044H_BTMsW2O5Mdtpeow';

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
  async updateReview(
    reviewId: string,
    updateReviewDto: Partial<CourseReview>
  ): Promise<CourseReview | null> {
    try {
      const token = localStorage.getItem('accessToken');
      // const token =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmIwY2Y1NC0zOGY3LTRiNzgtYjUwMS1lM2QxNzk2MWM2OGUiLCJlbWFpbCI6ImFuaGRhdEBnbWFpbC5jb20iLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc0MzY1Mjg1MywiZXhwIjoxNzQzNzM5MjUzfQ.ICfPI6k7S8FdKz7vDWShmEu044H_BTMsW2O5Mdtpeow';

      if (!token) {
        console.error('No authentication token found!');
        return null;
      }

      const response = await axiosInstance.put<ApiResponse<CourseReview>>(
        `/reviews/${reviewId}`,
        updateReviewDto,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.statusCode === 200) {
        console.log('Review updated:', response.data.data);
        return response.data.data;
      }

      throw new Error('Failed to update review');
    } catch (error) {
      console.error('Update review error:', error);
      return null;
    }
  },

  async deleteReview(reviewId: string): Promise<boolean> {
    try {
      const token = localStorage.getItem('accessToken');
      // const token =
      //   'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJhMmIwY2Y1NC0zOGY3LTRiNzgtYjUwMS1lM2QxNzk2MWM2OGUiLCJlbWFpbCI6ImFuaGRhdEBnbWFpbC5jb20iLCJyb2xlIjoiU1RVREVOVCIsImlhdCI6MTc0MzY1Mjg1MywiZXhwIjoxNzQzNzM5MjUzfQ.ICfPI6k7S8FdKz7vDWShmEu044H_BTMsW2O5Mdtpeow';

      if (!token) {
        console.error('No authentication token found!');
        return false;
      }

      const response = await axiosInstance.delete<ApiResponse<null>>(`/reviews/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.statusCode === 200) {
        console.log('Review deleted successfully');
        return true;
      }

      throw new Error('Failed to delete review');
    } catch (error) {
      console.error('Delete review error:', error);
      return false;
    }
  },

  async getAllReviewFromCourseId(courseId: string): Promise<ReviewListResponse | null> {
    try {
      const response = await axiosInstance.get<ApiResponse<ReviewListResponse>>(
        `/reviews/course/${courseId}`
      );

      if (response.data && response.data.statusCode === 200) {
        console.log('Review get successfully');
        return response.data.data;
      }

      throw new Error('Failed to get review');
    } catch (error) {
      console.error('Get review error:', error);
      return null;
    }
  },
};

export default ReviewService;
