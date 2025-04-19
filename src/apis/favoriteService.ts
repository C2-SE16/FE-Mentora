import axiosInstance from '@/lib/api/axios';
import { Course } from '@/types/courses';

export const FavoriteService = {
  async addFavorite(data: { userId: string; courseId: string }): Promise<string | null> {
    try {
      const response = await axiosInstance.post('/favorites', {
        userId: data.userId,
        courseId: data.courseId,
      });

      if (response.data?.statusCode === 201) {
        return response.data.data?.message || 'Thêm vào danh sách yêu thích thành công';
      }

      throw new Error(
        response.data?.data?.message || 'Lỗi khi thêm khóa học vào danh sách yêu thích'
      );
    } catch (error: any) {
      console.error('Lỗi khi add favorite list:', error.message || error);
      return null;
    }
  },
  async getFavorites(userId: string): Promise<Course[] | null> {
    try {
      const response = await axiosInstance.get(`/favorites/${userId}`);
      console.log(response);
      if (response.data?.statusCode === 200) {
        return response.data.data.favoriteCourses;
      }

      throw new Error('Lỗi khi lấy danh sách yêu thích');
    } catch (error: any) {
      console.error('Lỗi khi get favorite list:', error.message || error);
      return null;
    }
  },
};
