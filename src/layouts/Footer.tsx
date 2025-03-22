import Image from 'next/image';
import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-[#002333] text-white pt-10 pb-4">
      <div className="w-[1200px] max-w-[calc(100%-4.8rem)] mx-auto my-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-1 justify-between">
          {/* Column 1 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Học cùng chuyên gia</h3>
            <ul className="space-y-2">
              <li>Hotline 1: 0352368923</li>
              <li>Hotline 1: 0352368923</li>
              <li>Email: contact@mentora.com</li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Về Mentora</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Giới thiệu
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Hướng dẫn sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Chia sẻ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Điều khoản sử dụng
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Chính sách bảo mật
                </a>
              </li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Hợp tác</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Đăng ký giảng viên
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Đào tạo
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Khám phá</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Phương thức thanh toán
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Giúp đỡ và hỗ trợ
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Sự nghiệp
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Bài viết
                </a>
              </li>
            </ul>
          </div>

          {/* Column 5 */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Khóa học</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="hover:text-gray-300">
                  Marketing
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Lập trình
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Tài chính
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-gray-300">
                  Thiết kế
                </a>
              </li>
            </ul>
          </div>
        </div>
        <div className="block border-t border-[#00FF84] mt-8 pt-6"></div>

        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex items-center mb-4 md:mb-0">
            <Image src="/mentora-footer.svg" alt="logo" width={120} height={120} className="" />
            <span className="ml-4 mt-2">© 2025</span>
          </div>
          <div className="flex items-center">
            <span className="mr-2">
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
                  d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"
                />
              </svg>
            </span>
            <span>English</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
