import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/interfaces/homepage-course';
import Button from '../Button/Button';
import { StarRating } from './StarRating';

interface CourseCardProps {
  course: Course;
  index: number;
  onAddToCart: (courseId: string, e: React.MouseEvent) => void;
}

const CourseCard = ({ course, index, onAddToCart }: CourseCardProps) => {
  const isLastInRow = (index + 1) % 4 === 0;
  const popupPosition = isLastInRow ? 'right-full mr-4' : 'left-full ml-4';

  return (
    <div className="w-full group relative">
      <Link href={`/courses/${course.id}`}>
        <div className="relative overflow-hidden rounded-lg w-full aspect-video cursor-pointer">
          <Image
            src={course.image}
            alt={course.title}
            width={330}
            height={200}
            className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
          />
        </div>
        <div className="info">
          <div className="head">
            <Link
              href={`/courses/${course.id}`}
              className="font-bold text-base sm:text-lg mt-2 text-[#303141] line-clamp-2"
            >
              {course.title}
            </Link>
          </div>
          <p className="mt-1 text-sm sm:text-base">{course.instructor}</p>
          <div className="flex items-center gap-2">
            {course.rating}
            <StarRating rating={course.rating} />
            <span className="text-[#595c73] text-sm">({course.reviews || 0})</span>
          </div>
          <div className="flex gap-x-4 text-sm sm:text-base mt-1">
            <span className="">{course.currentPrice}</span>
            <span className="line-through">{course.originalPrice}</span>
          </div>
          {course.isBestSeller && (
            <Button
              href={`/courses/${course.id}`}
              backgroundColor="#3A10E5"
              textColor="#ffffff"
              minWidth={90}
              className="mt-3 text-sm sm:text-base"
            >
              bán chạy
            </Button>
          )}
        </div>
      </Link>

      <div
        className={`absolute ${popupPosition} top-0 w-[280px] sm:w-[320px] bg-white rounded-lg shadow-xl opacity-0 invisible transform translate-x-2 transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 border border-gray-200`}
      >
        <div
          className={`absolute ${
            isLastInRow ? 'top-8 -right-[10px] rotate-90' : 'top-12 -left-[10px] -rotate-90'
          }`}
        >
          <Image src="/dropdown-accessory.svg" alt="dropdown" width={20} height={20} />
        </div>
        <div className="p-4">
          <h3 className="font-bold text-base sm:text-lg text-gray-800">{course.title}</h3>
          <p className="text-gray-600 text-xs sm:text-sm mt-1">Đã cập nhật {course.updatedDate}</p>

          <div className="mt-2 text-gray-700">
            <div className="flex items-center text-xs sm:text-sm">
              <span>
                Tổng số {course.totalHours} giờ • {course.level} •{' '}
                {course.subtitle ? 'Phụ đề' : 'Không phụ đề'}
              </span>
            </div>

            <p className="mt-3 text-xs sm:text-sm line-clamp-3">{course.description}</p>

            <div className="mt-3">
              {course.categories &&
                course.categories.map((category: any, idx: any) => (
                  <div key={idx} className="flex items-center gap-x-2 text-xs sm:text-sm mt-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4 text-green-600"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    <span>{category.name}</span>
                  </div>
                ))}
            </div>

            <div className="mt-4">
              <button
                className="bg-[#3A10E5] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
                onClick={(e) => onAddToCart(course.id, e)}
              >
                Thêm vào giỏ hàng
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
