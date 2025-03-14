import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '../Button/Button';

const HomeCourse = () => {
  return (
    <div className="mt-5">
      {/* Course list 1 */}
      <div className="flex gap-x-6">
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
      </div>
      {/* Course list 2 */}
      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Top bán chạy</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image
            src="/chevron-right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <div className="flex gap-x-6 mt-5">
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
          <Button
            href="/courses/1"
            backgroundColor="#3A10E5"
            textColor="#ffffff"
            minWidth={110}
            className="mt-3"
          >
            bán chạy
          </Button>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
      </div>
      {/* Course list 3 */}
      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Học nhiều trong ngày</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image
            src="/chevron-right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <div className="flex gap-x-6 mt-5">
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
            <Button
              href="/courses/1"
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={110}
              className="mt-3"
            >
              bán chạy
            </Button>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
        </div>
        <div className="w-[330px]">
          <Image
            src="/course-preview.png"
            alt="course-item"
            width={330}
            height={133}
            className="cursor-pointer"
          />
          <div className="info">
            <div className="head">
              <Link
                href="/courses/1"
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                Khóa học: Xây dựng kênh youtube
              </Link>
            </div>
            <p className="mt-1">Anh Dat</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                4.5 <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">(3000)</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">₫100.000đ</span>
              <span className="line-through">₫80.000đ</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Topic đề xuất cho bạn</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image
            src="/chevron-right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <div className="flex gap-x-6 mt-5">
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            Java
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            Deep Learning
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            ReactJs
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            NodeJs
          </Button>
        </div>
      </div>
      <div className="flex gap-x-6 mt-5">
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            Marketing
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            NestJs
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            Thiết kế đồ họa
          </Button>
        </div>
        <div className="w-[330px]">
          <Button
            href="/courses/1"
            minWidth={310}
            backgroundColor="#fff"
            textColor="black"
            className="border border-black shadow-custom"
          >
            Thể thao
          </Button>
        </div>
      </div>

      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Mentor được yêu thích</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image
            src="/chevron-right.svg"
            alt="arrow-right"
            width={24}
            height={24}
          />
        </Link>
      </div>
      <div className="flex gap-x-6 mt-5">
        <div className="w-[330px] h-[290px] border border-black">
          <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center">
            <Image
              src="/avatar.jpg"
              alt="course-item"
              width={165}
              height={165}
              className="cursor-pointer rounded-full object-cover w-[165px] h-[165px]"
            />
            <h2 className="text-xl font-bold mt-4">Elliot Senpai</h2>
            <p className="font-bold">CTO</p>
          </div>
        </div>
        <div className="w-[330px] h-[290px] border border-black">
          <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center">
            <Image
              src="/avatar.jpg"
              alt="course-item"
              width={165}
              height={165}
              className="cursor-pointer rounded-full object-cover w-[165px] h-[165px]"
            />
            <h2 className="text-xl font-bold mt-4">Starling Senpai</h2>
            <p className="font-bold">CEO</p>
          </div>
        </div>
        <div className="w-[330px] h-[290px] border border-black">
          <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center">
            <Image
              src="/avatar.jpg"
              alt="course-item"
              width={165}
              height={165}
              className="cursor-pointer rounded-full object-cover w-[165px] h-[165px]"
            />
            <h2 className="text-xl font-bold mt-4">Dat-G Senpai</h2>
            <p className="font-bold">Master</p>
          </div>
        </div>
        <div className="w-[330px] h-[290px] border border-black">
          <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center">
            <Image
              src="/avatar.jpg"
              alt="course-item"
              width={165}
              height={165}
              className="cursor-pointer rounded-full object-cover w-[165px] h-[165px]"
            />
            <h2 className="text-xl font-bold mt-4">Nam-Cuc Senpai</h2>
            <p className="font-bold">Trader</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomeCourse;
