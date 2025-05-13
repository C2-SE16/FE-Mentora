import axiosInstance from '@/lib/api/axios';
import { Cart } from '@/types/cart';
import { CartItem } from '@/types/cart_item';
import { decodeJWT } from '@/utils/jwt';
import { CustomerPaymentService } from './paymentService';

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

    
  // Chọn khóa học để thanh toán
  selectCoursesToCheckout: async (selectedCourseIds: string[]): Promise<any> => {
    const response = await axiosInstance.post(`${CART_ENDPOINT}/select`, {
      selectedCourseIds,
    });
    return response.data;
  },
  
  // Lấy danh sách khóa học đã chọn
  getSelectedCourses: async (): Promise<Cart> => {
    const response = await axiosInstance.get(`${CART_ENDPOINT}/selected`);
    return response.data;
  },
  
  // Xóa danh sách khóa học đã chọn
  clearSelectedCourses: async (): Promise<void> => {
    await axiosInstance.delete(`${CART_ENDPOINT}/selected/clear`);
  },
  
  // Khởi tạo thanh toán
  initPayment: async (payload: {
    returnUrl: string;
    cancelUrl: string;
    selectedCourseIds: string[];
  }): Promise<{
    data: {
      success: boolean;
      paymentId: string;
      approvalUrl: string;
    };
    statusCode: number;
  }> => {
    return CustomerPaymentService.initPayment(payload);
  },
  
  // Xác nhận thanh toán
  confirmPayment: async (token: string): Promise<{
    data: {
      success: boolean;
      paymentId: string;
      details: {
        id: string;
        status: string;
        payer?: {
          email_address?: string;
        };
      };
    };
    statusCode: number;
  }> => {
    return CustomerPaymentService.confirmPayment(token);
  },
  
  // Xác nhận thanh toán từ PayPal
  capturePayment: async (token: string, userId?: string): Promise<any> => {
    return CustomerPaymentService.capturePayment(token, userId);
  },
  
  // Xác nhận thanh toán qua API
  capturePaymentApi: async (token: string, userId?: string): Promise<any> => {
    return CustomerPaymentService.capturePaymentApi(token, userId);
  }
};
