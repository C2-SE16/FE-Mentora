'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

export default function VerifyEmail() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [verifying, setVerifying] = useState(true);

  useEffect(() => {
    // Here you would typically make an API call to verify the token
    // For now, we'll just simulate success after a brief delay
    const timer = setTimeout(() => {
      setVerifying(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, [token]);

  return (
    <div className="flex mt-36 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 text-center shadow-md">
        {verifying ? (
          <div className="flex flex-col items-center">
            <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
            <p className="mt-4 text-lg font-medium">Đang xác nhận email...</p>
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-green-500"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="mt-4 text-2xl font-bold text-gray-900">Đã xác nhận email của bạn</h1>
            <p className="mt-2 text-gray-600">
              Cảm ơn bạn đã xác nhận email. Bây giờ bạn có thể sử dụng đầy đủ các tính năng của tài
              khoản.
            </p>
            <Link
              href="/"
              className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
            >
              Trở về trang chủ
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
