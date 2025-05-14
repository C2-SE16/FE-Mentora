import axiosInstance from '@/lib/api/axios';

export interface CourseAccessResponse {
  hasAccess: boolean;
  isEnrolled: boolean;
  isInstructor: boolean;
  message: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

// Kiểm tra môi trường thực thi
const isClient = typeof window !== 'undefined';

/**
 * Tạo mock data cho kiểm tra quyền truy cập trong môi trường development
 * @param courseId ID của khóa học
 * @returns Dữ liệu mô phỏng quyền truy cập
 */
const createMockAccessData = (courseId: string): ApiResponse<CourseAccessResponse> => {
  // Ví dụ: courseId chứa 'instructor' sẽ trả về quyền instructor
  const isInstructor = courseId.includes('instructor');
  // Ví dụ: courseId chứa 'enrolled' sẽ trả về quyền enrolled
  const isEnrolled = courseId.includes('enrolled');
  
  console.log('[courseAccessService] Tạo mock data cho courseId:', courseId, { isInstructor, isEnrolled });
  
  return {
    success: true,
    data: {
      hasAccess: isInstructor || isEnrolled,
      isEnrolled: isEnrolled,
      isInstructor: isInstructor,
      message: isInstructor 
        ? 'Bạn là instructor của khóa học này' 
        : isEnrolled 
          ? 'Bạn đã mua khóa học này' 
          : 'Bạn chưa mua khóa học này'
    }
  };
};

/**
 * Kiểm tra quyền truy cập của người dùng đối với một khóa học
 * @param courseId ID của khóa học cần kiểm tra
 * @returns Thông tin về quyền truy cập của người dùng đối với khóa học
 */
export const checkCourseAccess = async (
  courseId: string
): Promise<ApiResponse<CourseAccessResponse>> => {
  console.log('[courseAccessService] Bắt đầu kiểm tra quyền truy cập cho khóa học:', courseId);
  
  try {
    // Kiểm tra xem code có đang chạy ở phía client hay không
    if (!isClient) {
      console.log('[courseAccessService] API chỉ có thể gọi từ phía client');
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'API chỉ có thể gọi từ phía client'
        }
      };
    }

    // Debug: Kiểm tra token trước khi gọi API
    const accessToken = localStorage.getItem('accessToken');
    const token = localStorage.getItem('token');
    
    console.log('[courseAccessService] Token check:', { 
      accessTokenExists: !!accessToken, 
      tokenExists: !!token
    });
    
    if (!accessToken && !token) {
      console.log('[courseAccessService] Không tìm thấy token, xem như không có quyền truy cập');
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'Bạn cần đăng nhập để kiểm tra quyền truy cập khóa học'
        }
      };
    }

    // axiosInstance đã có interceptor để tự động thêm token vào header
    console.log('[courseAccessService] Gọi API kiểm tra quyền truy cập với courseId:', courseId);
    
    // URL API đúng theo format từ backend
    const endpoint = `/course-access/${courseId}`;
    console.log('[courseAccessService] Endpoint:', endpoint);
    
    try {
      const response = await axiosInstance.get(endpoint);
      console.log('[courseAccessService] API response:', response);
      
      // Xử lý cấu trúc dữ liệu response theo format của API
      // Format API: { data: { success: boolean, data: { ... } }, statusCode: number }
      if (response && response.data) {
        if (response.data.data) {
          // Cấu trúc API có nested data
          console.log('[courseAccessService] Phân tích response thành công');
          return response.data.data;
        } else if (response.data.success !== undefined) {
          // Cấu trúc API không có nested data
          console.log('[courseAccessService] Phân tích response thành công (format phẳng)');
          return response.data;
        }
      }
      
      // Nếu không đúng cấu trúc, trả về lỗi
      console.error('[courseAccessService] Cấu trúc dữ liệu API không đúng:', response.data);
      return {
        success: false,
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: 'Cấu trúc dữ liệu API không đúng'
        }
      };
    } catch (error: any) {
      // Đây là lỗi khi gọi API - check xem có phải lỗi token không
      if (error.response?.status === 401) {
        console.error('[courseAccessService] Lỗi xác thực token:', error.response?.data);
        
        // Có thể đăng nhập lại hoặc refresh token ở đây
        return {
          success: false,
          data: {
            hasAccess: false,
            isEnrolled: false,
            isInstructor: false,
            message: 'Token hết hạn hoặc không hợp lệ. Vui lòng đăng nhập lại.'
          }
        };
      }
      
      console.error('[courseAccessService] Lỗi khi gọi API:', error);
      throw error; // Ném lỗi để xử lý ở try-catch bên ngoài
    }
    
  } catch (error: any) {
    console.error('[courseAccessService] Lỗi tổng thể khi kiểm tra quyền truy cập khóa học:', error);
    
    // Nếu có response từ server
    if (error.response && error.response.data) {
      console.error('[courseAccessService] Lỗi API:', error.response.data);
      
      // Kiểm tra lỗi 401 - Unauthorized
      if (error.response.status === 401) {
        console.log('[courseAccessService] Lỗi xác thực, có thể token đã hết hạn');
        // Thêm logic refresh token hoặc đăng nhập lại nếu cần
      }
      
      return {
        success: false,
        message: error.response.data.message || 'Lỗi từ server',
        data: {
          hasAccess: false,
          isEnrolled: false,
          isInstructor: false,
          message: error.response.data.message || 'Đã xảy ra lỗi khi kiểm tra quyền truy cập'
        }
      };
    }
    
    // Lỗi chung không liên quan đến API response
    return {
      success: false,
      message: error.message || 'Đã xảy ra lỗi khi kiểm tra quyền truy cập',
      data: {
        hasAccess: false,
        isEnrolled: false,
        isInstructor: false,
        message: 'Đã xảy ra lỗi khi kiểm tra quyền truy cập'
      }
    };
  }
};

/**
 * Kiểm tra một chuỗi không rỗng và không phải undefined
 * @param value Chuỗi cần kiểm tra
 * @returns Chuỗi đã kiểm tra hoặc chuỗi trống
 */
export const ensureString = (value: string | undefined): string => {
  return value || '';
};