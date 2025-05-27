import Image from 'next/image';
import Link from 'next/link';
import { Course } from '@/interfaces/homepage-course';
import Button from '../Button/Button';
import { StarRating } from './StarRating';
import { useEffect, useState } from 'react';
import { checkCourseAccess, CourseAccessResponse, ensureString } from '@/apis/courseAccessService';
import dynamic from 'next/dynamic';

interface CourseCardProps {
  course: Course;
  index: number;
  onAddToCart: (courseId: string, e: React.MouseEvent) => void;
}

// Ảnh mặc định khi không có ảnh khóa học
const DEFAULT_COURSE_IMAGE = '/images/default-course-image.jpg';

// Sử dụng dynamic import với ssr: false để tránh lỗi NextRouter not mounted
const CourseCardComponent = ({ course, index, onAddToCart }: CourseCardProps) => {

  const isLastInRow = (index + 1) % 4 === 0;
  const popupPosition = isLastInRow ? 'right-full mr-4' : 'left-full ml-4';
  const [courseAccess, setCourseAccess] = useState<CourseAccessResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Đảm bảo course.id hoặc course.courseId không undefined
  const courseId = ensureString(course.id || course.courseId);

  // Xác định ảnh khóa học, sử dụng ảnh mặc định nếu không có
  const courseImage: string = course.image || course.thumbnail || DEFAULT_COURSE_IMAGE;

  // Logic kiểm tra quyền truy cập khóa học
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchCourseAccess = async () => {
      if (!courseId) {
        return;
      }

      try {
        setLoading(true);
        setError(null);

        const result = await checkCourseAccess(courseId);

        if (result.success && isMounted) {
          setCourseAccess(result.data);

          // Kiểm tra rõ ràng quyền truy cập
          if (result.data.isInstructor) {
            console.log('Người dùng là instructor của khóa học này');
          } else if (result.data.isEnrolled) {
            console.log('Người dùng đã mua khóa học này');
          } else {
            console.log('Người dùng chưa mua khóa học này');
          }
        } else if (isMounted) {
          console.error('API trả về lỗi:', result.message);
          setError(result.message || 'Lỗi không xác định');
        }
      } catch (error) {
        console.error('Lỗi khi gọi API kiểm tra quyền truy cập:', error);
        if (isMounted) {
          setError('Đã xảy ra lỗi khi kiểm tra quyền truy cập');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchCourseAccess();

    // Cleanup khi component unmount
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, [courseId]);

  // Xử lý navigation sử dụng window.location thay vì router
  const navigateTo = (path: string) => {
    window.location.href = path;
  };

  const handleCourseAction = (e: React.MouseEvent) => {
    e.preventDefault();
    if (!courseAccess) {
      onAddToCart(courseId, e);
      return;
    }

    if (courseAccess.isInstructor) {
      navigateTo(`/instructor/course/${courseId}/manage/goals`);
    } else if (courseAccess.isEnrolled) {
      navigateTo(`/courses/${courseId}`);
    } else {
      onAddToCart(courseId, e);
    }
  };

  const getActionButton = () => {

    if (loading) {
      return (
        <button
          className="bg-[#f3f4f6] text-gray-500 py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
          disabled
        >
          Đang tải...
        </button>
      );
    }

    if (error) {
      return (
        <button
          className="bg-[#29cc60] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
          onClick={(e) => onAddToCart(courseId, e)}
        >
          Thêm vào giỏ hàng
        </button>
      );
    }

    if (!courseAccess) {
      return (
        <button
          className="bg-[#29cc60] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
          onClick={(e) => onAddToCart(courseId, e)}
        >
          Thêm vào giỏ hàng
        </button>
      );
    }

    if (courseAccess.isInstructor) {
      return (
        <button
          className="bg-[#1e40af] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
          onClick={handleCourseAction}
        >
          Quản lý khóa học
        </button>
      );
    }

    if (courseAccess.isEnrolled) {
      return (
        <button
          className="bg-[#6366f1] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
          onClick={handleCourseAction}
        >
          Vào học ngay
        </button>
      );
    }

    return (
      <button
        className="bg-[#29cc60] text-white py-2 px-4 rounded-md w-full font-medium text-sm sm:text-base"
        onClick={(e) => onAddToCart(courseId, e)}
      >
        Thêm vào giỏ hàng
      </button>
    );
  };

  return (
    <div className="w-full group relative">
      <div>
        <div className="relative overflow-hidden rounded-lg w-full aspect-video cursor-pointer">
          <Link href={`/courses/${courseId}`}>
            <Image
              src={courseImage}
              alt={course.title || 'Khóa học'}
              width={330}
              height={200}
              className="object-cover transition-transform duration-500 group-hover:scale-110 w-full h-full"
            />
          </Link>
        </div>
        <div className="info">
          <div className="head">
            <Link
              href={`/courses/${courseId}`}
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
            <span className="">{course.currentPrice || course.price}</span>
            <span className="line-through">{course.originalPrice}</span>
          </div>
          {course.isBestSeller ? (
            <Button
              href={`/courses/${courseId}`}
              backgroundColor="#29cc60"
              textColor="#ffffff"
              minWidth={90}
              className="mt-3 text-sm sm:text-base"
            >
              Bán chạy
            </Button>
          ) : //  course.isNew ||
          course.createdAt &&
            new Date(course.createdAt).getTime() >
              new Date().getTime() - 7 * 24 * 60 * 60 * 1000 ? (
            <Button
              href={`/courses/${courseId}`}
              backgroundColor="#807be1"
              textColor="#ffffff"
              minWidth={90}
              className="mt-3 text-sm sm:text-base"
            >
              Mới
            </Button>
          ) : null}
        </div>
      </div>

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

            <div className="mt-4">{getActionButton()}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Sử dụng dynamic import với ssr: false để tránh lỗi NextRouter not mounted
const CourseCard = dynamic(() => Promise.resolve(CourseCardComponent), { ssr: false });

export default CourseCard;
