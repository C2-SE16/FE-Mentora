'use client';

import React, { useState } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/apis/api';
import { toast } from 'react-hot-toast';

export default function SecurityPage() {
  const { user } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState(user?.email);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const validateForm = () => {
    const formErrors: { [key: string]: string } = {};

    if (!currentPassword) {
      formErrors.currentPassword = 'Vui lòng nhập mật khẩu hiện tại';
    }

    if (!newPassword) {
      formErrors.newPassword = 'Vui lòng nhập mật khẩu mới';
    } else if (newPassword.length < 6) {
      formErrors.newPassword = 'Mật khẩu mới phải có ít nhất 6 ký tự';
    }

    if (newPassword !== confirmPassword) {
      formErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const token = localStorage.getItem('accessToken');
      if (!token) {
        toast.error('Vui lòng đăng nhập lại');
        return;
      }

      const response = await api.post(
        'auth/change-password',
        {
          currentPassword,
          newPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data && response.data.data.success) {
        toast.success('Đổi mật khẩu thành công!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmPassword('');
        setErrors({});
      } else {
        toast.error('Có lỗi xảy ra khi đổi mật khẩu');
      }
    } catch (error: any) {
      console.error('Password change error:', error);

      if (error.response?.data?.message) {
        toast.error(error.response.data.message);

        if (error.response.status === 401) {
          setErrors({
            currentPassword: 'Mật khẩu hiện tại không chính xác',
          });
        }
      } else {
        toast.error('Có lỗi xảy ra. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar />

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

              {/* Change Password Form */}
              <h2 className="text-base font-semibold mb-4">Thay đổi mật khẩu</h2>
              <div className="mb-8">
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Mật khẩu hiện tại"
                    className={`w-full h-[35px] px-4 py-2 border ${
                      errors.currentPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg`}
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                  />
                  {errors.currentPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.currentPassword}</p>
                  )}
                </div>
                <div className="mb-4">
                  <input
                    type="password"
                    placeholder="Mật khẩu mới"
                    className={`w-full h-[35px] px-4 py-2 border ${
                      errors.newPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg`}
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                  {errors.newPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.newPassword}</p>
                  )}
                </div>
                <div className="mb-6">
                  <input
                    type="password"
                    placeholder="Nhập lại mật khẩu mới"
                    className={`w-full h-[35px] px-4 py-2 border ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    } rounded-lg`}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
                <div>
                  <button
                    onClick={handlePasswordChange}
                    disabled={isSubmitting}
                    className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-3 rounded transition-colors duration-300 w-[157px] text-sm font-semibold disabled:opacity-50 flex items-center justify-center"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Đang xử lý...
                      </>
                    ) : (
                      'Thay đổi mật khẩu'
                    )}
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
