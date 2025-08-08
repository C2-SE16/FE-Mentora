import axiosInstance from '@/lib/api/axios';

/**
 * Interface cho thông tin tài khoản PayPal
 */
interface PaypalAccount {
  instructorId: string;
  paypalEmail: string;
  isVerified: boolean;
}

/**
 * Interface cho trạng thái xác thực PayPal
 */
interface PaypalVerificationStatus {
  instructorId: string;
  instructorName: string;
  paypalEmail: string;
  isVerified: boolean;
  hasPendingVerification: boolean;
  tokenExpired: boolean;
}

/**
 * Interface cho thông tin instructor
 */
interface InstructorInfo {
  userId: string;
  role: string;
  isInstructorInDatabase: boolean;
  instructorId: string;
}

/**
 * Interface cho thông tin tính toán thanh toán
 */
interface PayoutInfo {
  instructorId: string;
  instructorName: string;
  totalRevenue: number;
  platformFee: number;
  payoutAmount: number;
  currency: string;
  paymentsPending: number;
  lastPayout: string;
}

/**
 * Interface cho response API
 */
interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  data?: T;
}

/**
 * Interface cho response cập nhật giá khóa học
 */
interface UpdateCoursePriceResponse {
  courseId: string;
  title: string;
  price: number;
}

/**
 * Interface cho request khởi tạo thanh toán
 */
interface InitPaymentRequest {
  returnUrl: string;
  cancelUrl: string;
  selectedCourseIds: string[];
}

/**
 * Interface cho response khởi tạo thanh toán
 */
interface InitPaymentResponse {
  data: {
    success: boolean;
    paymentId: string;
    approvalUrl: string;
  };
  statusCode: number;
}

/**
 * Interface cho response xác nhận thanh toán
 */
interface CapturePaymentResponse {
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
}

/**
 * Service xử lý các API liên quan đến thanh toán
 */
export const PaymentService = {
  /**
   * Đăng ký tài khoản PayPal cho instructor
   * @param instructorId ID của instructor
   * @param paypalEmail Email PayPal
   */
  async registerPaypal(instructorId: string, paypalEmail: string): Promise<PaypalAccount> {
    try {
      const response = await axiosInstance.post(`/payment/instructor/${instructorId}/paypal`, {
        paypalEmail,
      });
      console.log('Register PayPal response:', response.data);
      // Kiểm tra cấu trúc dữ liệu
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi đăng ký tài khoản PayPal:', error);
      throw error;
    }
  },

  /**
   * Xác thực tài khoản PayPal qua token
   * @param token Token xác thực
   */
  async verifyPaypal(token: string): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.get(`/payment/verify-paypal?token=${token}`);
      console.log('Verify PayPal response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác thực tài khoản PayPal:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin tài khoản PayPal của instructor
   * @param instructorId ID của instructor
   */
  async getInstructorPaypal(instructorId: string): Promise<PaypalAccount> {
    try {
      const response = await axiosInstance.get(`/payment/instructor/${instructorId}/paypal`);
      console.log('Get Instructor PayPal response:', response.data);
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin tài khoản PayPal:', error);
      throw error;
    }
  },

  /**
   * Kiểm tra trạng thái xác thực tài khoản PayPal của instructor hiện tại
   */
  async getMyPaypalVerificationStatus(): Promise<PaypalVerificationStatus> {
    try {
      const response = await axiosInstance.get('/payment/my-paypal-verification-status');
      console.log('Get PayPal status response:', response.data);
      
      // Kiểm tra và trích xuất dữ liệu từ cấu trúc lồng nhau
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      } else if (response.data && response.data.data) {
        return response.data.data;
      }
      
      throw new Error('Cấu trúc dữ liệu không hợp lệ');
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái xác thực PayPal:', error);
      throw error;
    }
  },

  /**
   * Gửi lại email xác nhận tài khoản PayPal
   */
  async resendPaypalVerification(): Promise<ApiResponse<any>> {
    try {
      const response = await axiosInstance.post('/payment/my-resend-paypal-verification');
      console.log('Resend PayPal verification response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi gửi lại email xác nhận PayPal:', error);
      throw error;
    }
  },

  /**
   * Lấy thông tin instructor của người dùng hiện tại
   */
  async getMyInstructorInfo(): Promise<InstructorInfo> {
    try {
      const response = await axiosInstance.get('/payment/my-instructor-info');
      console.log('Get instructor info response:', response.data);
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi lấy thông tin instructor:', error);
      throw error;
    }
  },

  /**
   * Tính toán số tiền thanh toán cho instructor
   * @param instructorId ID của instructor
   */
  async getInstructorPayout(instructorId: string): Promise<PayoutInfo> {
    try {
      const response = await axiosInstance.get(`/payment/instructor/${instructorId}/payout`);
      console.log('Get instructor payout response:', response.data);
      if (response.data && response.data.data && response.data.data.data) {
        return response.data.data.data;
      }
      return response.data.data;
    } catch (error) {
      console.error('Lỗi khi tính toán số tiền thanh toán:', error);
      throw error;
    }
  },

  /**
   * Cập nhật giá cho khóa học
   * @param courseId ID của khóa học
   * @param price Giá mới của khóa học
   */
  async updateCoursePrice(courseId: string, price: number): Promise<UpdateCoursePriceResponse> {
    try {
      const response = await axiosInstance.post('/payment/course/update-price', {
        courseId,
        price
      });
      console.log('Update course price response:', response.data);
      
      if (response.data && response.data.data) {
        return response.data.data;
      }
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi cập nhật giá khóa học:', error);
      throw error;
    }
  },
};

