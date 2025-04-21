import { Course } from '@/types/courses';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/utils/format';
import Image from 'next/image';

interface CartItemProps {
  course: Course;
  onRemove: (courseId: string) => void;
}

export function CartItem({ course, onRemove }: CartItemProps) {
  return (
    <div className="flex gap-4 border-b py-4">
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
        <p className="text-sm text-gray-600">
          Giảng viên: {course.tbl_instructors?.instructorName || 'Chưa có thông tin'}
        </p>
        <p className="text-primary font-semibold">
          {formatCurrency(course.price?.d?.[0] || 0)}
        </p>
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