'use client';

import { useState } from 'react';
import Link from 'next/link';
import api from '@/apis/api';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  const validateEmail = () => {
    if (!email) {
      setValidationError('Email không được để trống');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleForgotPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateEmail()) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await api.post('auth/forgot-password', {
        email,
      });

      setIsSuccess(true);
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      setError(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi gửi yêu cầu đặt lại mật khẩu. Vui lòng thử lại sau.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex mt-24 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Quên mật khẩu</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
          </div>
        )}

        {!isSuccess ? (
          <form onSubmit={handleForgotPassword}>
            <div className="mb-6">
              <label htmlFor="email" className="mb-2 block font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#1dbe70] focus:outline-none focus:ring-1 focus:ring-[#1dbe70]"
                required
                disabled={processing}
                placeholder="Nhập địa chỉ email của bạn"
              />
            </div>

            {validationError && (
              <div className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-700">
                {validationError}
              </div>
            )}

            <button
              type="submit"
              className="w-full rounded-md bg-[#1dbe70] py-2.5 px-4 font-medium text-white hover:bg-[#18a862] focus:outline-none focus:ring-2 focus:ring-[#18a862] focus:ring-offset-2 disabled:opacity-70"
              disabled={processing}
            >
              {processing ? 'Đang gửi email...' : 'Gửi email đặt lại mật khẩu'}
            </button>

            <div className="mt-4 text-center">
              <Link href="/login" className="text-[#1dbe70] hover:underline">
                Quay lại đăng nhập
              </Link>
            </div>
          </form>
        ) : (
          <div className="flex flex-col items-center text-center">
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
            <h2 className="mt-4 text-xl font-semibold text-gray-900">
              Đã gửi email đặt lại mật khẩu!
            </h2>
            <p className="mt-2 text-gray-600">
              Chúng tôi đã gửi hướng dẫn đặt lại mật khẩu đến email của bạn.
            </p>
            <p className="mt-2 text-gray-600">
              Vui lòng kiểm tra hộp thư của bạn và làm theo hướng dẫn trong email.
            </p>
            <div className="mt-6 flex flex-col gap-3">
              <Link
                href="/login"
                className="rounded-md bg-[#1dbe70] px-4 py-2 text-white hover:bg-[#18a862]"
              >
                Quay lại đăng nhập
              </Link>
              <button
                onClick={() => setIsSuccess(false)}
                className="text-[#1dbe70] hover:underline"
              >
                Gửi lại email
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
