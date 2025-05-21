'use client';

import Image from 'next/image';
import React, { useState, useEffect, useRef, useMemo } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '@/apis/api';
import { useAuth } from '@/contexts/AuthContext';
import { InstructorService } from '@/apis/instructorService';
import SubHeader from '@/components/Header/SubHeader';

const Header = () => {
  const { user, isLoggedIn, isLoading, logout, refetchUser } = useAuth();
  const router = useRouter();
  const [activeSiteWideVoucher, setActiveSiteWideVoucher] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [avatarKey, setAvatarKey] = useState(Date.now());
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  const checkActiveSiteWideVoucher = async () => {
    try {
      const response = await api.get('voucher/active-site-voucher');
      if (response.data.data.success && response.data.data.hasActiveVoucher) {
        setActiveSiteWideVoucher(response.data.data.voucher);
      } else {
        setActiveSiteWideVoucher(null);
      }
    } catch (error) {
      console.log('Error checking active voucher', error);
    }
  };

  useEffect(() => {
    checkActiveSiteWideVoucher();
  }, []);

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

  useEffect(() => {
    // Lắng nghe sự kiện đăng nhập thành công
    const handleLoginSuccess = () => {
      console.log('Login success event detected in Header');
      refetchUser();
    };

    window.addEventListener('user-login-success', handleLoginSuccess);

    return () => {
      window.removeEventListener('user-login-success', handleLoginSuccess);
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

    // Sử dụng window.location.href thay vì router.push để đảm bảo trang được tải lại
    window.location.href = '/';
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
        router.push('/instructor/manage/courses');
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

  const calculateTimeRemaining = (endDateStr: string) => {
    const now = new Date();
    const endDate = new Date(endDateStr);
    const diffTime = endDate.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 0) {
      return 'Hết hạn';
    } else if (diffDays < 30) {
      return `${diffDays} ngày nữa`;
    } else if (diffDays < 365) {
      const months = Math.floor(diffDays / 30);
      return `${months} tháng nữa`;
    } else {
      const years = Math.floor(diffDays / 365);
      const remainingMonths = Math.floor((diffDays % 365) / 30);

      if (remainingMonths > 0) {
        return `${years} năm ${remainingMonths} tháng nữa`;
      } else {
        return `${years} năm nữa`;
      }
    }
  };

  const timeRemaining = useMemo(() => {
    if (!activeSiteWideVoucher || !activeSiteWideVoucher.endDate) return 'Không xác định';
    return calculateTimeRemaining(activeSiteWideVoucher.endDate);
  }, [activeSiteWideVoucher]);

  return (
    <>
      {/* Promo banner */}
      {activeSiteWideVoucher && (
        <div className="bg-[#002333] py-3 relative border-b border-gray-700 shadow-md">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3">
                <div className="flex items-center">
                  <span className="inline-flex items-center justify-center p-1 bg-red-500 rounded-full w-5 h-5 mr-2">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 text-white"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  </span>
                  <span className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-black font-bold px-2 py-1 rounded text-xs uppercase tracking-wider">
                    Flash Sale
                  </span>
                </div>
                <p className="text-white text-center sm:text-left font-medium">
                  <span className="inline-block animate-pulse bg-white/10 rounded px-1.5 py-0.5 mr-1 text-yellow-300 font-semibold">
                    {activeSiteWideVoucher.discountType === 'Percentage'
                      ? `${activeSiteWideVoucher.discountValue}%`
                      : `₫${Number(activeSiteWideVoucher.discountValue).toLocaleString()}`}
                  </span>
                  giảm giá cho tất cả khóa học!
                </p>
              </div>

              <div className="flex items-center mt-2 sm:mt-0 gap-2">
                <div className="flex items-center space-x-1 bg-white/5 backdrop-blur-sm rounded-lg px-3 py-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 text-yellow-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-300 font-medium">Kết thúc sau</span>
                    <span className="text-xs font-bold text-yellow-300">{timeRemaining}</span>
                  </div>
                </div>

                <Link
                  href="/courses"
                  className="group ml-2 px-4 py-1.5 bg-yellow-500 text-gray-900 font-bold rounded-lg text-sm hover:bg-yellow-400 transition-all duration-200 flex items-center"
                >
                  Xem ngay
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </Link>

                <button
                  onClick={() => setActiveSiteWideVoucher(null)}
                  className="ml-1 text-gray-400 hover:text-white p-1 bg-white/5 hover:bg-white/10 rounded-full transition-colors"
                  aria-label="Đóng thông báo"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
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
                          src={`${user?.avatar || '/avatar.png'}?v=${avatarKey}`}
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
                              src={`${user?.avatar || '/avatar.png'}?v=${avatarKey}`}
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
                            href="/profile/payment-methods"
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
                            <button
                              onClick={handleLogout}
                              className="flex items-center px-5 py-2.5 min-w-[250px] tracking-[0.5px] text-black hover:text-[#1dbe70] hover:bg-[#c5f3dd] text-left"
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
