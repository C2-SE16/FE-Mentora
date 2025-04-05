'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login data:', formData);
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      <div className="flex flex-col md:flex-row w-full max-w-6xl mx-auto overflow-hidden">
        {/* Left side - Image */}
        <div className="hidden md:block md:w-1/2 lg:w-1/2">
          <div className="flex items-center justify-center h-full p-8">
            <Image
              src="/authentication-picture.png"
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

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>
              <div>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Mật khẩu"
                  className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full bg-[#00FF84] text-black font-medium py-3 px-4 rounded-md hover:bg-[#00e878] transition-colors flex items-center justify-center"
              >
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
              </button>
            </form>

            <div className="mt-8 relative flex items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-500 text-sm">
                Đăng nhập bằng cách khác
              </span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>

            <div className="mt-4 flex justify-center">
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
            </div>

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
                Bạn đã chưa có tài khoản,{' '}
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
