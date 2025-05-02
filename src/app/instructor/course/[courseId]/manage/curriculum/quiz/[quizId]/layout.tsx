'use client';

import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';

export default function QuizLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const courseId = params?.courseId as string;

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      <div className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <Link href={`/instructor/course/${courseId}/manage/curriculum`}>
              <Button variant="ghost" size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại
              </Button>
            </Link>
            <h1 className="text-xl font-semibold">Quản lý bài kiểm tra</h1>
          </div>
        </div>
      </div>
      <main className="flex-1">{children}</main>
    </div>
  );
}
