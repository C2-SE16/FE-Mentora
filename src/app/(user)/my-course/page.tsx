'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function MyCourse() {
  const router = useRouter();

  useEffect(() => {
    // Mặc định redirect đến tab "learning"
    router.push('/my-course/learning');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-12 h-12 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
    </div>
  );
}
