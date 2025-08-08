'use client';

import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import ProfileLayout from '../layout';

export default function PaymentMethodsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isLoading } = useAuth();
  const router = useRouter();

  // Kiểm tra nếu người dùng chưa đăng nhập thì chuyển hướng về trang đăng nhập
  React.useEffect(() => {
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
    }
  }, [isLoading, isLoggedIn, router]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <ProfileLayout>
      {children}
    </ProfileLayout>
  );
} 