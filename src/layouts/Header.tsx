'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/apis/api';
import { useAuth } from '@/contexts/AuthContext';
import { InstructorService } from '@/apis/instructorService';
import SubHeader from '@/components/Header/SubHeader';

const Header = () => {
  const { user, isLoggedIn, isLoading, logout, refetchUser } = useAuth();
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutSide = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setShowResults(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutSide);
    return () => {
      document.removeEventListener('mousedown', handleClickOutSide);
    };
  }, []);

  useEffect(() => {
    const handleAvatarUpdate = () => {
      // Force refetch user data
      refetchUser();
      // Update the key to force re-render of the avatar images
      setAvatarKey(Date.now());
    };

    window.addEventListener('avatar-updated', handleAvatarUpdate);

    return () => {
      window.removeEventListener('avatar-updated', handleAvatarUpdate);
    };
  }, [refetchUser]);

  const debounce = <T extends (...args: any[]) => any>(func: T, delay: number) => {
    let timer: NodeJS.Timeout;
    return function (this: any, ...args: Parameters<T>) {
      clearTimeout(timer);
      timer = setTimeout(() => func.apply(this, args), delay);
    };
  };

  const searchCourses = debounce(async (query) => {
    if (!query || query.trim() === '') {
      setSearchResults([]);
      setShowResults(false);
      return;
    }

    try {
      const token = localStorage.getItem('accessToken');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      if (token && query.trim().length > 1) {
        try {
          await api.post(
            'elasticsearch/search-history',
            {
              content: query.trim(),
            },
            { headers }
          );
        } catch (error) {
          console.error('Error searching history:', error);
        }
      }

      const response = await api.get('courses/search', {
        params: {
          query,
        },
        headers,
      });
      console.log('response', response);
      setSearchResults(response.data.data.courses || []);
      setShowResults(true);
    } catch (error) {
      console.error('Error searching courses:', error);
    }
  }, 300);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchQuery(value);
    searchCourses(value);
  };

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?query=${encodeURIComponent(searchQuery)}`);
      setShowResults(false);
    }
  };

  useEffect(() => {
    const handleRouteChange = () => {
      setMobileMenuOpen(false);
      // setIsLoading(false);
    };

    window.addEventListener('popstate', handleRouteChange);
    return () => {
      window.removeEventListener('popstate', handleRouteChange);
    };
  }, []);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem('accessToken');
    logout();

    // Dispatch custom event để thông báo logout cho các component khác
    window.dispatchEvent(new Event('user-logout'));

    router.push('/');
  };

  const handleTeachingClick = async (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (!isLoggedIn) {
      // Nếu chưa đăng nhập, chuyển đến trang đăng nhập
      router.push('/login');
      return;
    }

    try {
      // Kiểm tra trạng thái instructor
      const response = await InstructorService.checkInstructorStatus();

      // Kiểm tra giá trị isInstructor từ response
      if (response && response.isInstructor === true) {
        // Nếu đã là instructor, chuyển đến dashboard
        router.push('/instructor/courses');
      } else {
        // Nếu chưa là instructor hoặc có lỗi, chuyển đến trang đăng ký
        router.push('/instructor/register');
      }
    } catch (error) {
      console.error('Lỗi kiểm tra trạng thái instructor:', error);
      // Mặc định chuyển đến trang đăng ký nếu có lỗi
      router.push('/instructor/register');
    }
  };

  return (
    <>
      <header className="h-auto md:h-[72px] bg-white shadow-custom relative">
        <div className="flex flex-col md:flex-row md:px-6">
          <div className="flex items-center justify-between px-6 py-4 md:hidden">
            <Link href="/" legacyBehavior className="cursor-pointer">
              <Image src="/mentora-logo.svg" alt="logo" width={120} height={120} priority />
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
                <Image
                  src="/mentora-logo.svg"
                  alt="logo"
                  width={120}
                  height={120}
                  priority
                  className="cursor-pointer"
                />
              </Link>
            </div>
            {/* Categories Dropdown */}
            <div className="relative w-full md:w-auto text-center my-3 cursor-pointer group">
              <span className="block p-2 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-xl">
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
            <div
              className="w-full md:flex-1 mx-0 my-3 cursor-pointer h-[50px] border border-black rounded-[15px] relative"
              ref={searchRef}
            >
              <form
                className="flex flex-row-reverse h-full overflow-hidden px-[18px] py-[14px]"
                onSubmit={handleSearchSubmit}
              >
                <input
                  type="text"
                  placeholder="Tìm kiếm gì đó"
                  className="flex-1 outline-none border-none bg-transparent ml-[14px]"
                  value={searchQuery}
                  onChange={handleSearchChange}
                  onFocus={() => searchQuery && setShowResults(true)}
                />
                <button type="submit" className="outline-none border-none bg-transparent">
                  {isLoading ? (
                    <div className="w-6 h-6 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
                  ) : (
                    <Image src="/search.svg" alt="search" width={24} height={24} />
                  )}
                </button>
              </form>

              {/* Search Results Dropdown */}
              {showResults && searchResults.length > 0 && (
                <div className="absolute left-0 right-0 top-[55px] bg-white shadow-lg rounded-md z-20 max-h-[400px] overflow-y-auto">
                  <ul className="py-2">
                    {searchResults.map((course: any) => (
                      <li key={course.courseId} className="hover:bg-[#f5f5f5]">
                        <Link
                          href={`/search?query=${encodeURIComponent(searchQuery)}`}
                          className="block px-4 py-2 text-gray-800 hover:text-[#1dbe70]"
                          onClick={() => setShowResults(false)}
                        >
                          <div className="flex items-center">
                            {course.thumbnail ? (
                              <Image
                                src={course.thumbnail}
                                alt={course.title}
                                width={40}
                                height={30}
                                className="object-cover rounded mr-3"
                              />
                            ) : (
                              <div className="w-[40px] h-[30px] bg-gray-200 rounded mr-3 flex items-center justify-center">
                                <span className="text-xs">No img</span>
                              </div>
                            )}
                            <div className="flex-1">
                              <h4 className="font-medium text-sm">{course.title}</h4>
                              <p className="text-xs text-gray-500 truncate">
                                <strong>Khóa học</strong>
                                {'  '}
                                {course.tbl_instructors?.instructorName || 'Unknown instructor'}
                              </p>
                            </div>
                          </div>
                        </Link>
                      </li>
                    ))}
                  </ul>
                  <div className="px-4 py-2 border-t border-gray-200">
                    <Link
                      href={`/search?query=${encodeURIComponent(searchQuery)}`}
                      className="text-[#1dbe70] hover:underline text-sm block py-1 text-center"
                      onClick={() => setShowResults(false)}
                    >
                      Xem tất cả kết quả
                    </Link>
                  </div>
                </div>
              )}
            </div>
            {/* Navigation Links */}
            <ul className="flex flex-col md:flex-row items-center w-full md:w-auto gap-x-2">
              {isLoading ? (
                <li className="w-full md:w-auto text-center mx-0 my-3">
                  <div className="w-6 h-6 border-t-2 border-[#1dbe70] rounded-full animate-spin mx-auto"></div>
                </li>
              ) : isLoggedIn ? (
                <>
                  <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group">
                    <span className="block py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                      Giảng dạy
                    </span>
                    <div className="absolute right-0 md:right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block w-full">
                      <div className="bg-white min-w-[300px] p-5 shadow-custom rounded-md">
                        <p>
                          Trở thành giảng viên tại Mentora và chia sẻ kiến thức của bạn đến học viên
                          trên toàn thế giới. Bắt đầu tạo khóa học và tận hưởng thu nhập bổ sung.
                        </p>
                        <div className="mt-4">
                          <Link
                            href="#!"
                            onClick={handleTeachingClick}
                            className="flex justify-center items-center tracking-[1px] border border-black text-white font-normal text-sm m-[3px] min-w-[80px] h-[40px] bg-[#1dbe70] hover:bg-[#18a862] transition-colors"
                          >
                            Bắt đầu
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
                    <Link href="/favorite-list">
                      <Image
                        src="/heart.svg"
                        alt="heart"
                        width={24}
                        height={24}
                        className="inline"
                      />
                    </Link>
                  </li>
                  <li className="w-full md:w-auto text-center mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                    <Link href="/cart" className="cursor-pointer">
                      <Image
                        src="/shopping-cart.svg"
                        alt="shopping-cart"
                        width={24}
                        height={24}
                        className="cursor-pointer"
                      />
                    </Link>
                  </li>
                  <li className="w-full md:w-auto text-center mx-0 my-3 cursor-pointer py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                    <Link href="#!">
                      <Image src="/bell.svg" alt="bell" width={24} height={24} className="inline" />
                      <span className="md:hidden ml-2">Thông báo</span>
                    </Link>
                  </li>
                  <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                    <Link
                      href="/profile"
                      className="flex items-center justify-center md:justify-start"
                    >
                      {isLoading ? (
                        <div className="w-[32px] h-[32px] rounded-full bg-gray-200 flex items-center justify-center">
                          <div className="w-4 h-4 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
                        </div>
                      ) : (
                        <Image
                          src={`${user?.avatar || '/avatar.jpg'}?v=${avatarKey}`}
                          alt="avatar"
                          width={32}
                          height={32}
                          className="w-[32px] h-[32px] rounded-full object-cover"
                          key={`nav-avatar-${avatarKey}`}
                        />
                      )}
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
                              src={`${user?.avatar || '/avatar.jpg'}?v=${avatarKey}`}
                              alt="avatar"
                              width={50}
                              height={50}
                              className="w-[50px] h-[50px] rounded-full object-cover"
                              key={`dropdown-avatar-${avatarKey}`}
                            />
                            <div>
                              <h3 className="text-base font-bold hover:text-[#1dbe70] text-left">
                                {user?.fullName}
                              </h3>
                              <p className="text-[10px] truncate max-w-[150px]">{user?.email}</p>
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
                            onClick={handleTeachingClick}
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
                          <div className="flex items-center gap-4">
                            <Link href="/cart" className="cursor-pointer">
                              <Image
                                src="/shopping-cart.svg"
                                alt="shopping-cart"
                                width={24}
                                height={24}
                                className="cursor-pointer"
                              />
                            </Link>
                            <button
                              onClick={handleLogout}
                              className="bg-[#1dbe70] text-white px-4 py-2 rounded-lg hover:bg-[#18a862] transition-colors"
                            >
                              Đăng xuất
                            </button>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </li>
                </>
              ) : (
                <>
                  <li className="relative w-full md:w-auto text-center mx-0 my-3 cursor-pointer group">
                    <span className="block py-2 px-3 transition-all duration-200 hover:text-[#1dbe70] hover:bg-[#c6f1dd] hover:rounded-md">
                      Giảng dạy
                    </span>
                    <div className="absolute right-0 md:right-0 pt-[30px] pb-[30px] z-10 hidden group-hover:block w-full">
                      <div className="bg-white min-w-[300px] p-5 shadow-custom rounded-md">
                        <p>
                          Trở thành giảng viên tại Mentora và chia sẻ kiến thức của bạn đến học viên
                          trên toàn thế giới. Bắt đầu tạo khóa học và tận hưởng thu nhập bổ sung.
                        </p>
                        <div className="mt-4">
                          <Link
                            href="#!"
                            onClick={handleTeachingClick}
                            className="flex justify-center items-center tracking-[1px] border border-black text-white font-normal text-sm m-[3px] min-w-[80px] h-[40px] bg-[#1dbe70] hover:bg-[#18a862] transition-colors"
                          >
                            Đăng ký giảng dạy
                          </Link>
                        </div>
                      </div>
                    </div>
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
                  <li className="w-full md:w-auto text-center mx-0 my-3">
                    <Link
                      href="/login"
                      className="block py-2 px-4 text-black rounded-md transition-all duration-200 border border-black"
                    >
                      Đăng nhập
                    </Link>
                  </li>
                  <li className="w-full md:w-auto text-center mx-0 my-3">
                    <Link
                      href="/register"
                      className="block py-2 px-4 border border-[#00FF84] bg-[#00FF84] text-black rounded-md transition-all duration-200 hover:bg-[#18a35e]"
                    >
                      Đăng kí
                    </Link>
                  </li>
                  <li>
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
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>
      <SubHeader />
    </>
  );
};

export default Header;
