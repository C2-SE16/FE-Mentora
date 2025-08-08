'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfileSidebar() {
  const { user, isLoading } = useAuth();
  const pathname = usePathname();
  console.log('user::', user);
  const isActive = (path: string) => {
    return pathname === path;
  };

  return (
    <div className="w-full md:w-1/4 border-r border-gray-200">
      <div className="p-6 flex flex-col items-center">
        {isLoading ? (
          <div className="w-40 h-40 rounded-full bg-gray-200 flex items-center justify-center mb-4">
            <div className="w-8 h-8 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
          </div>
        ) : (
          <Image
            src={user?.avatar || '/avatar.png'}
            alt="Avatar"
            width={40}
            height={40}
            className="w-40 h-40 bg-black rounded-full mb-4 object-cover"
          />
        )}

        <h2 className="text-xl font-bold text-center mb-8 font-oswald">{user?.fullName}</h2>

        <nav className="w-full">
          <ul className="space-y-2 text-gray-700">
            <li className="py-1">
              <Link
                href="/profile"
                className={`block font-normal ${isActive('/profile') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Hồ sơ
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/profile/photo"
                className={`block font-normal ${isActive('/profile/photo') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Ảnh
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/profile/public-profile"
                className={`block font-normal ${isActive('/profile/public-profile') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Xem hồ sơ công khai
              </Link>
            </li>
            <li className="py-1 border-t border-gray-200 mt-2 pt-2">
              <Link
                href="/profile/edit-account"
                className={`block font-normal ${isActive('/profile/edit-account') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Bảo mật tài khoản
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/profile/edit-subscription"
                className={`block font-normal ${isActive('/profile/edit-subscription') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Gói đăng ký
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/profile/edit-payment-method"
                className={`block font-normal ${isActive('/profile/edit-payment-method') ? 'text-[#1dbe70]' : 'hover:text-[#1dbe70]'}`}
              >
                Phương thức thanh toán
              </Link>
            </li>
            <li className="py-1">
              <Link href="/profile/edit-privacy" className="block font-normal hover:text-[#1dbe70]">
                Quyền riêng tư
              </Link>
            </li>
            <li className="py-1">
              <Link
                href="/profile/edit-notification-preferences"
                className="block font-normal hover:text-[#1dbe70]"
              >
                Cài đặt thông báo
              </Link>
            </li>
            <li className="py-1 border-t border-gray-200 mt-2 pt-2 text-[#B11212]">
              <Link
                href="/profile/close-account"
                className="block font-normal hover:text-[#e63030]"
              >
                Đóng tài khoản
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
}
