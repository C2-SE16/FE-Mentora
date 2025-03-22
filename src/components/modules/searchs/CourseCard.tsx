import { FC } from 'react';
import Image from 'next/image';

interface CourseCardProps {
  course: {
    id: string;
    title: string;
    instructor: string;
    rating: number;
    ratingCount: number;
    duration: string;
    price: number;
    thumbnail: string;
  };
}

const CourseCard: FC<CourseCardProps> = ({ course }) => {
  return (
    <div className="flex gap-4 p-4 border-b">
      <div className="relative w-48 h-32 flex-shrink-0">
        <Image src={course.thumbnail} alt={course.title} fill className="object-cover rounded" />
      </div>
      <div className="flex-1">
        <h3 className="font-semibold text-lg">{course.title}</h3>
        <p className="text-gray-600">{course.instructor}</p>
        <div className="flex items-center gap-2 mt-2">
          <span className="font-bold">{course.rating}</span>
          <span>⭐</span>
          <span className="text-gray-600">({course.ratingCount} đánh giá)</span>
        </div>
        <p className="text-sm text-gray-500 mt-1">{course.duration}</p>
        <p className="font-bold mt-2">₫{course.price.toLocaleString()}</p>
      </div>
    </div>
  );
};

export default CourseCard;
