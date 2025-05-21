'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import api from '@/apis/api';
import { useAuth } from '@/contexts/AuthContext';
import Cookies from 'js-cookie';

const loginSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(1, 'Vui lòng nhập mật khẩu'),
});

type LoginFormData = z.infer<typeof loginSchema>;

// Component Spinner
const Spinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
);

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { refetchUser } = useAuth();
  const searchParams = useSearchParams();
  const redirectTo = searchParams?.get('redirectTo') || '/';

  const {
    handleSubmit,
    formState: { errors },
    register,
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const router = useRouter();

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const loginData = {
        email: data.email,
        password: data.password,
      };

      console.log('[Login] Attempting to login with:', { email: data.email });


      const response = await api.post('auth/login', loginData);
      console.log('[Login] Login response:', response.data ? 'success' : 'failed');


      if (response.data) {
        const accessToken = response.data.data.accessToken;
        console.log('[Login] Token received, storing in localStorage and cookies');


        // Lưu token vào cả hai vị trí trong localStorage
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('token', accessToken);


        // Lưu token vào cookies
        Cookies.set('accessToken', accessToken, { path: '/' });
        Cookies.set('token', accessToken, { path: '/' });


        console.log('[Login] Token saved to localStorage and cookies');


        setSuccess(true);


        // Cập nhật thông tin người dùng
        await refetchUser();

        // Phát ra sự kiện đăng nhập thành công
        window.dispatchEvent(new Event('user-login-success'));

        // Chuyển hướng người dùng đến trang họ đang cố truy cập trước đó hoặc trang chủ
        console.log('[Login] Redirecting to:', redirectTo);

        // Thêm logic để reload trang sau khi chuyển hướng
        if (redirectTo === '/') {
          // Nếu chuyển về trang chủ, sử dụng window.location để đảm bảo trang được tải lại
          window.location.href = redirectTo;
        } else {
          // Với các trang khác, sử dụng router.push như bình thường
          router.push(redirectTo);
        }
      }
    } catch (err) {
      console.error('[Login] Login error:', err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Đăng nhập thất bại, vui lòng thử lại.');
      } else {
        setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 lg:w-1/2">
          <div className="flex items-center justify-center h-full p-8">
            <Image
              src="/authentication.png"
              alt="Login"
              width={600}
              height={600}
              className="object-cover rounded-lg"
              priority
            />
          </div>
        </div>

        {/* Right side - Form */}
        <div className="w-full md:w-1/2 lg:w-1/2 p-6 md:pl-0 md:pr-8 flex flex-col justify-center">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-3xl font-bold mb-8 text-center">Đăng nhập</h1>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

            {redirectTo !== '/' && (
              <div className="mb-4 p-3 bg-blue-50 text-blue-700 rounded-md">
                Vui lòng đăng nhập để tiếp tục truy cập nội dung.
              </div>
            )}

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div>
                <input
                  type="email"
                  placeholder="Email"
                  className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  {...register('email')}
                  disabled={success}
                />
                {errors.email && (
                  <p className="mt-1 text-red-500 text-sm">{errors.email.message}</p>
                )}
              </div>

              <div>
                <input
                  type="password"
                  placeholder="Mật khẩu"
                  className={`w-full border ${errors.password ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                  {...register('password')}
                  disabled={success}
                />
                {errors.password && (
                  <p className="mt-1 text-red-500 text-sm">{errors.password.message}</p>
                )}
              </div>

              <button
                type="submit"
                className="w-full bg-[#00FF84] text-black font-medium py-3 px-4 rounded-md hover:bg-[#00e878] transition-colors flex items-center justify-center"
                disabled={isLoading || success}
              >
                {isLoading ? (
                  <div className="flex items-center space-x-2">
                    <Spinner />
                  </div>
                ) : success ? (
                  <div className="flex items-center space-x-2">
                    <Spinner />
                  </div>
                ) : (
                  <>
                    <span>Đăng nhập với email</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 ml-2"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                      <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                    </svg>
                  </>
                )}
              </button>

              <div className="mt-3 text-center">
                <Link href="/forgot-password" className="text-[#1dbe70] hover:underline">
                  Quên mật khẩu?
                </Link>
              </div>
            </form>

            <div className="mt-8 relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">
                Đăng nhập bằng cách khác
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            {/* <div className="mt-4 flex justify-center">
              <button
                className="flex items-center justify-center p-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => console.log('Google login')}
              >
                <Image
                  src="/google-login.png"
                  alt="Google"
                  width={40}
                  height={40}
                  className="w-10 h-10"
                />
              </button>
            </div> */}

            <div className="mt-6 text-center text-sm text-gray-600">
              <p>
                Bằng cách đăng nhập, bạn đồng ý với{' '}
                <Link href="/terms" className="text-[#1dbe70] hover:underline">
                  Điều khoản Sử dụng
                </Link>{' '}
                và{' '}
                <Link href="/privacy" className="text-[#1dbe70] hover:underline">
                  Chính sách
                </Link>{' '}
                riêng tư của chúng tôi.
              </p>
            </div>

            <div className="mt-8 text-center bg-gray-100 py-4 rounded-md">
              <p className="text-gray-600">
                Bạn chưa có tài khoản?{' '}
                <Link href="/register" className="text-[#1dbe70] font-semibold hover:underline">
                  đăng kí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
