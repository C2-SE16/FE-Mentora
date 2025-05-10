'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import toast from 'react-hot-toast';

export default function PaymentCancelPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { isLoggedIn, isLoading: authLoading } = useAuth();

  useEffect(() => {
    if (!searchParams) return;

    // Log thông tin cho mục đích debug
    console.log('Cancel URL params:', {
      token: searchParams.get('token'),
      all: Object.fromEntries([...searchParams.entries()])
    });

    // Kiểm tra đăng nhập
    if (!authLoading && !isLoggedIn) {
      toast.error('Vui lòng đăng nhập để tiếp tục');
      router.push('/login');
    }
  }, [searchParams, isLoggedIn, authLoading, router]);

  if (authLoading) {
    return (
      <div className="container py-12">
        <Card className="p-8 max-w-3xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <Loader2 className="h-16 w-16 text-primary animate-spin" />
          </div>
          <h2 className="text-2xl font-bold mb-3">Đang kiểm tra thông tin</h2>
          <p className="text-gray-600 mb-6">Vui lòng đợi trong giây lát...</p>
        </Card>
      </div>
    );
  }

  return (
    <div className="container py-12">
      <Card className="p-8 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <XCircle className="h-16 w-16 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold mb-3 text-red-600">Thanh toán đã bị hủy</h2>
        <p className="text-gray-600 mb-6">
          Bạn đã hủy quá trình thanh toán. Các khóa học vẫn được lưu trong giỏ hàng của bạn.
        </p>
        <div className="flex justify-center gap-4">
          <Button onClick={() => router.push('/cart')}>Quay lại giỏ hàng</Button>
          <Button variant="outline" onClick={() => router.push('/')}>Trang chủ</Button>
        </div>
      </Card>
    </div>
  );
} 