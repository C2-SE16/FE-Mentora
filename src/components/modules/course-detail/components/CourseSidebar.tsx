'use client';

import { FavoriteService } from '@/apis/favoriteService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LearningObjective } from '@/types/learning-object';
import { Heart } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { cartService } from '@/apis/cartService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '@/utils/jwt';
import Image from 'next/image';
import { checkCourseAccess, CourseAccessResponse, ensureString } from '@/apis/courseAccessService';
import type { Cart as CartType } from '@/types/cart';
import type { Course } from '@/types/courses';

const contents = [
  '  37 hours on-demand video',
  '8 articles',
  '3 downloadable resources',
  'Access on mobile and TV',
  'Full lifetime access',
  'Certificate of completion',
];

interface CourseSidebarProps {
  course?: Course;
  courseId: string;
  learningObject?: LearningObjective[];
  image: string;
  price?: number;
  originalPrice?: number;
  hasDiscount?: boolean;
  durationTime?: number;
  title?: string;
  modules?: any[];
  lectures?: number;
  articles?: number;
  downloadableResources?: number;
}

interface CartItem {
  courseId: string;
  // thêm các trường khác nếu cần
}

interface Cart {
  items: CartItem[];
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({
  course,
  courseId,
  image,
  price = 419000,
  originalPrice,
  hasDiscount = false,
}) => {
  const router = useRouter();
  const [courseAccess, setCourseAccess] = useState<CourseAccessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState(false);
  const [showCouponInput, setShowCouponInput] = useState(false);
  const [couponCode, setCouponCode] = useState('');
  const [isFavorite, setIsFavorite] = useState(false);

  // Calculate course content stats
  // const courseIncludes = [
  //   { icon: <Play className="w-4 h-4" />, text: `${durationTime} giờ video theo yêu cầu` },
  //   { icon: <FileText className="w-4 h-4" />, text: `${articles} bài viết` },
  //   {
  //     icon: <Download className="w-4 h-4" />,
  //     text: `${downloadableResources} tài nguyên có thể tải xuống`,
  //   },
  //   { icon: <Smartphone className="w-4 h-4" />, text: 'Truy cập trên thiết bị di động và TV' },
  //   { icon: <Clock className="w-4 h-4" />, text: 'Quyền truy cập đầy đủ suốt đời' },
  //   { icon: <Award className="w-4 h-4" />, text: 'Giấy chứng nhận hoàn thành' },
  // ];

  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();


    const fetchInitialData = async () => {
      if (!courseId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        // Kiểm tra quyền truy cập
        const accessResult = await checkCourseAccess(courseId);
        if (accessResult.success && isMounted) {
          setCourseAccess(accessResult.data);
        }

        // Kiểm tra xem khóa học có trong giỏ hàng không
        const cartResponse = await cartService.getCart();
        if (isMounted && cartResponse?.data?.courses) {
          setIsInCart(cartResponse.data.courses.some((course) => course.courseId === courseId));
        }
      } catch (error) {
        if (isMounted) {
          setError('Đã xảy ra lỗi khi kiểm tra thông tin khóa học');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchInitialData();

    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [courseId]);

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng');
        router.push('/login');
        return;
      }

      if (courseAccess?.isInstructor) {
        router.push(`/instructor/course/${courseId}/manage/goals`);
        return;
      }

      if (courseAccess?.isEnrolled) {
        router.push(`/courses/${courseId}`);
        return;
      }

      if (isInCart) {
        router.push('/cart');
        return;
      }

      if (courseAccess?.isInstructor) {
        router.push(`/instructor/course/${courseId}/manage/goals`);
        return;
      }

      if (courseAccess?.isEnrolled) {
        router.push(`/courses/${courseId}`);
        return;
      }

      if (isInCart) {
        router.push('/cart');
        return;
      }

      await cartService.addToCart(courseId);
      setIsInCart(true);
      setIsInCart(true);
      toast.success('Đã thêm khóa học vào giỏ hàng thành công!');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Khóa học đã tồn tại trong giỏ hàng.');
      }
    }
  };

  const handleAddFavorite = async () => {
    const token = localStorage.getItem('accessToken');
    if (!token) {
      toast.error('Vui lòng đăng nhập để thêm khóa học vào danh sách yêu thích');
      router.push('/login');
      return;
    }

    const decodedToken = decodeJWT(token);
    if (!decodedToken || !decodedToken.sub) {
      throw new Error('Invalid token');
    }

    try {
      const message = await FavoriteService.addFavorite({
        userId: decodedToken.sub,
        courseId: courseId,
      });
      if (message) {
        setIsFavorite(!isFavorite);
        toast.success(message);
      } else {
        toast.error('Thêm vào danh sách yêu thích thất bại!');
      }
    } catch (error) {
      toast.error('Thêm vào danh sách yêu thích thất bại!');
    }
  };

  const handleBuyNow = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để mua khóa học');
        router.push('/login');
        return;
      }

      if (courseAccess?.isInstructor) {
        router.push(`/instructor/course/${courseId}/manage/goals`);
        return;
      }

      if (courseAccess?.isEnrolled) {
        router.push(`/courses/${courseId}`);
        return;
      }

      if (isInCart) {
        router.push('/cart');
        return;
      }

      try {
        await cartService.addToCart(courseId);
      } catch (error: any) {
        if (
          error.response?.status === 500 ||
          error.response?.data?.message === 'Internal server error'
        ) {
          router.push('/cart');
          return;
        }
        if (error.response?.status === 401) {
          toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
          router.push('/login');
        } else {
          toast.error('Không thể thêm khóa học vào giỏ hàng.');
        }
        return;
      }

      router.push('/cart');
    } catch (error: any) {
      if (error.response?.status === 401) {
        toast.error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại');
        router.push('/login');
      } else {
        toast.error('Không thể thêm khóa học vào giỏ hàng.');
      }
    }
  };

  const handleCouponApply = () => {
    if (!couponCode.trim()) {
      toast.error('Vui lòng nhập mã coupon');
      return;
    }
    // TODO: Implement coupon application logic
    toast.success(`Áp dụng coupon ${couponCode} thành công!`);
    setCouponCode('');
    setShowCouponInput(false);
  };

  const getButtonText = () => {
    if (loading) return 'Đang tải...';
    if (courseAccess?.isInstructor) return 'Quản lý khóa học';
    if (courseAccess?.isEnrolled) return 'Vào học ngay';
    if (isInCart) return 'Xem giỏ hàng';
    return 'Thêm vào giỏ hàng';
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('vi-VN').format(price);
  };

  return (
    <Card className="bg-white border border-gray-300 shadow-lg rounded-lg w-full max-w-[350px] p-0 lg:fixed lg:top-[10vh] lg:right-[10%] lg:w-[320px]">
      {/* Course Preview */}
      <div className="relative">
        <div className="aspect-video bg-slate-300 rounded-t-lg overflow-hidden">
          <Image
            src={image}
            alt="course preview"
            width={350}
            height={200}
            className="w-full h-full object-cover"
          />
          {/* <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition-colors">
              <Play className="w-8 h-8 text-gray-800 ml-1" fill="currentColor" />
            </div>
          </div> */}
        </div>
        {/* <p className="absolute bottom-2 left-2 text-white text-sm bg-black bg-opacity-50 px-2 py-1 rounded">
          Xem trước khóa học này
        </p> */}
      </div>

      <div className="p-6">
        {/* Price Section */}
        <div className="mb-6">
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-bold text-gray-900">
              {course?.currentPrice ? formatPrice(course.currentPrice) : formatPrice(price)} đ
            </span>
            {(hasDiscount || course?.hasDiscount) && (course?.originalPrice || originalPrice) && (
              <span className="text-xl text-gray-500 line-through decoration-2">
                {formatPrice(course?.originalPrice || originalPrice || 0)} đ
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3 mb-6">
          <Button
            onClick={handleAddToCart}
            className="w-full h-12 bg-[#00FF84] hover:bg-[#00FF84] text-black font-semibold text-lg"
            disabled={loading}
          >
            {getButtonText()}
          </Button>

          <div className="flex gap-3">
            <Button
              onClick={handleBuyNow}
              variant="outline"
              className="flex-1 h-12 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50"
              disabled={loading}
            >
              {loading
                ? 'Đang tải...'
                : courseAccess?.isInstructor
                  ? 'Quản lý khóa học'
                  : courseAccess?.isEnrolled
                    ? 'Vào học ngay'
                    : isInCart
                      ? 'Đến giỏ hàng'
                      : 'Mua ngay'}
            </Button>

            <Button
              onClick={handleAddFavorite}
              variant="outline"
              className="w-12 h-12 border-gray-300 hover:bg-gray-50 p-0"
            >
              <Heart
                className={`w-5 h-5 ${isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-600'}`}
              />
            </Button>
          </div>
        </div>

        {/* Money Back Guarantee */}
        {/* <div className="text-center text-sm text-gray-600 mb-6">
          Đảm bảo hoàn tiền trong 30 ngày
        </div> */}

        {/* Course Includes */}
        {/* <div className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Khóa học này bao gồm:</h3>
          <ul className="space-y-3">
            {courseIncludes.map((item, index) => (
              <li key={index} className="flex items-start gap-3 text-sm text-gray-700">
                <span className="text-gray-500 mt-0.5 flex-shrink-0">{item.icon}</span>
                <span>{item.text}</span>
              </li>
            ))}
          </ul>
        </div> */}

        {/* Action Links */}
        <div className="space-y-3 text-center">
          {/* Coupon Section */}
          <div className="pt-3 border-t border-gray-200">
            {!showCouponInput ? (
              <button
                onClick={() => setShowCouponInput(true)}
                className="text-[#00FF84] hover:text-[#00FF84] font-medium text-sm underline"
              >
                Áp dụng coupon
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-gray-600">
                  Đã áp dụng <span className="font-semibold">KEEPLEARNING</span>
                  <br />
                  Coupon của Mentora
                </p>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value)}
                    placeholder="Nhập coupon"
                    className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-500"
                  />
                  <Button
                    onClick={handleCouponApply}
                    size="sm"
                    className="bg-[#00FF84] hover:bg-[#00FF84] text-black px-4"
                  >
                    Áp dụng
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

export default CourseSidebar;
