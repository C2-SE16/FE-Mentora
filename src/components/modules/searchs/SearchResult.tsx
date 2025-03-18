import { FC } from 'react';
import { CourseResult } from '@/apis/searchService';

interface SearchResultsProps {
  courses: CourseResult[];
}

const SearchResults: FC<SearchResultsProps> = ({ courses }) => {
  // Mock data based on the schema
  // const courses: Course[] = Array(5).fill({
  //   id: '1',
  //   title: 'Khóa học: Xây dựng kênh youtube và kiếm tiền nhờ AI',
  //   instructor: 'Tạo bởi: Anh Đạt',
  //   rating: 4.5,
  //   ratingCount: 3000,
  //   duration: '4 bài giảng - 30 phút',
  //   price: 239000,
  // });

  return (
    <div className="bg-white rounded-lg divide-y">
      {courses.map((course, index) => (
        <div key={index} className="flex gap-4 p-4">
          <div className="relative w-48 h-32 flex-shrink-0 bg-gray-200 rounded">
            <div className="absolute inset-0 flex items-center justify-center">
              <svg
                className="w-12 h-12 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
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
