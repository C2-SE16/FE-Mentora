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
            className="cursor-pointer"
          />
        </div>
        <div className="relative mx-0 my-3 cursor-pointer group">
          <span className="p-2 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#64f7b0] hover:rounded-xl">
            Danh mục
          </span>
          <div className="absolute left-[-20px] pt-[30px] pb-[30px] z-10 hidden group-hover:block">
            <ul className="bg-white border border-gray-200 shadow-custom">
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                >
                  CNTT
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                >
                  Kế toán
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                >
                  Thể thao
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                >
                  Thiết kế đồ họa
                </Link>
              </li>
              <li>
                <Link
                  href="#!"
                  className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
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

        <ul className="flex items-center">
          <li className="relative mx-0 my-3 cursor-pointer group">
            <span className="py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              Giảng dạy
            </span>
            <div className="absolute right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block">
              <div className="bg-white min-w-[300px] p-5 shadow-custom">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nisi,
                  repellendus deleniti.
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
            <span className="py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              Khoá học của tôi
            </span>
            <div className="absolute right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block">
              <div className="bg-white min-w-[300px] p-5 shadow-custom">
                <p>
                  Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptate nisi,
                  repellendus deleniti.
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
          <li className="mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
            <Link href="#!">
              <Image src="/heart.svg" alt="heart" width={24} height={24} />
            </Link>
          </li>
          <li className="mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
            <Link href="#!">
              <Image src="/shopping-cart.svg" alt="shopping-cart" width={24} height={24} />
            </Link>
          </li>
          <li className="mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
            <Link href="#!">
              <Image src="/bell.svg" alt="bell" width={24} height={24} />
            </Link>
          </li>
          <li className="relative mx-0 my-3 cursor-pointer group py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md ">
            <Image
              src="/avatar.jpg"
              alt="avatar"
              width={32}
              height={32}
              className="w-[32px] h-[32px] rounded-full object-cover"
            />
            <div className="absolute right-0 top-[22px] pt-[30px] pb-[30px] z-10 hidden group-hover:block">
              <ul className="bg-white border border-gray-200 shadow-custom">
                <li>
                  <Link
                    href="#!"
                    className="flex items-center gap-x-3 px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black"
                  >
                    <Image
                      src="/avatar.jpg"
                      alt="avatar"
                      width={50}
                      height={50}
                      className="w-[50px] h-[50px] rounded-full object-cover"
                    />
                    <div>
                      <h3 className="text-base font-bold hover:text-[#1dbe70]">Elliot Senpai</h3>
                      <p className="text-[10px] truncate max-w-[150px]">justAboutEmail@gmail.com</p>
                    </div>
                  </Link>
                </li>
                <li className="py-3">
                  <div className="h-[1px] w-full bg-gray-200"></div>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Khóa học của tôi
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Giảng dạy
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Giỏ hàng
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Danh sách yêu thích
                  </Link>
                </li>
                <li className="py-3">
                  <div className="h-[1px] w-full bg-gray-200"></div>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Hồ sơ
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Ảnh
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Xem hồ sơ công khai
                  </Link>
                </li>

                <li className="py-3">
                  <div className="h-[1px] w-full bg-gray-200"></div>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Bảo mật tài khoản
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Gói đăng ký
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Phương thức thanh toán
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Quyền riêng tư
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Cài đặt thông báo
                  </Link>
                </li>

                <li className="pt-3">
                  <div className="h-[1px] w-full bg-gray-200"></div>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="block px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-[#B11212] hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    Đăng xuất
                  </Link>
                </li>
              </ul>
            </div>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
