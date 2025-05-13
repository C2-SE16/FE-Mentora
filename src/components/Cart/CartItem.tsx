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
  const displayPrice = () => {
    // Log ra để debug
    console.log(`Displaying price for ${course.title}:`, course.price);
    
    // Kiểm tra price là chuỗi (ví dụ: "129.99")
    if (typeof course.price === 'string') {
      return formatCurrency(parseFloat(course.price) || 0);
    }
    
    // Kiểm tra price là số trực tiếp
    if (typeof course.price === 'number') {
      return formatCurrency(course.price);
    }
    
    // Kiểm tra cấu trúc price.d là mảng (trường hợp course.price là kiểu Price)
    if (course.price && typeof course.price === 'object' && 'd' in course.price && Array.isArray(course.price.d) && course.price.d.length > 0) {
      return formatCurrency(course.price.d[0] || 0);
    }
    
    // Trường hợp price là đối tượng nhưng không phải kiểu Price đã định nghĩa
    if (course.price && typeof course.price === 'object') {
      // Sử dụng ký hiệu chỉ mục để truy cập các thuộc tính có thể có
      const priceObj = course.price as Record<string, any>;
      const possiblePrice = 
        priceObj['price'] || 
        priceObj['amount'] || 
        priceObj['value'] || 
        0;
        
      return formatCurrency(possiblePrice);
    }
    
    // Mặc định hiển thị 0
    return formatCurrency(0);
  };

  // Lấy tên instructor
  const getInstructorName = (): string => {
    if (!course.tbl_instructors) return 'Chưa có thông tin';
    
    // Kiểm tra nếu có instructorName trực tiếp
    if ('instructorName' in course.tbl_instructors && course.tbl_instructors.instructorName) {
      return course.tbl_instructors.instructorName as string;
    }
    
    // Kiểm tra nếu có user.fullName
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
        <p className="text-sm text-gray-600">
          Giảng viên: {getInstructorName()}
        </p>
        <p className="text-primary font-semibold">{displayPrice()}</p>
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
