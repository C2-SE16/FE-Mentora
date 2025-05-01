import { Course } from '@/interfaces/homepage-course';
import { CourseItemSkeleton } from './HomeCourseLoading';
import CourseCard from './CourseCard';

interface CourseListProps {
  courses: Course[];
  isLoading: boolean;
  onAddToCart: (courseId: string, e: React.MouseEvent) => void;
}

const CourseList = ({ courses, isLoading, onAddToCart }: CourseListProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
      {isLoading ? (
        <>
          {[1, 2, 3, 4].map((item, index) => (
            <CourseItemSkeleton key={index} />
          ))}
        </>
      ) : (
        courses.map((course, index) => (
          <CourseCard key={course.id} course={course} index={index} onAddToCart={onAddToCart} />
        ))
      )}
    </div>
  );
};

export default CourseList;
