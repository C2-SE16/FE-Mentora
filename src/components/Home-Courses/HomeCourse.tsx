'use client';

import Image from 'next/image';
import Link from 'next/link';
import React, { useEffect, useState } from 'react';
import Button from '../Button/Button';
import { CourseItemSkeleton, MentorSkeleton, TopicSkeleton } from './HomeCourseLoading';
import { Course, Mentor, Topic } from '@/interfaces/homepage-course';
import api from '@/apis/api';

interface HomepageData {
  recommendedCourses: Course[];
  bestSellerCourses: Course[];
  trendingCourses: Course[];
  topics: Topic[];
  mentors: Mentor[];
}

interface ApiResponse {
  data: HomepageData;
  statusCode: number;
}

const HomeCourse = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [homepageData, setHomepageData] = useState<HomepageData>({
    recommendedCourses: [],
    bestSellerCourses: [],
    trendingCourses: [],
    topics: [],
    mentors: [],
  });

  useEffect(() => {
    const fetchHomepageData = async () => {
      try {
        setIsLoading(true);
        const response = await api.get<ApiResponse>('courses/homepage');
        if (response.data && response.data.statusCode === 200) {
          setHomepageData(response.data.data);
        } else {
          console.error('Failed to fetch homepage data');
        }
      } catch (error) {
        console.error('Error fetching homepage data:', error);
      } finally {
        // Simulate loading delay for better UX
        setTimeout(() => {
          setIsLoading(false);
        }, 1000);
      }
    };

    fetchHomepageData();
  }, []);

  const topics = [
    'Java',
    'Deep Learning',
    'ReactJs',
    'NodeJs',
    'Marketing',
    'NestJs',
    'Thiết kế đồ họa',
    'Thể thao',
  ];

  // Component cho mỗi khóa học
  const CourseItem = ({ course, index }: any) => {
    const isLastInRow = (index + 1) % 4 === 0;
    const popupPosition = isLastInRow ? 'right-full mr-4' : 'left-full ml-4';

    return (
      <div className="w-[330px] group relative">
        <Link href={`/courses/${course.id}`}>
          <div className="relative overflow-hidden rounded-lg w-[330px] h-[200px] cursor-pointer">
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
                className="font-bold text-lg mt-2 text-[#303141]"
              >
                {course.title}
              </Link>
            </div>
            <p className="mt-1">{course.instructor}</p>
            <div className="flex gap-x-1 items-center">
              <span className="flex gap-x-1">
                {course.rating} <Image src="/star.svg" alt="star" width={16} height={16} />
              </span>
              <span className="text-[#595c73] ml-1 text-sm">({course.reviews || 0})</span>
            </div>
            <div className="flex gap-x-4">
              <span className="">{course.currentPrice}</span>
              <span className="line-through">{course.originalPrice}</span>
            </div>
            {course.isBestSeller && (
              <Button
                href={`/courses/${course.id}`}
                backgroundColor="#3A10E5"
                textColor="#ffffff"
                minWidth={90}
                className="mt-3"
              >
                bán chạy
              </Button>
            )}
          </div>
        </Link>

        {/* Popup thông tin khi hover - hiển thị bên phải hoặc bên trái tùy thuộc vào vị trí */}
        <div
          className={`absolute ${popupPosition} top-0 w-[320px] bg-white rounded-lg shadow-xl opacity-0 invisible transform translate-x-2 transition-all duration-300 z-50 group-hover:opacity-100 group-hover:visible group-hover:translate-x-0 border border-gray-200`}
        >
          <div
            className={`absolute ${
              isLastInRow ? 'top-8 -right-[10px] rotate-90' : 'top-12 -left-[10px] -rotate-90'
            }`}
          >
            <Image src="/dropdown-accessory.svg" alt="dropdown" width={20} height={20} />
          </div>
          <div className="p-4">
            <h3 className="font-bold text-lg text-gray-800">{course.title}</h3>
            <p className="text-gray-600 text-sm mt-1">Đã cập nhật {course.updatedDate}</p>

            <div className="mt-2 text-gray-700">
              <div className="flex items-center text-sm">
                <span>
                  Tổng số {course.totalHours} giờ • {course.level} •{' '}
                  {course.subtitle ? 'Phụ đề' : 'Không phụ đề'}
                </span>
              </div>

              <p className="mt-3 text-sm">{course.description}</p>

              <div className="mt-3">
                {course.categories &&
                  course.categories.map((category: any, idx: any) => (
                    <div key={idx} className="flex items-center gap-x-2 text-sm mt-1">
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
                <button className="bg-[#3A10E5] text-white py-2 px-4 rounded-md w-full font-medium">
                  Thêm vào giỏ hàng
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="mt-5">
      {/* Course list 1 */}
      <div className="flex gap-x-6">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((item, index) => (
              <CourseItemSkeleton key={index} />
            ))}
          </>
        ) : (
          homepageData.recommendedCourses.map((course, index) => (
            <CourseItem key={course.id} course={course} index={index} />
          ))
        )}
      </div>

      {/* Course list 2 */}
      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Học nhiều trong ngày</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <div className="flex gap-x-6 mt-5">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((item) => (
              <CourseItemSkeleton key={item} />
            ))}
          </>
        ) : (
          homepageData.recommendedCourses.map((course, index) => (
            <CourseItem key={course.id} course={course} index={index} />
          ))
        )}
      </div>

      {/* Course list 3 */}
      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Top bán chạy</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>
      <div className="flex gap-x-6 mt-5">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((item) => (
              <CourseItemSkeleton key={item} />
            ))}
          </>
        ) : (
          homepageData.bestSellerCourses.map((course, index) => (
            <CourseItem key={course.id} course={course} index={index} />
          ))
        )}
      </div>

      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Topic đề xuất cho bạn</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <div className="grid grid-cols-4 gap-6 mt-5">
        {isLoading
          ? Array(8)
              .fill(0)
              .map((_, index) => <TopicSkeleton key={index} />)
          : topics.map((topic, index) => (
              <div key={index}>
                <Button
                  href="/courses/1"
                  minWidth={310}
                  backgroundColor="#fff"
                  textColor="black"
                  className="border border-black shadow-custom transition-all duration-300 hover:bg-[#171100] hover:text-white hover:border-[#3A10E5] hover:shadow-lg"
                >
                  {topic}
                </Button>
              </div>
            ))}
      </div>

      <div className="flex justify-between mt-16">
        <h2 className="text-2xl font-bold">Mentor được yêu thích</h2>
        <Link href="#!" className="flex items-center text-sm font-bold">
          Xem thêm
          <Image src="/chevron-right.svg" alt="arrow-right" width={24} height={24} />
        </Link>
      </div>

      <div className="flex gap-x-6 mt-5">
        {isLoading ? (
          <>
            {[1, 2, 3, 4].map((item, index) => (
              <MentorSkeleton key={index} />
            ))}
          </>
        ) : (
          homepageData.mentors.map((mentor) => (
            <div
              key={mentor.id}
              className="w-[330px] h-[290px] border border-black hover:shadow-lg transition-all duration-100 group cursor-pointer"
            >
              <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center h-full">
                <div className="overflow-hidden rounded-full w-[165px] h-[165px]">
                  <Image
                    src={mentor.avatar || '/avatar.jpg'}
                    alt={`${mentor.name} avatar`}
                    width={165}
                    height={165}
                    className="rounded-full object-cover w-[165px] h-[165px] transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <h2 className="text-xl font-bold mt-4 transition-colors duration-100">
                  {mentor.name}
                </h2>
                <p className="font-bold transition-colors duration-100">{mentor.role}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default HomeCourse;
