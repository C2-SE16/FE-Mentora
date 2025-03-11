import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import React from "react";
import { getCourse, getModules } from "@/data/courses";

interface CoursePageProps {
  params: {
    courseId: string;
  };
}

export async function generateMetadata({
  params,
}: CoursePageProps): Promise<Metadata> {
  try {
    // Trong thực tế, bạn sẽ lấy dữ liệu khóa học từ database
    return {
      title: "Chi tiết khóa học",
      description: "Xem chi tiết khóa học và đăng ký học ngay",
    };
  } catch (error) {
    return {
      title: "Không tìm thấy khóa học",
      description: "Khóa học không tồn tại hoặc đã bị xóa",
    };
  }
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { courseId } = params;

  // Lấy thông tin khóa học và các module
  const course = getCourse(courseId);
  const modules = getModules();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero section */}
      <div className="bg-gray-900 text-white py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-4">{course.title}</h1>
          <p className="text-xl mb-6">{course.description}</p>
          <div className="flex items-center text-sm mb-6">
            <span className="flex items-center mr-4">
              <svg className="h-5 w-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              {course.rating} ({course.enrollments} học viên)
            </span>
            <span className="mr-4">|</span>
            <span>Giảng viên: {course.instructor}</span>
            <span className="mx-4">|</span>
            <span>Ngôn ngữ: {course.language}</span>
          </div>
          <div className="flex">
            <Link 
              href={`/courses/${courseId}/lessons/1`}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-md font-medium"
            >
              Bắt đầu học ngay
            </Link>
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="lg:w-2/3">
            <div className="bg-white shadow-md rounded-md p-6 mb-8">
              <h3 className="text-xl font-semibold mb-4">Bạn sẽ học được gì</h3>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {course.features?.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <svg className="h-5 w-5 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="bg-white shadow-md rounded-md p-6">
              <h3 className="text-xl font-semibold mb-4">Nội dung bài học</h3>
              <div className="border rounded-md overflow-hidden">
                {modules.map((module, moduleIndex) => (
                  <div key={module.moduleId} className="border-b last:border-b-0">
                    <div className="bg-gray-100 p-4">
                      <h4 className="font-medium">
                        Module {moduleIndex + 1}: {module.title}
                      </h4>
                    </div>
                    <div>
                      {module.lessons.map((lesson) => (
                        <Link 
                          key={lesson.lessonId} 
                          href={`/courses/${courseId}/lessons/${lesson.lessonId}`}
                        >
                          <div className="p-4 border-t flex items-center hover:bg-gray-50">
                            <div className="mr-3">
                              {lesson.type === 'VIDEO' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                                </svg>
                              ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                                </svg>
                              )}
                            </div>
                            <div className="flex-1">
                              <p className="text-sm">{lesson.title}</p>
                              {lesson.isFree && (
                                <span className="text-xs text-green-600">Miễn phí</span>
                              )}
                            </div>
                            {lesson.duration && (
                              <span className="text-xs text-gray-500">
                                {Math.floor(lesson.duration / 60)}:{(lesson.duration % 60).toString().padStart(2, '0')}
                              </span>
                            )}
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          
          {/* Sidebar */}
          <div>
            <div className="bg-white shadow-md rounded-md p-6 sticky top-6">
              <div className="text-3xl font-bold mb-4">
                {new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(course.price)}
              </div>
              
              <Link 
                href={`/courses/${courseId}/lessons/1`}
                className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center px-6 py-3 rounded-md font-medium mb-4"
              >
                Bắt đầu học ngay
              </Link>
              
              <button className="block w-full border border-blue-600 text-blue-600 text-center px-6 py-3 rounded-md font-medium mb-6 hover:bg-blue-50">
                Thêm vào giỏ hàng
              </button>
              
              <div className="space-y-4">
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Truy cập trọn đời</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" />
                  </svg>
                  <span>Truy cập trên mọi thiết bị</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span>Chứng chỉ hoàn thành</span>
                </div>
                <div className="flex items-center">
                  <svg className="h-5 w-5 text-gray-500 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <span>Cập nhật thường xuyên</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 