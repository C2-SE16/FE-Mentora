import Image from 'next/image';
import React, { useState, useEffect } from 'react';
import Link from 'next/link';

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      setIsLoading(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="h-auto md:h-[72px] bg-white shadow-custom relative">
      <div className="flex flex-col md:flex-row md:px-6">
        <div className="flex items-center justify-between px-6 py-4 md:hidden">
          <Link href="/" legacyBehavior>
            <a className="cursor-pointer">
              <Image src="/mentora-logo.svg" alt="logo" width={120} height={120} priority />
            </a>
          </Link>
          <button onClick={toggleMobileMenu} className="focus:outline-none">
            {mobileMenuOpen ? (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        <nav
          className={`flex-1 ${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col md:flex-row justify-between items-center gap-4 px-6 pb-4 md:pb-0 md:px-0`}
        >
          <div className="hidden md:block mb-2">
            <Link href="/" legacyBehavior>
              <a className="cursor-pointer">
                <Image src="/mentora-logo.svg" alt="logo" width={120} height={120} priority />
              </a>
            </Link>
          </div>
          {/* Categories Dropdown */}
          <div className="relative w-full md:w-auto text-center my-3 cursor-pointer group">
            <span className="block p-2 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#64f7b0] hover:rounded-xl">
              Danh mục
            </span>
            <div className="absolute left-0 top-6 md:left-[-20px] pt-[30px] pb-[30px] z-10 hidden group-hover:block w-full md:w-auto">
              <ul className="bg-white border border-gray-200 shadow-custom w-full rounded-md">
                <li>
                  <Link
                    href="#!"
                    className="flex justify-between items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    <span>CNTT</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="flex justify-between items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    <span>Kế toán</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="flex justify-between items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    <span>Thể thao</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="flex justify-between items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    <span>Thiết kế đồ họa</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
                <li>
                  <Link
                    href="#!"
                    className="flex justify-between items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd]"
                  >
                    <span>AI</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          {/* Search Bar */}
          <div className="w-full md:flex-1 mx-0 my-3 cursor-pointer h-[50px] border border-black rounded-[15px]">
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
          {/* Navigation Links */}
          <ul className="flex flex-col md:flex-row items-center w-full md:w-auto">
            <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group">
              <span className="block py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                Giảng dạy
              </span>
              <div className="absolute right-0 md:right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block w-full">
                <div className="bg-white min-w-[300px] p-5 shadow-custom rounded-md">
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
            <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group">
              <span className="block py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                Khoá học của tôi
              </span>
              <div className="absolute right-0 md:right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block w-full">
                <div className="bg-white min-w-[300px] p-5 shadow-custom rounded-md">
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
            <li className="w-full md:w-auto text-center mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              <Link href="#!">
                <Image src="/heart.svg" alt="heart" width={24} height={24} className="inline" />
                <span className="md:hidden ml-2">Yêu thích</span>
              </Link>
            </li>
            <li className="w-full md:w-auto text-center mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              <Link href="#!">
                <Image
                  src="/shopping-cart.svg"
                  alt="shopping-cart"
                  width={24}
                  height={24}
                  className="inline"
                />
                <span className="md:hidden ml-2">Giỏ hàng</span>
              </Link>
            </li>
            <li className="w-full md:w-auto text-center mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              <Link href="#!">
                <Image src="/bell.svg" alt="bell" width={24} height={24} className="inline" />
                <span className="md:hidden ml-2">Thông báo</span>
              </Link>
            </li>
            <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
              <Link href="/profile" className="flex items-center justify-center md:justify-start" >
                <Image
                  src="/avatar.jpg"
                  alt="avatar"
                  width={32}
                  height={32}
                  className="w-[32px] h-[32px] rounded-full object-cover"
                />
                <span className="md:hidden ml-2">Tài khoản</span>
              </Link>
              <div className="absolute right-0 top-[22px] md:top-[42px] pt-[30px] pb-[30px] hidden z-10 group-hover:block w-full md:w-auto">
                <ul className="bg-white border border-gray-200 shadow-custom w-full rounded-md">
                  <li>
                    <Link
                      href="/profile"
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
                        <h3 className="text-base font-bold hover:text-[#1dbe70] text-left">
                          Elliot Senpai
                        </h3>
                        <p className="text-[10px] truncate max-w-[150px]">
                          justAboutEmail@gmail.com
                        </p>
                      </div>
                    </Link>
                  </li>
                  <li className="py-3">
                    <div className="h-[1px] w-full bg-gray-200"></div>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Khóa học của tôi
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Giảng dạy
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Giỏ hàng
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
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
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Hồ sơ
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Ảnh
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
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
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Bảo mật tài khoản
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Gói đăng ký
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Phương thức thanh toán
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Quyền riêng tư
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#!"
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
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
                      className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-[#B11212] hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
                    >
                      Đăng xuất
                    </Link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
};

export default Header;
