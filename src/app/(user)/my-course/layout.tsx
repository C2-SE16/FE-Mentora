'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useEffect, useState } from 'react';

export default function MyCourseLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [activeTab, setActiveTab] = useState('learning');

  useEffect(() => {
    if (pathname?.includes('/learning')) {
      setActiveTab('learning');
    } else if (pathname?.includes('/favorite-list')) {
      setActiveTab('favorite');
    } else if (pathname?.includes('/archived')) {
      setActiveTab('archived');
    }
  }, [pathname]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  return (
    <div>
      <div className="px-[16px] grid grid-cols-6 gap-4 bg-[#002333] h-[155px]">
        <div className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4">
          <h1 className="font-oswald text-[40px] font-normal text-[#FFF] py-4">Khóa học của tôi</h1>
          <div className="col-span-6 col-start-1">
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="bg-[#002333] text-white px-2 space-x-4">
                <Link href="/my-course/learning">
                  <TabsTrigger
                    value="learning"
                    className={`relative py-2 px-4 font-semibold ${activeTab === 'learning' ? 'border-b-2 border-white' : ''}`}
                  >
                    Tất cả khóa học
                  </TabsTrigger>
                </Link>

                <Link href="/my-course/favorite-list">
                  <TabsTrigger
                    value="favorite"
                    className={`relative py-2 px-4 font-semibold ${activeTab === 'favorite' ? 'border-b-2 border-white' : ''}`}
                  >
                    Danh sách yêu thích
                  </TabsTrigger>
                </Link>

                <Link href="/my-course/archived">
                  <TabsTrigger
                    value="archived"
                    className={`relative py-2 px-4 font-semibold ${activeTab === 'archived' ? 'border-b-2 border-white' : ''}`}
                  >
                    Lưu trữ
                  </TabsTrigger>
                </Link>
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
