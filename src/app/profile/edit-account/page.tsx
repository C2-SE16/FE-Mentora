'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

export default function SecurityPage() {
  const [firstName, setFirstName] = useState('Anh');
  const [lastName, setLastName] = useState('Bảo');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [email, setEmail] = useState('anhbao123@gmail.com');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  const handlePasswordChange = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic xử lý đổi mật khẩu ở đây
    console.log('Passwords:', { currentPassword, newPassword });
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar firstName={firstName} lastName={lastName} />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Bảo mật tài khoản</h1>
                <p className="text-black mt-2">Chỉnh sửa mật khẩu của bạn tại đây</p>
              </div>

              {/* Email Section */}
              <h2 className="text-base font-semibold mb-4">Email</h2>

              <div className="mb-8 flex justify-between gap-x-2 items-center cursor-pointer">
                <div className="h-[35px] w-full flex justify-between items-center border border-gray-300 rounded-lg bg-white py-4 px-5">
                  <div>
                    <div className="flex items-center text-sm">
                      <span className="text-gray-600">Địa chỉ email của bạn là </span>
                      <span className="font-medium ml-1">{email}</span>
                    </div>
                  </div>
                </div>
                <button className="w-10 h-8 bg-[#1dbe70] rounded flex items-center justify-center text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </button>
              </div>

              <div className="mb-8">
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Nhập mật khẩu mới"
                    className="w-full h-[35px] px-4 py-2 border border-gray-300 rounded-lg"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className="w-full h-[35px] px-4 py-2 border border-gray-300 rounded-lg"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <button
                    onClick={handlePasswordChange}
                    className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-3 rounded transition-colors duration-300 w-[157px] text-sm font-semibold"
                  >
                    Thay đổi mật khẩu
                  </button>
                </div>
              </div>

              {/* Two-Factor Authentication */}
              <div className="mb-8">
                <div className="border border-gray-300 rounded bg-white py-4 px-5">
                  <h2 className="text-base font-bold mb-4">Xác thực hai yếu tố</h2>

                  <p className="text-black mb-4">
                    Tăng cường bảo mật tài khoản của bạn bằng cách yêu cầu nhập mã được gửi qua
                    email khi bạn đăng nhập. Để biết thêm thông tin và cách thức hoạt động của xác
                    thực hai yếu tố, hãy tham khảo{' '}
                    <a href="#" className="text-[#1dbe70] hover:underline">
                      bài viết trong Trung tâm trợ giúp
                    </a>{' '}
                    của chúng tôi.
                  </p>
                  <button
                    onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                    className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-2 rounded transition-colors duration-300 w-[95px] text-sm font-semibold"
                  >
                    {twoFactorEnabled ? 'Vô hiệu hóa' : 'Cho phép'}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
