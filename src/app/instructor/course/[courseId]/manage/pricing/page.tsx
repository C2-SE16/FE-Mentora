'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { CourseService } from '@/apis/courseService';
import { PaymentService } from '@/apis/paymentService';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import LoadingSpinner from '@/components/ui/loading-spinner';

export default function CoursePricingPage() {
  const params = useParams();
  const router = useRouter();
  const courseId = params?.courseId as string;
  
  const [price, setPrice] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [course, setCourse] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  const [paypalVerified, setPaypalVerified] = useState<boolean | null>(null);
  
  // Lấy thông tin khóa học và kiểm tra trạng thái xác minh PayPal
  useEffect(() => {
    if (!courseId) return;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy thông tin khóa học
        const courseData = await CourseService.getCourseInDetail(courseId);
        if (courseData) {
          setCourse(courseData);
          if (courseData.price && typeof courseData.price === 'object' && 'd' in courseData.price) {
            setPrice(courseData.price.d?.[0] || 0);
          } else if (typeof courseData.price === 'number') {
            setPrice(courseData.price);
          }
        }
        
        // Kiểm tra trạng thái xác minh PayPal
        const paypalStatus = await PaymentService.getMyPaypalVerificationStatus();
        setPaypalVerified(paypalStatus?.isVerified || false);
      } catch (err: any) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [courseId]);
  
  // Xử lý cập nhật giá
  const handleUpdatePrice = async () => {
    if (!paypalVerified) {
      setError('Bạn cần xác minh tài khoản PayPal trước khi đặt giá cho khóa học');
      return;
    }
    
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      await PaymentService.updateCoursePrice(courseId, price);
      setSuccess('Cập nhật giá khóa học thành công');
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Đã xảy ra lỗi khi cập nhật giá khóa học');
    } finally {
      setSaving(false);
    }
  };
  
  // Chuyển hướng đến trang thiết lập phương thức thanh toán
  const goToPaymentMethods = () => {
    router.push('/profile/payment-methods');
  };
  
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    );
  }
  
  return (
    <div className="container mx-auto py-8 px-4 max-w-5xl">
      <h1 className="text-3xl font-bold mb-6 pb-4 border-b">Đặt giá cho khóa học</h1>
      
      {!paypalVerified && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Chưa xác minh tài khoản PayPal</AlertTitle>
          <AlertDescription>
            Bạn cần xác minh tài khoản PayPal trước khi có thể đặt giá cho khóa học.
            <Button 
              variant="outline" 
              className="mt-2" 
              onClick={goToPaymentMethods}
            >
              Thiết lập phương thức thanh toán
            </Button>
          </AlertDescription>
        </Alert>
      )}
      
      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Lỗi</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}
      
      {success && (
        <Alert variant="success" className="mb-6 border-green-500 text-green-700 bg-green-50">
          <CheckCircle className="h-4 w-4" />
          <AlertTitle>Thành công</AlertTitle>
          <AlertDescription>{success}</AlertDescription>
        </Alert>
      )}
      
      <Card className="p-6 border rounded-lg">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-3">Đặt giá cho khóa học</h2>
          <p className="text-gray-600 mb-4">
            Nếu bạn muốn cung cấp khóa học miễn phí, khóa học phải có tổng thời lượng video dưới 2 giờ 
            và không chứa bài kiểm tra thực hành.
          </p>
          
          <Alert className="mb-5 py-3 bg-blue-50 border-blue-100">
            <Info className="h-5 w-5 text-blue-500" />
            <AlertDescription className="text-blue-700 ml-2">
              Bạn đã tham gia vào Chương trình Deals. Chúng tôi sẽ tối ưu hóa giá niêm yết cho hầu hết các loại tiền tệ và 
              cung cấp khóa học của bạn với mức giảm giá trong các chương trình khuyến mãi.
            </AlertDescription>
          </Alert>
          
          <div className="mb-5">
            <label htmlFor="price" className="block font-medium mb-2">Giá khóa học (VND)</label>
            <div className="flex">
              <Input
                id="price"
                type="number"
                value={price}
                onChange={(e) => setPrice(Number(e.target.value))}
                placeholder="0"
                min={0}
                disabled={!paypalVerified || saving}
                className="w-full md:w-1/2 text-lg p-2 h-12"
              />
            </div>
          </div>
          
          {price === 0 && (
            <Alert className="mb-5 py-3 bg-yellow-50 border-yellow-200">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <AlertDescription className="text-yellow-700 ml-2">
                Khóa học miễn phí phải có tổng thời lượng video dưới 2 giờ và không được chứa bài kiểm tra thực hành.
                Nếu bạn chuyển đổi giữa miễn phí và trả phí quá nhiều lần, các thông báo khuyến mãi của bạn sẽ bị giới hạn.
              </AlertDescription>
            </Alert>
          )}
        </div>
        
        <div className="flex justify-end border-t pt-4">
          <Button 
            onClick={handleUpdatePrice} 
            disabled={!paypalVerified || saving}
            className="min-w-[120px] h-11"
          >
            {saving ? <LoadingSpinner size="sm" /> : 'Lưu'}
          </Button>
        </div>
      </Card>
    </div>
  );
} 