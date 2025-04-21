'use client';

import { useEffect, useState } from 'react';
import { cartService } from '@/apis/cartService';
import { Cart } from '@/types/cart';
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

  useEffect(() => {
    // Kiểm tra đăng nhập
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để xem giỏ hàng');
      router.push('/login');
      return;
    }

    fetchCart();
  }, []);

  const fetchCart = async () => {
    try {
      const response = await cartService.getCart();
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

  const handleRemoveItem = async (courseId: string) => {
    try {
      await cartService.removeFromCart(courseId);
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

  const calculateTotal = () => {
    if (!cart?.data?.courses) return 0;
    return cart.data.courses.reduce((total, course) => {
      if (!course.price?.d?.[0]) return total;
      return total + course.price.d[0];
    }, 0);
  };

  const handleApplyCoupon = () => {
    // TODO: Implement coupon logic
    toast('Tính năng đang được phát triển');
  };

  const handleCheckout = () => {
    // TODO: Implement checkout logic
    toast('Tính năng đang được phát triển');
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
          <Button 
            onClick={() => router.push('/')}
            className="mt-4"
          >
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
                />
              ))}
              
              <Button
                variant="ghost"
                onClick={handleClearCart}
                className="mt-4 text-red-500 hover:text-red-700"
              >
                Xóa tất cả
              </Button>
            </div>

            <div className="md:w-1/3">
              <CartSummary
                total={calculateTotal()}
                couponCode={couponCode}
                onCouponChange={setCouponCode}
                onApplyCoupon={handleApplyCoupon}
                onCheckout={handleCheckout}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
} 