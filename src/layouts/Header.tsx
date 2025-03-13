import Image from 'next/image';
import React from 'react';
import Link from 'next/link';

const Header = () => {
  return (
    <header className="h-[72px] bg-white shadow-custom flex px-6">
      <nav className="flex-1 flex justify-between items-center gap-4">
        <div className="mb-2">
          <Image
            src="/mentora-logo.svg"
            alt="logo"
            width={120}
            height={120}
            className=""
          />
        </div>
        <div className="relative mx-0 my-3 cursor-pointer group">
          <span>Danh mục</span>
          <div className="absolute left-[-20px] pt-[30px] pb-[30px] z-10 hidden group-hover:block">
            <ul className="bg-white border border-gray-200 shadow-custom">
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#26b871]"
                >
                  CNTT
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#26b871]"
                >
                  Kế toán
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#26b871]"
                >
                  Thể thao
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#26b871]"
                >
                  Thiết kế đồ họa
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#26b871]"
                >
                  AI
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="flex-1 mx-0 my-3 cursor-pointer min-w-[18rem] h-[50px] border border-black rounded-[15px]">
          <form className="flex flex-row-reverse h-full overflow-hidden px-[18px] py-[14px]">
            <input
              type="text"
              placeholder="Tìm kiếm gì đó"
              className="flex-1 outline-none border-none bg-transparent ml-[14px]"
            />
            <button className="outline-none border-none bg-transparent">
              <Image src="/search.svg" alt="search" width={24} height={24} />
            </button>
          </form>
        </div>

        <ul className="flex items-center gap-4">
          <li className="relative mx-0 my-3 cursor-pointer group">
            <span>Giảng dạy</span>
            <div className="absolute right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block">
              <div className="bg-white min-w-[300px] p-5 shadow-custom">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate nisi, repellendus deleniti.
                </p>
                <div>
                  <Link
                    href="#!"
                    className="flex justify-center items-center tracking-[1px] border border-black text-black font-normal text-sm m-[3px] min-w-[80px] h-[40px] bg-transparent"
                  >
                    Thử ngay
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="relative mx-0 my-3 cursor-pointer group">
            <span>Khoá học của tôi</span>
            <div className="absolute right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block">
              <div className="bg-white min-w-[300px] p-5 shadow-custom">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Voluptate nisi, repellendus deleniti.
                </p>
                <div>
                  <Link
                    href="#!"
                    className="flex justify-center items-center tracking-[1px] border border-black text-white font-normal text-sm m-[3px] min-w-[80px] h-[40px] bg-black"
                  >
                    Thử ngay
                  </Link>
                </div>
              </div>
            </div>
          </li>
          <li className="mx-0 my-3 cursor-pointer">
            <Link href="#!">
              <Image src="/heart.svg" alt="heart" width={24} height={24} />
            </Link>
          </li>
          <li className="mx-0 my-3 cursor-pointer">
            <Link href="#!">
              <Image
                src="/shopping-cart.svg"
                alt="shopping-cart"
                width={24}
                height={24}
              />
            </Link>
          </li>
          <li className="mx-0 my-3 cursor-pointer">
            <Link href="#!">
              <Image src="/bell.svg" alt="bell" width={24} height={24} />
            </Link>
          </li>
          <li className="mx-0 my-3 cursor-pointer">
            <Image
              src="/avatar.jpg"
              alt="avatar"
              width={32}
              height={32}
              className="w-[32px] h-[32px] rounded-full object-cover"
            />
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
