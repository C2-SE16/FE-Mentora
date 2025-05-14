'use client';

import { Button } from '@/components/ui/button';
import { ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { Card } from '@/components/ui/card';

export default function EmptyState() {
  return (
    <div className="container py-12">
      <Card className="p-8 max-w-3xl mx-auto text-center">
        <div className="flex justify-center mb-6">
          <ShoppingCart className="h-16 w-16 text-gray-400" />
        </div>
        <h2 className="text-2xl font-bold mb-3">Giỏ hàng của bạn đang trống</h2>
        <p className="text-gray-600 mb-6">
          Bạn chưa thêm khóa học nào vào giỏ hàng. Khám phá các khóa học của chúng tôi và bắt đầu học ngay hôm nay!
        </p>
        <Link href="/">
          <Button size="lg">Khám phá khóa học</Button>
        </Link>
      </Card>
    </div>
  );
} 