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
  courseId: string;
  learningObject?: LearningObjective[];
  image: string;
}

interface CartItem {
  courseId: string;
  // thêm các trường khác nếu cần
}

interface Cart {
  items: CartItem[];
}

const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId, learningObject = [], image }) => {
  const router = useRouter();
  const [courseAccess, setCourseAccess] = useState<CourseAccessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInCart, setIsInCart] = useState(false);

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
          setIsInCart(cartResponse.data.courses.some(course => course.courseId === courseId));
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

      await cartService.addToCart(courseId);
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
    const message = await FavoriteService.addFavorite({
      userId: decodedToken.sub,
      courseId: courseId,
    });
    if (message) {
      toast.success(message); // thông báo thành công
    } else {
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
        // Nếu lỗi 500 hoặc khóa học đã có trong giỏ hàng, chuyển hướng đến trang giỏ hàng
        if (error.response?.status === 500 || error.response?.data?.message === "Internal server error") {
          router.push('/cart');
          return;
        }
        // Xử lý các lỗi khác
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

  const getButtonText = () => {
    if (loading) return 'Đang tải...';
    if (courseAccess?.isInstructor) return 'Quản lý khóa học';
    if (courseAccess?.isEnrolled) return 'Vào học ngay';
    if (isInCart) return 'Xem giỏ hàng';
    return 'Thêm vào giỏ hàng';
  };

  return (
    <Card
      className="bg-white border border-gray-300 shadow-md rounded-none w-full h-[500px] p-4 
     md:grid-cols-1 md:col-span-3 md:px-6 
     lg:fixed lg:top-[10vh] lg:right-[10%] lg:w-[280px]"
    >
      <div className=" bg-slate-300 h-[150px]">
        <Image
          src={image}
          alt="course image"
          width={150}
          height={150}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="pt-5 grid grid-cols-3 gap-4">
        <Button 
          onClick={handleAddToCart}
          className="col-span-2 h-14 bg-[rgba(0,255,132,0.85)] text-[16px] font-oswald text-black font-normal hover:bg-[#00CC6E]"
          disabled={loading}
        >
          {getButtonText()}
        </Button>
        <Button
          onClick={handleAddFavorite}
          className="col-span-1 h-14 bg-white border border-[rgba(0,255,132,0.85)] rounded-lg flex items-center justify-center hover:bg-slate-100"
        >
          <Heart className="w-8 h-8 text-[rgba(0,255,132,0.85)]" />
        </Button>

        <Button 
          onClick={handleBuyNow}
          className="col-span-3 h-14 text-[16px] font-oswald text-black font-normal border border-[#00ff84d9] bg-white hover:bg-slate-100"
          disabled={loading}
        >
          {loading ? 'Đang tải...' : 
           courseAccess?.isInstructor ? 'Quản lý khóa học' :
           courseAccess?.isEnrolled ? 'Vào học ngay' :
           isInCart ? 'Đến giỏ hàng' : 'Mua ngay'}
        </Button>
      </div>
      <h2 className="text-[16px] font-normal font-oswald pt-3">Nội dung khóa học</h2>
      <div>
        <ul className="list-disc pl-5  text-[15px] font-normal font-robotoCondensed w-full max-w-full">
          {learningObject.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item.description}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CourseSidebar;
