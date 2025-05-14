'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { cartService } from '@/apis/cartService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';
import { decodeJWT } from '@/utils/jwt';

export default function PaymentSuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { isLoggedIn, isLoading: authLoading } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentDetails, setPaymentDetails] = useState<any>(null);

  useEffect(() => {
    // Kiểm tra đăng nhập trước
    if (authLoading) return; // Đợi kiểm tra xác thực hoàn tất
    
    if (!isLoggedIn) {
      setError('Vui lòng đăng nhập để xác nhận thanh toán');
      setLoading(false);
      return;
    }

    if (!searchParams) return;

    const token = searchParams.get('token');
    
    // Debug: Hiển thị tất cả params
    console.log('Payment Success URL params:', {
      token,
      all: Object.fromEntries([...searchParams.entries()])
    });
    
    if (!token) {
      setError('Không tìm thấy thông tin thanh toán');
      setLoading(false);
      return;
    }

    const capturePayment = async () => {
      try {
        console.log('Đang xác nhận thanh toán với token:', token);
        
        // Lấy userId từ token đăng nhập
        const accessToken = localStorage.getItem('accessToken');
        if (!accessToken) {
          setError('Không tìm thấy thông tin đăng nhập');
          return;
        }
        
        const decodedToken = decodeJWT(accessToken);
        if (!decodedToken || !decodedToken.sub) {
          setError('Thông tin đăng nhập không hợp lệ');
          return;
        }
        
        const userId = decodedToken.sub;
        console.log('userId từ token:', userId);
        
        // Gọi API xác nhận thanh toán với token và userId
        const response = await cartService.capturePayment(token, userId);
        
        console.log('Response từ API:', response);
        
        // Xử lý cấu trúc response linh hoạt bằng cách cast
        const responseData = response as unknown as any;
        
        console.log('Kiểm tra cấu trúc response:', {
          hasData: Boolean(responseData.data),
          hasSuccess: Boolean(responseData.data?.success || responseData.success),
          hasDetails: Boolean(responseData.data?.details || responseData.details)
        });
        
        // Kiểm tra cả hai cấu trúc response có thể xảy ra
        if ((responseData.data && responseData.data.success) || 
            (responseData.success && responseData.details)) {
          
          // Lấy details từ cấu trúc thích hợp
          const details = responseData.data?.details || responseData.details;
          setPaymentDetails(details);
          toast.success('Thanh toán đã được xác nhận thành công!');
          
          // Tự động chuyển hướng đến trang khóa học sau 5 giây
          setTimeout(() => {
            router.push('/');
          }, 5000);
        } else {
          console.error('Lỗi response:', responseData);
          setError('Không thể xác nhận thanh toán');
        }
      } catch (error) {
        console.error('Lỗi khi xác nhận thanh toán:', error);
        setError('Đã xảy ra lỗi khi xác nhận thanh toán');
        toast.error('Đã xảy ra lỗi khi xác nhận thanh toán. Vui lòng liên hệ hỗ trợ.');
      } finally {
        setLoading(false);
      }
    };

    capturePayment();
  }, [searchParams, isLoggedIn, authLoading]);

  // Hiển thị trạng thái đang kiểm tra xác thực
  if (authLoading) {
    return (
      <div className="container py-12">
        <Card className="p-8 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Đang kiểm tra thông tin xác thực</h2>
          <p className="text-gray-600 mb-6">Vui lòng đợi trong giây lát...</p>
        </Card>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container py-12">
        <Card className="p-8 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Đang xác nhận thanh toán</h2>
          <p className="text-gray-600 mb-6">
            Vui lòng đợi trong khi chúng tôi đang xác nhận thanh toán của bạn...
          </p>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-12">
        <Card className="p-8 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold mb-3 text-red-500">Thanh toán không thành công</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <div className="flex justify-center gap-4">
            <Button onClick={() => router.push('/cart')}>Quay lại giỏ hàng</Button>
            <Button variant="outline" onClick={() => router.push('/')}>Trang chủ</Button>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="p-8 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle className="h-16 w-16 text-green-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-green-600">Thanh toán thành công!</h2>
        
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <p className="text-gray-600 mb-2">Mã giao dịch: <span className="font-medium">{paymentDetails?.id}</span></p>
          <p className="text-gray-600 mb-2">Trạng thái: <span className="font-medium">{paymentDetails?.status}</span></p>
          {paymentDetails?.payer?.email_address && (
            <p className="text-gray-600 mb-2">Email: <span className="font-medium">{paymentDetails.payer.email_address}</span></p>
          )}
        </div>
        
        <p className="text-gray-600 mb-6">
          Cảm ơn bạn đã thanh toán. Các khóa học đã được thêm vào tài khoản của bạn.
          <br />Bạn sẽ được chuyển hướng đến trang khóa học trong 5 giây.
        </p>
        
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/')}>Học ngay</Button>
          <Button variant="outline" onClick={() => router.push('/profile/my-courses')}>Khóa học của tôi</Button>
        </div>
      </Card>
    </div>
  );
} 