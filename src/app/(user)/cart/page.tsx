'use client';

import { useEffect, useState } from 'react';
import { cartService } from '@/apis/cartService';
import { Cart } from '@/types/cart';
import { Course } from '@/types/courses';
import { toast } from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { CartItem } from '@/components/Cart/CartItem';
import { CartSummary } from '@/components/Cart/CartSummary';
import { useRouter } from 'next/navigation';


export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState(true);
  const [couponCode, setCouponCode] = useState('');
  const [selectedCourses, setSelectedCourses] = useState<string[]>([]);
  const [processingPayment, setProcessingPayment] = useState(false);

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng');
      router.push('/login');
      return;
    }

    fetchCart();
    fetchSelectedCourses();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
      console.log('Cart response:', JSON.stringify(response, null, 2));
      
      // Debug giá của từng khóa học
      if (response?.data?.courses) {
        console.log('Các khóa học trong giỏ hàng:');
        response.data.courses.forEach((course, index) => {
          console.log(`Course ${index+1}: ${course.title}`);
          console.log(`  - Cấu trúc price:`, course.price);
          console.log(`  - Giá hiển thị:`, typeof course.price === 'object' && course.price !== null ? course.price.d?.[0] || 0 : course.price || 0);
        });
      }
      setCart(response);
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Không thể tải giỏ hàng');
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchSelectedCourses = async () => {
    try {
      const response = await cartService.getSelectedCourses();
      const selectedIds = response.data.courses.map(course => course.courseId);
      setSelectedCourses(selectedIds);
    } catch (error: any) {
      console.error('Không thể tải danh sách khóa học đã chọn', error);
      // Không hiển thị lỗi nếu chưa có khóa học nào được chọn
    }
  };

  const handleRemoveItem = async (courseId: string) => {
    try {
      await cartService.removeFromCart(courseId);
      // Cập nhật danh sách đã chọn
      setSelectedCourses(prev => prev.filter(id => id !== courseId));
      await fetchCart();
      toast.success('Đã xóa khóa học khỏi giỏ hàng');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Không thể xóa khóa học');
      }
    }
  };

  const handleClearCart = async () => {
    try {
      await cartService.clearCart();
      setCart(null);
      setSelectedCourses([]);
      toast.success('Đã xóa toàn bộ giỏ hàng');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Không thể xóa giỏ hàng');
      }
    }
  };
  
  const handleSelectCourse = async (courseId: string, isSelected: boolean) => {
    try {
      const newSelectedCourses = isSelected
        ? [...selectedCourses, courseId]
        : selectedCourses.filter(id => id !== courseId);
      
      setSelectedCourses(newSelectedCourses);
      
      // Cập nhật danh sách khóa học đã chọn lên server
      await cartService.selectCoursesToCheckout(newSelectedCourses);
    } catch (error: any) {
      console.error('Không thể chọn khóa học', error);
      toast.error('Không thể cập nhật danh sách khóa học đã chọn');
    }
  };

  const handleSelectAll = async (checked: boolean) => {
    try {
      let newSelectedCourses: string[] = [];
      
      if (checked && cart?.data?.courses) {
        newSelectedCourses = cart.data.courses.map(course => course.courseId);
      }
      
      setSelectedCourses(newSelectedCourses);
      
      // Cập nhật danh sách khóa học đã chọn lên server
      await cartService.selectCoursesToCheckout(newSelectedCourses);
    } catch (error: any) {
      console.error('Không thể chọn tất cả khóa học', error);
      toast.error('Không thể cập nhật danh sách khóa học đã chọn');
    }
  };

  // Hàm lấy giá của một khóa học
  const getCoursePrice = (course: Course): number => {
    console.log('course price', course);
    // Kiểm tra price là chuỗi (ví dụ: "129.99")
    if (typeof course.finalPrice === 'string') {
      return parseFloat(course.finalPrice) || 0;
    }

    // Kiểm tra price là số trực tiếp
    if (typeof course.finalPrice === 'number') {
      return course.finalPrice;
    }
    
    // Kiểm tra cấu trúc price.d là mảng
      if (course.finalPrice && Array.isArray(course.finalPrice) && course.finalPrice > 0) {
      return course.finalPrice[0] || 0;
    }
    
    // Trường hợp price là đối tượng nhưng không có d hoặc d không phải mảng
    if (course.finalPrice && typeof course.finalPrice === 'object') {
      // Thử tìm giá trị trong các trường thông thường
      // @ts-ignore - Bỏ qua kiểm tra type, vì chúng ta đang xử lý các trường hợp đặc biệt
      const possiblePrice = course.finalPrice.price || course.finalPrice.amount || course.finalPrice.value || 0;     
      return possiblePrice;
    }
    
    // Mặc định trả về 0
    return 0;
  };

  const calculateTotal = () => {
    if (!cart?.data?.courses) return 0;
    return cart.data.courses.reduce((total, course) => {
      return total + getCoursePrice(course);
    }, 0);
  };

  const calculateSelectedTotal = () => {
    if (!cart?.data?.courses) return 0;
    return cart.data.courses.reduce((total, course) => {
      if (!selectedCourses.includes(course.courseId)) return total;
      return total + getCoursePrice(course);
    }, 0);
  };

  const handleApplyCoupon = () => {
    // TODO: Implement coupon logic
    toast('Tính năng đang được phát triển');
  };

  const handleCheckout = async () => {
    if (selectedCourses.length === 0) {
      toast.error('Vui lòng chọn ít nhất một khóa học để thanh toán');
      return;
    }

    try {
      setProcessingPayment(true);
      
      // Bắt đầu quá trình thanh toán
      const payload = {
        returnUrl: `${window.location.origin}/payment/success`,
        cancelUrl: `${window.location.origin}/payment/cancel`,
        selectedCourseIds: selectedCourses
      };
      
      toast.loading('Đang kết nối đến cổng thanh toán...');
      
      const response = await cartService.initPayment(payload);
      
      if (response.data && response.data.success && response.data.approvalUrl) {
        toast.dismiss();
        toast.success('Đang chuyển hướng đến trang thanh toán');
        // Chuyển hướng người dùng đến trang thanh toán
        window.location.href = response.data.approvalUrl;
      } else {
        toast.dismiss();
        toast.error('Không thể khởi tạo thanh toán. Vui lòng thử lại sau.');
      }
    } catch (error: any) {
      console.error('Lỗi thanh toán:', error);
      toast.dismiss();
      
      // Hiển thị thông báo lỗi chi tiết hơn
      if (error.code === 'ECONNABORTED') {
        toast.error('Quá thời gian kết nối tới cổng thanh toán. Máy chủ có thể đang bận, vui lòng thử lại sau.');
        
        // Hiển thị thêm hướng dẫn hoặc lựa chọn
        setTimeout(() => {
          if (confirm('Bạn có muốn thử lại việc thanh toán không?')) {
            handleCheckout(); // Thử lại thanh toán
          }
        }, 1500);
      } else if (!error.response) {
        toast.error('Không thể kết nối đến cổng thanh toán. Vui lòng kiểm tra kết nối mạng và thử lại.');
        
        // Kiểm tra kết nối mạng
        if (!navigator.onLine) {
          toast.error('Bạn đang offline. Vui lòng kiểm tra kết nối internet và thử lại.');
        }
      } else if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục thanh toán');
        router.push('/login');
      } else {
        toast.error(`Đã xảy ra lỗi khi xử lý thanh toán: ${error.message || 'Lỗi không xác định'}. Vui lòng thử lại sau.`);
      }
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return <div className="text-center p-4">Đang tải...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Giỏ hàng</h1>

      {!cart?.data?.courses?.length ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Giỏ hàng của bạn đang trống</p>
          <Button onClick={() => router.push('/')} className="mt-4">
            Khám phá khóa học
          </Button>
        </div>
      ) : (
        <>
          <div className="flex flex-col md:flex-row gap-6">
            <div className="md:w-2/3">
              {cart.data.courses.map((course) => (
                <CartItem 
                  key={course.courseId} 
                  course={course} 
                  onRemove={handleRemoveItem}
                  isSelected={selectedCourses.includes(course.courseId)}
                  onSelectChange={handleSelectCourse}
                />
              ))}

              <Button
                variant="outline"
                onClick={handleClearCart}
                className="mt-4"
              >
                Xóa toàn bộ giỏ hàng
              </Button>
            </div>
            <div className="md:w-1/3">
              <CartSummary
                total={calculateTotal()}
                selectedCount={selectedCourses.length}
                totalSelected={calculateSelectedTotal()}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onCheckout={handleCheckout}
                onSelectAll={handleSelectAll}
                allSelected={
                  cart.data.courses.length > 0 && 
                  selectedCourses.length === cart.data.courses.length
                }
                processing={processingPayment}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}
