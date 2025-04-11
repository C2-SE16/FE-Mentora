import { FC } from 'react';
import { CourseResult } from '@/apis/searchService';
import Image from 'next/image';

interface SearchResultsProps {
  courses: CourseResult[];
}

const SearchResults: FC<SearchResultsProps> = ({ courses }) => {
  console.log('courses:::', courses);
  return (
    <div className="bg-white rounded-lg divide-y">
      {courses.map((course, index) => (
        <div key={index} className="flex gap-4 p-4">
          <div className="relative w-48 h-32 flex-shrink-0 bg-gray-200 rounded">
            <Image src={course.thumbnail} alt={course.title} fill className="object-cover" />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-start">
              <h3 className="font-semibold text-lg max-w-[70%]">{course.title}</h3>
              <p className="font-bold ml-auto">₫{course.price.toLocaleString()}</p>
            </div>
            <p className="text-gray-600">{course.instructor}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="font-bold">{course.rating}</span>
              <span>⭐</span>
              <span className="text-gray-600">({course.ratingCount} đánh giá)</span>
            </div>
            {/* Removed the reference to totalDuration since it doesn't exist in CourseResult */}
            <p className="text-sm text-gray-500 mt-1">
              {course.description ? course.description.substring(0, 100) + '...' : ''}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default SearchResults;
