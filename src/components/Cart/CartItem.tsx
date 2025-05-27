import { Course } from '@/types/courses';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import Image from 'next/image';
import { Checkbox } from '@/components/ui/checkbox';
import { ReactNode } from 'react';

interface CartItemProps {
  course: Course;
  onRemove: (courseId: string) => void;
  isSelected: boolean;
  onSelectChange: (courseId: string, isSelected: boolean) => void;
}

export function CartItem({ course, onRemove, isSelected, onSelectChange }: CartItemProps) {
  // Xử lý hiển thị giá
  const getFinalPrice = () => {
    // Kiểm tra nếu có currentPrice trực tiếp
    if (course.finalPrice !== undefined) {
      return Number(course.finalPrice) || 0;
    }

    // Fallback về price logic cũ
    if (typeof course.originalPrice === 'string') {
      return parseFloat(course.originalPrice) || 0;
    }

    if (typeof course.originalPrice === 'number') {
      return course.originalPrice;
    }

    if (
      course.price &&
      typeof course.price === 'object' &&
      'd' in course.price &&
      Array.isArray(course.price.d) &&
      course.price.d.length > 0
    ) {
      return course.price.d[0] || 0;
    }

    if (course.price && typeof course.price === 'object') {
      const priceObj = course.price as Record<string, any>;
      return priceObj['price'] || priceObj['amount'] || priceObj['value'] || 0;
    }

    return 0;
  };

  const getOriginalPrice = () => {
    // Kiểm tra nếu có originalPrice trực tiếp
    if (course.originalPrice !== undefined) {
      return Number(course.originalPrice) || 0;
    }

    // Nếu không có originalPrice, return finalPrice (không có discount)
    return getFinalPrice();
  };

  const finalPrice = getFinalPrice();
  const originalPrice = getOriginalPrice();
  const hasDiscount = finalPrice < originalPrice;

  // Lấy tên instructor
  const getInstructorName = (): string => {
    if (!course.tbl_instructors) return 'Chưa có thông tin';

    if ('instructorName' in course.tbl_instructors && course.tbl_instructors.instructorName) {
      return course.tbl_instructors.instructorName as string;
    }

    if (course.tbl_instructors.user?.fullName) {
      return course.tbl_instructors.user.fullName;
    }

    return 'Chưa có thông tin';
  };

  return (
    <div className="flex gap-4 border-b py-4">
      <div className="flex items-center">
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelectChange(course.courseId, !!checked)}
          id={`select-${course.courseId}`}
          className="mr-2"
        />
      </div>
      <div className="relative w-32 h-24">
        <Image
          src={course.thumbnail || '/images/placeholder.png'}
          alt={course.title || 'Khóa học'}
          fill
          className="object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold">{course.title}</h3>
        <p className="text-sm text-gray-600">Giảng viên: {getInstructorName()}</p>
        <div className="flex items-center gap-2">
          <p className="text-primary font-semibold text-lg">{formatCurrency(finalPrice)}</p>
          {hasDiscount && (
            <>
              <p className="text-gray-500 line-through text-sm">{formatCurrency(originalPrice)}</p>
            </>
          )}
        </div>
      </div>
      <Button
        variant="ghost"
        onClick={() => onRemove(course.courseId)}
        className="text-red-500 hover:text-red-700"
      >
        Xóa
      </Button>
    </div>
  );
}
