import Image from 'next/image';
import React from 'react';
import Button from '../Button/Button';
import Link from 'next/link';

const BecomeTutorBanner = () => {
  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-[#111111] to-[#2D2D2D] py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-10">
          {/* Left content */}
          <div className="text-center lg:text-left lg:w-1/2">
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start mb-6">
              <h1 className="text-white text-3xl sm:text-4xl font-bold">Trở thành giảng viên</h1>
              <span className="mt-2 sm:mt-0">
                <Image
                  src="/mentora-footer.svg"
                  alt="logo"
                  width={150}
                  height={50}
                  className="ml-2"
                />
              </span>
            </div>

            <p className="text-gray-300 text-lg mb-8 max-w-2xl">
              Chia sẻ kiến thức của bạn với hàng triệu học viên trên khắp Việt Nam và kiếm thu nhập
              không giới hạn. Hơn 10,000 giảng viên đã tham gia cộng đồng Mentora.
            </p>

            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-8">
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[#00FF84] text-3xl font-bold">60M+</span>
                <span className="text-gray-400 text-sm">Học viên toàn cầu</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[#00FF84] text-3xl font-bold">120+</span>
                <span className="text-gray-400 text-sm">Quốc gia</span>
              </div>
              <div className="flex flex-col items-center lg:items-start">
                <span className="text-[#00FF84] text-3xl font-bold">15K+</span>
                <span className="text-gray-400 text-sm">Giảng viên đang dạy</span>
              </div>
            </div>

            <Button
              href="/instructor/register"
              backgroundColor="#00FF84"
              textColor="black"
              minWidth={195}
              className="rounded-2xl leading-[55px] text-center font-bold text-lg shadow-[0_0_15px_rgba(0,255,132,0.5)]"
              textSize="18"
            >
              Đăng ký giảng dạy
            </Button>
          </div>

          {/* Right content with image */}
          <div className="lg:w-1/2 relative">
            <div className="relative w-full h-[300px] sm:h-[350px]">
              <Image
                src="/banner/4.jpg" // Bạn cần thêm hình ảnh này
                alt="Become an instructor"
                layout="fill"
                objectFit="cover"
                className="rounded-lg shadow-xl"
              />

              {/* Overlay testimonial */}
              <div className="absolute -bottom-6 -left-6 bg-white p-4 rounded-lg shadow-lg max-w-xs">
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3">
                    <Image
                      src="/avatar.png"
                      alt="Instructor"
                      width={10}
                      height={10}
                      className="object-cover h-10 w-10"
                    />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Elliot Nguyen</p>
                    <p className="text-xs text-gray-600">Giảng viên từ 2020</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 italic">
                  "Trở thành giảng viên tại Mentora là quyết định đúng đắn nhất trong sự nghiệp của
                  tôi."
                </p>
                <div className="mt-2 flex">
                  <div className="text-yellow-500 flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom features */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#00FF84] rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
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
            <h3 className="text-white text-xl font-bold mb-2">Thu nhập không giới hạn</h3>
            <p className="text-gray-400">
              Mở rộng tầm ảnh hưởng và thu nhập của bạn với mô hình kiếm tiền hấp dẫn từ Mentora.
            </p>
          </div>

          <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#00FF84] rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z"
                />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Hỗ trợ toàn diện</h3>
            <p className="text-gray-400">
              Đội ngũ hỗ trợ của chúng tôi luôn sẵn sàng giúp bạn tạo ra những khóa học chất lượng
              cao.
            </p>
          </div>

          <div className="bg-[rgba(255,255,255,0.05)] p-6 rounded-lg">
            <div className="w-12 h-12 bg-[#00FF84] rounded-full flex items-center justify-center mb-4">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6 text-black"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </div>
            <h3 className="text-white text-xl font-bold mb-2">Tiếp cận toàn cầu</h3>
            <p className="text-gray-400">
              Tiếp cận hàng triệu học viên trên toàn thế giới và xây dựng thương hiệu cá nhân của
              bạn.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BecomeTutorBanner;
