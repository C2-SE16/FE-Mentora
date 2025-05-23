'use client';

import { useState } from 'react';
import axios from 'axios';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import Image from 'next/image';
import api from '@/apis/api';

const registerSchema = z.object({
  email: z.string().email('Email không hợp lệ'),
  password: z.string().min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
  fullName: z.string().min(1, 'Vui lòng nhập họ tên'),
});

type RegisterFormData = z.infer<typeof registerSchema>;

const Spinner = () => (
  <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
);

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  console.log('success:::', success);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      email: '',
      fullName: '',
      password: '',
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setIsLoading(true);
      setError(null);

      const registerData = {
        email: data.email,
        password: data.password,
        fullName: data.fullName,
      };

      const response = await api.post('/auth/register', registerData);

      if (response.data.statusCode === 201) {
        localStorage.setItem('accessToken', response.data.data.accessToken);
        setSuccess(true);
        setTimeout(() => {
          window.location.href = '/login';
        }, 2500);
      }
    } catch (err) {
      console.error('Register error:', err);

      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || 'Register failed, please try again.');
      } else {
        setError('An error occurred. Please try again later.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto overflow-hidden">
          {/* Left side - Image */}
          <div className="hidden md:block md:w-1/2 lg:w-1/2">
            <div className="flex items-center justify-center h-full p-8">
              <Image
                src="/authentication.png"
                alt="Registration"
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
              <h1 className="text-3xl font-bold mb-8 text-center">Đăng kí</h1>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center justify-center gap-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>Vui lòng kiểm tra email để xác thực tài khoản</span>
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
                    type="text"
                    placeholder="Họ và tên"
                    className={`w-full border ${errors.fullName ? 'border-red-500' : 'border-gray-300'} rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent`}
                    {...register('fullName')}
                    disabled={success}
                  />
                  {errors.fullName && (
                    <p className="mt-1 text-red-500 text-sm">{errors.fullName.message}</p>
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
                      <span>Đang xử lý</span>
                    </div>
                  ) : success ? (
                    <div className="flex items-center space-x-2">
                      <Spinner />
                    </div>
                  ) : (
                    <>
                      <span>Đăng kí với email</span>
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

              <div className="mt-6 text-center text-sm text-gray-600">
                <p>
                  Bằng cách đăng ký, bạn đồng ý với{' '}
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
                  Bạn đã có tài khoản?{' '}
                  <Link href="/login" className="text-[#1dbe70] font-semibold hover:underline">
                    đăng nhập
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;
