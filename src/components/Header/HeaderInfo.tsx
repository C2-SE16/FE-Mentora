'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';

const HeaderInfo = () => {
  const { user, isLoading, isLoggedIn } = useAuth();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    setHasToken(!!token);
  }, []);

  if (!isLoading && !user) {
    return null;
  }

  if (isLoading && !hasToken) {
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
          src={user.avatar || '/avatar.jpg'}
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
          className="text-sm text-purple-600 hover:text-purple-800 transition-colors"
        >
          Thêm nghề nghiệp và sở thích
        </Link>
      </div>
    </div>
  );
};

export default HeaderInfo;
