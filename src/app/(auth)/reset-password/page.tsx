'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/apis/api';

export default function ResetPassword() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams?.get('token');

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [processing, setProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  useEffect(() => {
    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn. Vui lòng yêu cầu đặt lại mật khẩu lại.');
    }
  }, [token]);

  const validatePassword = () => {
    if (password.length < 6) {
      setValidationError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    if (password !== confirmPassword) {
      setValidationError('Mật khẩu xác nhận không khớp');
      return false;
    }

    setValidationError(null);
    return true;
  };

  const handleResetPassword = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      setError('Token không hợp lệ hoặc đã hết hạn');
      return;
    }

    if (!validatePassword()) {
      return;
    }

    setProcessing(true);
    setError(null);

    try {
      await api.post('auth/reset-password', {
        token,
        password,
      });

      setIsSuccess(true);
      setTimeout(() => {
        router.push('/login');
      }, 3000);
    } catch (error: any) {
      console.error('Error resetting password:', error);
      setError(
        error?.response?.data?.message ||
          'Có lỗi xảy ra khi đặt lại mật khẩu. Token có thể đã hết hạn.'
      );
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="flex mt-24 flex-col items-center justify-center p-4">
      <div className="w-full max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-md">
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-900">Đặt lại mật khẩu</h1>

        {error && (
          <div className="mb-4 rounded-md bg-red-50 p-4 text-sm text-red-700">
            <p>{error}</p>
            <Link href="/forgot-password" className="mt-2 block text-blue-600 hover:underline">
              Yêu cầu đặt lại mật khẩu mới
            </Link>
          </div>
        )}

        {!isSuccess && !error && (
          <form onSubmit={handleResetPassword}>
            <div className="mb-4">
              <label htmlFor="password" className="mb-2 block font-medium text-gray-700">
                Mật khẩu mới
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#1dbe70] focus:outline-none focus:ring-1 focus:ring-[#1dbe70]"
                required
                disabled={processing}
              />
            </div>

            <div className="mb-6">
              <label htmlFor="confirmPassword" className="mb-2 block font-medium text-gray-700">
                Xác nhận mật khẩu
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full rounded-md border border-gray-300 p-2.5 focus:border-[#1dbe70] focus:outline-none focus:ring-1 focus:ring-[#1dbe70]"
                required
                disabled={processing}
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
              {processing ? 'Đang xử lý...' : 'Đặt lại mật khẩu'}
            </button>
          </form>
        )}

        {isSuccess && (
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
              Mật khẩu đã được đặt lại thành công!
            </h2>
            <p className="mt-2 text-gray-600">
              Bạn có thể đăng nhập với mật khẩu mới ngay bây giờ.
            </p>
            <p className="mt-2 text-sm text-gray-500">Đang chuyển hướng đến trang đăng nhập...</p>
            <Link
              href="/login"
              className="mt-6 rounded-md bg-[#1dbe70] px-4 py-2 text-white hover:bg-[#18a862]"
            >
              Đăng nhập ngay
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
