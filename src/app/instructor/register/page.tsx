'use client';

import React, { useState, useEffect, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { InstructorService } from '@/apis/instructorService';

const InstructorRegisterPage = () => {
  const { user, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [formData, setFormData] = useState({
    instructorName: '',
    bio: '',
    experience: '',
    profilePicture: '',
  });
  const [isInstructor, setIsInstructor] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    // Kiểm tra nếu người dùng đã đăng nhập
    if (!isLoading && !isLoggedIn) {
      router.push('/login');
      return;
    }

    // Kiểm tra trạng thái instructor
    const checkInstructorStatus = async () => {
      try {
        const response = await InstructorService.checkInstructorStatus();

        if (response.isInstructor) {
          setIsInstructor(true);
          router.push('/instructor/manage/courses'); // Chuyển hướng nếu đã là instructor
        }
      } catch (error) {
        console.error('Lỗi khi kiểm tra trạng thái instructor:', error);
      }
    };

    if (isLoggedIn) {
      checkInstructorStatus();
    }
  }, [isLoggedIn, isLoading, router]);

  // Tự động điền tên từ thông tin người dùng
  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        instructorName: user.fullName || '',
        profilePicture: user.avatar || '',
      }));
    }
  }, [user]);

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await InstructorService.registerInstructor(formData);

      if (response) {
        setSuccess('Đăng ký thành công! Bạn sẽ được chuyển hướng sau vài giây...');
        // Chuyển hướng sau 3 giây
        setTimeout(() => {
          router.push('/instructor/manage/courses');
        }, 3000);
      }
    } catch (error: any) {
      console.error('Lỗi khi đăng ký:', error);
      if (error.response?.data?.message) {
        if (error.response.status === 409) {
          setError('Bạn đã là giảng viên. Đang chuyển hướng...');
          setTimeout(() => {
            router.push('/instructor/manage/courses');
          }, 2000);
        } else {
          setError(error.response.data.message);
        }
      } else {
        setError('Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại sau.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-16 h-16 border-t-4 border-[#1dbe70] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Trở thành giảng viên tại Mentora
          </h1>
          <p className="text-lg text-gray-600">
            Chia sẻ kiến thức của bạn và tạo nguồn thu nhập từ việc dạy học trực tuyến
          </p>
        </div>

        <div className="bg-white shadow-lg rounded-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/2 relative min-h-[300px] bg-gradient-to-r from-green-400 to-blue-500">
              <div className="absolute inset-0 flex items-center justify-center flex-col text-white p-8">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 mb-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
                <h2 className="text-2xl font-bold text-center">Trở thành giảng viên Mentora</h2>
                <p className="text-center mt-2">Tiếp cận hàng ngàn học viên trên toàn thế giới</p>
              </div>
            </div>

            <div className="md:w-1/2 p-8">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">Đăng ký làm giảng viên</h2>

              {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">{error}</div>}

              {success && (
                <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-md">{success}</div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="mb-4">
                  <label
                    htmlFor="instructorName"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Tên giảng viên
                  </label>
                  <input
                    type="text"
                    id="instructorName"
                    name="instructorName"
                    value={formData.instructorName}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    placeholder="Nguyễn Văn A"
                  />
                </div>

                <div className="mb-4">
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
                    Giới thiệu bản thân
                  </label>
                  <textarea
                    id="bio"
                    name="bio"
                    value={formData.bio}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    placeholder="Giảng viên có X năm kinh nghiệm..."
                  />
                </div>

                <div className="mb-6">
                  <label
                    htmlFor="experience"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Kinh nghiệm làm việc
                  </label>
                  <textarea
                    id="experience"
                    name="experience"
                    value={formData.experience}
                    onChange={handleChange}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    placeholder="Senior Developer tại..."
                  />
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={`w-full bg-[#1dbe70] hover:bg-[#18a862] text-white font-bold py-3 px-6 rounded-md transition-colors ${
                      isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
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
                      </span>
                    ) : (
                      'Đăng ký giảng dạy'
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#1dbe70] text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Linh hoạt thời gian</h3>
            <p className="text-gray-600">
              Tạo và dạy các khóa học theo lịch trình của bạn mà không bị giới hạn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#1dbe70] text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tạo thu nhập</h3>
            <p className="text-gray-600">
              Nhận thanh toán cho mỗi học viên đăng ký khóa học của bạn.
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="flex items-center justify-center h-12 w-12 rounded-md bg-[#1dbe70] text-white mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tiếp cận toàn cầu</h3>
            <p className="text-gray-600">
              Chia sẻ kiến thức của bạn với hàng ngàn học viên từ khắp nơi trên thế giới.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorRegisterPage;
