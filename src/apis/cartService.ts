import axiosInstance from '@/lib/api/axios';
import { Cart } from '@/types/cart';
import { CartItem } from '@/types/cart_item';
import { decodeJWT } from '@/utils/jwt';

const CART_ENDPOINT = '/cart';

export const cartService = {
  // Lấy thông tin giỏ hàng
  getCart: async (): Promise<Cart> => {
    const response = await axiosInstance.get(CART_ENDPOINT);
    return response.data;
  },

  // Thêm khóa học vào giỏ hàng
  addToCart: async (courseId: string): Promise<CartItem> => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      throw new Error('No access token found');
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token');
    }

    const response = await axiosInstance.post(`${CART_ENDPOINT}/add`, {
      courseId: courseId,
      userId: decodedToken.sub,
    });
    return response.data;
  },

  // Xóa khóa học khỏi giỏ hàng
  removeFromCart: async (courseId: string): Promise<void> => {
    await axiosInstance.delete(`${CART_ENDPOINT}/remove`, {
      data: { courseId },
    });
  },

  // Xóa toàn bộ giỏ hàng
  clearCart: async (): Promise<void> => {
    await axiosInstance.delete(`${CART_ENDPOINT}/clear`);
  },
};
