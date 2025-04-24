import Link from 'next/link';
import React from 'react';

const SubHeader = () => {
  return (
    <div className="w-full border-b border-gray-200 bg-white hidden md:block">
      <div className="max-w-[1340px] mx-auto overflow-x-auto">
        <div className="flex space-x-6 py-2 px-4">
          <Link
            href="/categories/development"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Phát triển
          </Link>
          <Link
            href="/categories/business"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Kinh doanh
          </Link>
          <Link
            href="/categories/finance-accounting"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Tài chính & Kế toán
          </Link>
          <Link
            href="/categories/it-software"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            CNTT & Phần mềm
          </Link>
          <Link
            href="/categories/office-productivity"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Năng suất văn phòng
          </Link>
          <Link
            href="/categories/personal-development"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Phát triển cá nhân
          </Link>
          <Link
            href="/categories/design"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Thiết kế
          </Link>
          <Link
            href="/categories/marketing"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Marketing
          </Link>
          <Link
            href="/categories/health-fitness"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Sức khỏe & Thể dục
          </Link>
          <Link
            href="/categories/music"
            className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700"
          >
            Âm nhạc
          </Link>
        </div>
      </div>
    </div>
  );
};

export default SubHeader;
