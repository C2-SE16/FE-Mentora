import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import { Course } from '@/types/courses';

interface CourseItemInterface {
  course?: Course | null;
  index?: number;
}

export const CourseItem: React.FC<CourseItemInterface> = ({ course, index = 0 }) => {
  const isLastInRow = (index + 1) % 4 === 0;
  const popupPosition = isLastInRow ? 'right-full mr-4' : 'left-full ml-4';

  return (
    <div className="w-[330px] group relative">
      <Link href={`/courses/${course?.courseId}`}>
        {/* toàn bộ card là link */}
        <div className="block">
          <div className="relative overflow-hidden rounded-lg w-[330px] h-[200px] cursor-pointer">
            <Image
              src={
                course?.thumbnail ||
                // 'https://plus.unsplash.com/premium_vector-1734159656195-8b0f4d6a6b73?q=80&w=2416&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'
                ''
              }
              alt=""
              width={330}
              height={200}
              className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
            />
          </div>
          <div className="info">
            <div className="head">
              <p className="font-bold text-lg mt-2 text-[#303141]">{course?.title}</p>
            </div>
            <p className="mt-1">{course?.instructor?.user?.firstName}</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                {course?.rating} <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">({course?.reviews?.length || 0})</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">{course?.price}</span>
              <span className="line-through">{course?.price}</span>
            </div>
          </div>
        </div>
      </Link>

      {/* Popup thông tin khi hover */}
      <div
        className={`absolute ${popupPosition} top-0 w-[320px] bg-white rounded-lg shadow-xl opacity-0 invisible transform translate-x-2 transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 border border-gray-200`}
      >
        <div
          className={`absolute ${
            isLastInRow ? 'top-8 -right-[10px] rotate-90' : 'top-12 -left-[10px] -rotate-90'
          }`}
        >
          <Image src="/dropdown-accessory.svg" alt="dropdown" width={20} height={20} />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-lg text-gray-800">{course?.title}</h3>
          <p className="text-gray-600 text-sm mt-1">Đã cập nhật</p>

          <div className="mt-2 text-gray-700 text-sm">
            <p className="mt-3">{course?.description}</p>

            <div className="mt-3">
              {course?.categories?.map((category, idx) => (
                <div key={idx} className="flex items-center gap-x-2 mt-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-green-600"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {/* <span>{category.name}</span> */}
                </div>
              ))}
            </div>

            <div className="mt-4">
              <button className="bg-[#29cc60] text-white py-2 px-4 rounded-md w-full font-medium">
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
