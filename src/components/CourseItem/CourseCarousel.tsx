'use client';

import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import dynamic from 'next/dynamic';

interface Instructor {
  instructorId: string;
  instructorName: string;
  avatar?: string;
}

interface Course {
  courseId: string;
  title: string;
  shortDescription?: string;
  thumbnail?: string;
  price: number;
  discountPrice?: number;
  rating?: number;
  totalStudents?: number;
  totalReviews?: number;
  tbl_instructors?: Instructor;
  categoryType?: string;
  level?: string;
  instructor?: Instructor;
}

// Tách carousel thành component riêng để tránh re-render khi các filter thay đổi
export const CourseCarousel = dynamic(
  () =>
    Promise.resolve(
      ({ courses, formatPrice }: { courses: Course[]; formatPrice: (price: number) => string }) => {
        return (
          <div className="relative">
            {/* Courses list - horizontal scrollable */}
            <div className="flex overflow-x-auto space-x-6 py-4 pb-8 hide-scrollbar">
              {courses.slice(0, 6).map((course) => (
                <div key={course.courseId} className="flex-shrink-0 w-[280px]">
                  <Link href={`/courses/${course.courseId}`} className="block">
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                      {/* Course image */}
                      <div className="w-full h-[160px] relative">
                        {course.thumbnail ? (
                          <Image
                            src={course.thumbnail}
                            alt={course.title}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400">Không có ảnh</span>
                          </div>
                        )}
                      </div>

                      {/* Course details */}
                      <div className="p-4">
                        <h3 className="font-medium text-gray-900 line-clamp-2 mb-1 min-h-[48px]">
                          {course.title}
                        </h3>
                        <p className="text-sm text-gray-500 mb-1">
                          {course.tbl_instructors?.instructorName ||
                            course.instructor?.instructorName ||
                            'Bùi Minh Kha'}
                        </p>
                        <div className="flex items-center mb-1">
                          <span className="text-[#e59819] font-medium mr-1">
                            {course.rating ? course.rating.toFixed(1) : '4.8'}
                          </span>
                          <div className="flex">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className="w-3 h-3 text-[#e59819]"
                                fill="currentColor"
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          <span className="text-xs text-gray-500 ml-1">
                            ({course.totalReviews || Math.floor(Math.random() * 500) + 50})
                          </span>
                        </div>
                        <div className="font-medium">
                          {course.discountPrice !== undefined &&
                          course.discountPrice < course.price ? (
                            <>
                              <span>{formatPrice(course.discountPrice)}</span>
                              <span className="text-sm text-gray-500 line-through ml-2">
                                {formatPrice(course.price)}
                              </span>
                            </>
                          ) : (
                            <span>{formatPrice(course.price)}</span>
                          )}
                        </div>
                        {Math.random() > 0.5 && (
                          <div className="mt-2">
                            <span className="inline-block bg-[#29cc60] text-white text-xs px-2 py-0.5 rounded">
                              Bán chạy
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>
                </div>
              ))}
            </div>

            {/* Navigation arrows */}
            <button
              className="absolute top-1/2 -left-4 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10"
              aria-label="Previous"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
            </button>
            <button
              className="absolute top-1/2 -right-4 transform -translate-y-1/2 w-10 h-10 bg-white rounded-full shadow-md flex items-center justify-center z-10"
              aria-label="Next"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5l7 7-7 7"
                />
              </svg>
            </button>
          </div>
        );
      }
    ),
  { ssr: false }
);

CourseCarousel.displayName = 'CourseCarousel';
