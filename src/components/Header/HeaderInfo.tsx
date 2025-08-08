'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const HeaderInfo = () => {
  const { user, isLoading, isLoggedIn } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    // Kiểm tra token mỗi khi component render
    const checkToken = () => {
      const token = localStorage.getItem('accessToken');
      setHasToken(!!token);
    };

    // Gọi kiểm tra ngay lập tức
    checkToken();

    // Thêm event listener để lắng nghe sự thay đổi localStorage
    window.addEventListener('storage', checkToken);

    // Tạo một custom event để lắng nghe logout từ bất kỳ đâu trong ứng dụng
    window.addEventListener('user-logout', checkToken);

    return () => {
      window.removeEventListener('storage', checkToken);
      window.removeEventListener('user-logout', checkToken);
    };
  }, [isLoggedIn]); // Vẫn giữ isLoggedIn để đảm bảo useEffect chạy khi trạng thái đăng nhập thay đổi

  // Kiểm tra cả isLoggedIn từ context và hasToken từ localStorage
  if (!isLoggedIn || !hasToken || !user) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 py-2">
        <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse"></div>
        <div>
          <div className="h-5 w-40 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-32 bg-gray-200 rounded animate-pulse"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 py-2">
      <div className="relative rounded-full w-[64px] h-[64px]">
        <Image
          src={user.avatar || '/avatar.png'}
          alt="Profile"
          width={48}
          height={48}
          className=" object-cover rounded-full w-full h-full "
        />
      </div>
      <div>
        <h3 className="font-medium text-2xl text-gray-800">Chào mừng {user.fullName} trở lại!</h3>
        <Link
          href="/profile/interests"
          className="text-md text-[#2cbb78] hover:text-[#54c78f] transition-colors"
        >
          Thêm nghề nghiệp và sở thích
        </Link>
      </div>
    </div>
  );
};

export default HeaderInfo;