/**
 * Service xử lý các API liên quan đến thanh toán của khách hàng
 */
export const CustomerPaymentService = {
  /**
   * Khởi tạo thanh toán bằng PayPal
   * @param payload Thông tin khởi tạo thanh toán
   */
  async initPayment(payload: InitPaymentRequest): Promise<InitPaymentResponse> {
    const maxRetries = 3;
    let retries = 0;
    
    while (retries <= maxRetries) {
      try {
        console.log(`Đang khởi tạo thanh toán, lần thử ${retries + 1}/${maxRetries + 1}`);
        const response = await axiosInstance.post('/customer-payment/init', payload);
        console.log('Init payment response:', response.data);
        return response.data;
      } catch (error: any) {
        console.error(`Lỗi khi khởi tạo thanh toán (lần ${retries + 1}):`, error);
        
        // Nếu lỗi timeout hoặc network và chưa thử lại hết số lần
        if ((error.code === 'ECONNABORTED' || !error.response) && retries < maxRetries) {
          retries++;
          console.log(`Thử lại khởi tạo thanh toán, lần ${retries + 1}...`);
          
          // Tăng thời gian đợi theo cấp số nhân (2 giây, 4 giây, 8 giây)
          const delayTime = 2000 * Math.pow(2, retries - 1);
          await new Promise(resolve => setTimeout(resolve, delayTime));
          continue;
        }
        
        // Ghi log chi tiết về lỗi
        if (error.response) {
          console.error('Chi tiết lỗi response:', error.response.data);
        } else if (error.request) {
          console.error('Không nhận được phản hồi từ server');
        }
        
        throw error;
      }
    }
    
    throw new Error('Vượt quá số lần thử lại khởi tạo thanh toán');
  },

  /**
   * Xác nhận thanh toán từ PayPal
   * @param token Token thanh toán
   * @param userId ID người dùng (optional)
   */
  async capturePayment(token: string, userId?: string): Promise<any> {
    try {
      const url = userId 
        ? `/customer-payment/capture?token=${token}&userId=${userId}`
        : `/customer-payment/capture?token=${token}`;
      
      console.log('Calling capturePayment API with URL:', url);
      const response = await axiosInstance.get(url);
      console.log('Capture payment full response:', response);
      console.log('Capture payment response.data:', response.data);
      
      // Kiểm tra cấu trúc dữ liệu để debug
      if (response.data) {
        console.log('Response data properties:', Object.keys(response.data));
        console.log('Response data success:', response.data.success);
        console.log('Response data paymentId:', response.data.paymentId);
        console.log('Response data details:', response.data.details);
      }
      
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán:', error);
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán từ phía client
   * @param token Token thanh toán
   */
  async confirmPayment(token: string): Promise<any> {
    try {
      const response = await axiosInstance.post('/customer-payment/confirm', { token });
      console.log('Confirm payment response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán từ client:', error);
      throw error;
    }
  },

  /**
   * Xác nhận thanh toán qua API
   * @param token Token thanh toán
   * @param userId ID người dùng (optional)
   */
  async capturePaymentApi(token: string, userId?: string): Promise<any> {
    try {
      const url = userId 
        ? `/customer-payment/capture-api?token=${token}&userId=${userId}`
        : `/customer-payment/capture-api?token=${token}`;
      
      const response = await axiosInstance.get(url);
      console.log('Capture payment API response:', response.data);
      return response.data;
    } catch (error) {
      console.error('Lỗi khi xác nhận thanh toán qua API:', error);
      throw error;
    }
  },
}; 