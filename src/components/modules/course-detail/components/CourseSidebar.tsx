'use client';

import { FavoriteService } from '@/apis/favoriteService';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LearningObjective } from '@/types/learning-object';
import { Heart } from 'lucide-react';
import React from 'react';
import { cartService } from '@/apis/cartService';
import { toast } from 'react-hot-toast';
import { useRouter } from 'next/navigation';
import { decodeJWT } from '@/utils/jwt';
import Image from 'next/image';

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

const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId, learningObject = [], image }) => {
  const router = useRouter();

  const handleAddToCart = async () => {
    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập để thêm khóa học vào giỏ hàng');
        router.push('/login');
        return;
      }

      await cartService.addToCart(courseId);
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
        <Button className="col-span-2 h-14 bg-[rgba(0,255,132,0.85)] text-[16px] font-oswald text-black font-normal hover:bg-[#00CC6E]">
          Thêm vào giỏ hàng
        </Button>
        <Button
          onClick={handleAddFavorite} // 👈 gọi hàm khi bấm trái tim
          className="col-span-1 h-14 bg-white border border-[rgba(0,255,132,0.85)] rounded-lg flex items-center justify-center hover:bg-slate-100"
        >
          <Heart className="w-8 h-8 text-[rgba(0,255,132,0.85)]" />
        </Button>

        <Button className="col-span-3 h-14 text-[16px] font-oswald text-black font-normal border border-[#00ff84d9] bg-white hover:bg-slate-100">
          Mua ngay
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
