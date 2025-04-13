'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star, X } from 'lucide-react';
import Link from 'next/link';
import CourseDescription from '@/components/modules/course-detail/components/CourseDescription';
import CourseSidebar from '@/components/modules/course-detail/components/CourseSidebar';
import CourseSectionMenu from '@/components/modules/course-detail/components/CourseSectionMenu';
import CommentInput from '@/components/modules/course-detail/components/CommentInput';
import CommentCard from '@/components/modules/course-detail/components/CommentCard';
import CourseContent from '@/components/modules/course-detail/components/CourseContent';
import { CourseService } from '@/apis/courseService';
import { useEffect, useState } from 'react';
import { Course } from '@/types/courses';
import { formatDuration } from '@/utils/time';
import { useParams } from 'next/navigation';
import { AllReviewsComponent } from '@/components/modules/course-detail/components/ReviewsComponent';

export default function DetailCourse() {
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const params = useParams();
  const courseId = Array.isArray(params?.courseId) ? params?.courseId[0] : params?.courseId || '';

  console.log(courseId); // Kiểm tra giá trị courseId
  useEffect(() => {
    const fetchCourse = async () => {
      try {
        if (!courseId) {
          console.log('No courseId found in params.');
          return;
        }

        const response = await CourseService.getCourseInDetail(courseId);
        if (response) {
          setCourse(response);
        }
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, []);

  if (loading) return <p className="text-center text-white">Loading...</p>;
  if (error) return <p className="text-center text-red-500">Error: {error}</p>;

  return (
    <div>
      {/* nav link */}
      <div className="h-full bg-[#002333] grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4"
        >
          <div className="col-span-2">
            <nav className="flex text-[#00FF84] font-oswald text-[20px] font-medium space-x-2 pt-4">
              <Link href="/development" className="hover:underline ">
                Development
              </Link>
              <span className="text-white">{'>'}</span>
              <Link href="/software-testing" className="hover:underline">
                Software Testing
              </Link>
              <span className="text-white">{'>'}</span>
              <Link href="/automation-test" className="hover:underline">
                Automation Test
              </Link>
            </nav>
            <h1 className="text-[40px] text-[#FFF] font-medium font-oswald">{course?.title}</h1>
            <h2 className="text-[20px] text-[#FFF] font-normal font-robotoCondensed pt-3">
              {course?.description}
            </h2>
            <div className="flex flex-row items-center space-x-2 pt-3">
              <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed">
                {course?.rating}
              </h2>
              <Star className="w-4 h-4 stroke-white fill-transparent stroke-[1.5]" />
              <h2 className="text-[15px] text-[#00FF84] font-normal font-robotoCondensed">
                {course?.reviews?.length}
              </h2>
              <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed">
                ({course?.enrollments?.length} học sinh)
              </h2>
            </div>
            <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed py-3">
              Tạo bởi :{' '}
              <u className="text-[#00FF84]">
                {course?.instructor?.user?.lastName} {course?.instructor?.user?.firstName}
              </u>
            </h2>
          </div>
        </div>
      </div>
      {/* phan */}
      <div className="h-full grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 px-6 pt-7
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full "
        >
          {/* flex */}
          <CourseDescription learningObject={course?.learningObjectives || []} />

          <CourseSidebar
            courseId={course?.courseId || ''}
            learningObject={course?.learningObjectives || []}
          />
        </div>
      </div>

      {/* phan  */}
      <div className="h-full grid grid-cols-6 gap-4">
        <div className="col-span-6 col-start-1 grid grid-cols-1 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full">
          <div className="col-span-3">
            <h2 className="text-xl font-bold text-gray-900 pt-5">Nội dung khóa học</h2>
            <p className="text-sm text-gray-600">
              {course?.modules?.length} phần - {course?.modules?.length} bài giảng -{' '}
              {course?.durationTime ? formatDuration(course.durationTime) : 'N/A'}
            </p>
          </div>
        </div>
        <div />
        <CourseSectionMenu modules={course?.modules} courseId={course?.courseId} />
      </div>
      <div className="h-full  grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4"
        >
          <CourseContent requirements={course?.requirements} />
          {/* comment input */}
          <CommentInput courseId={courseId} setCourse={setCourse} />

          {/* comments */}
          <div className="col-span-1 lg:col-span-2 ">
            <h1 className="text-[20px] font-normal font-oswald mb-2">Toàn bộ review</h1>
            <div className="grid grid-cols-1 lg:grid-cols-2 lg:gap-8">
              {course?.reviews && course.reviews.length > 0 ? (
                course.reviews.map((review) => (
                  <CommentCard key={review.reviewId} review={review} setCourse={setCourse} />
                ))
              ) : (
                <p className="col-span-2 text-center pb-5">Chưa có đánh giá nào.</p>
              )}
            </div>

            {/* Ẩn nút "Show more" nếu không có review */}
            {course?.reviews && course.reviews.length > 2 && (
              <Button
                variant="link"
                className="text-[#26FF96] mt-3 text-sm p-0"
                onClick={() => setShowAllReviews(true)}
              >
                Xem thêm
                <ChevronDown className="w-4 h-4 ml-1 text-[#26FF96]" />
              </Button>
            )}
          </div>
        </div>
      </div>

      {showAllReviews && (
        <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex items-center justify-center">
          <div className="bg-white max-w-4xl w-full h-[80vh] overflow-y-auto rounded-lg p-6 shadow-lg relative">
            <div className="flex flex-row justify-between pb-4">
              <h1 className="text-[20px] font-normal font-oswald mb-2">Rating and comment</h1>
              <button
                className="text-gray-600 hover:text-black text-xl"
                onClick={() => setShowAllReviews(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <AllReviewsComponent />
          </div>
        </div>
      )}
    </div>
  );
}
