'use client';

import { useState } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ModuleNavigation from './components/ModuleNavigation';
import { Course, LessonType } from '@/types/courses';
import { Lecture } from '@/types/lecture';

interface LectureContentProps {
  lecture?: Lecture;
  course?: Course;
}

export default function LectureContent({ lecture, course }: LectureContentProps) {
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'content' | 'notes' | 'questions'>('content');

  // Xử lý khi tiến trình video thay đổi
  const handleProgress = (progress: number) => {
    setProgress(progress);
    // Trong thực tế, bạn sẽ lưu tiến trình xem video vào database
  };

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Video Player và Nội dung bài học */}
      <div className="w-full md:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <VideoPlayer
            videoUrl="http://localhost:9090/videos/7c3146ca-7487-4259-bd3e-773048d556d0/cf85021c-cb69-432e-9252-ed26106422f3.mp4"
            lectureId={lecture?.lectureId || undefined}
            // onProgress={handleProgress}
          />

          <div className="p-4 border-b">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{lecture?.title || 'Chọn một bài học'}</h2>
              <div className="flex items-center mt-1">
                <div className="flex items-center">
                  {/* <span className="text-yellow-500 text-sm">
                    {Array.from({ length: Math.floor(rating || 0) }).map((_, i) => (
                      <span key={i}>★</span>
                    ))}
                    {(rating || 0) % 1 !== 0 && <span>★</span>}
                    {Array.from({ length: 5 - Math.ceil(rating || 0) }).map((_, i) => (
                      <span key={i} className="text-gray-300">
                        ★
                      </span>
                    ))}
                  </span>
                  <span className="ml-1 text-sm">{rating}</span>
                  <span className="mx-2 text-gray-400 text-sm">|</span>
                  <span className="text-green-500 text-sm">({ratingCount} đánh giá )</span> */}
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-1">
                Thời lượng:{' '}
                {lecture?.duration
                  ? `${Math.floor(lecture?.duration / 60)}:${(lecture?.duration % 60).toString().padStart(2, '0')}`
                  : 'N/A'}
              </p>
            </div>

            <div className="flex border-b">
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'content' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('content')}
              >
                Tổng quan
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('notes')}
              >
                Ghi chú
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'questions' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('questions')}
              >
                Hỏi đáp
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'content' && (
              <div>
                <h3 className="text-lg font-semibold mb-3">Mô tả bài học</h3>
                <p className="text-gray-700">
                  Trong bài học này, bạn sẽ được hướng dẫn chi tiết về cách sử dụng AI để tạo nội
                  dung video hấp dẫn cho kênh YouTube của mình. Chúng ta sẽ tìm hiểu các công cụ AI
                  phổ biến và cách áp dụng chúng vào quy trình sản xuất nội dung.
                </p>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Nội dung chính:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Giới thiệu về các công cụ AI hỗ trợ sáng tạo nội dung</li>
                    <li>Cách sử dụng AI để tạo kịch bản video</li>
                    <li>Tối ưu hóa tiêu đề và mô tả video với AI</li>
                    <li>Phân tích xu hướng nội dung bằng AI</li>
                  </ul>
                </div>
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Tài liệu bổ sung:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>
                      <a href="#" className="text-blue-600 hover:underline">
                        Hướng dẫn sử dụng ChatGPT cho nội dung YouTube
                      </a>
                      <a href="#" className="text-blue-600 hover:underline">
                        Hướng dẫn sử dụng ChatGPT cho nội dung YouTube
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-blue-600 hover:underline">
                        Danh sách các công cụ AI miễn phí cho người sáng tạo nội dung
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Ghi chú của bạn</h3>

                <textarea
                  className="w-full border rounded-md p-3 h-40"
                  placeholder="Thêm ghi chú của bạn về bài học này..."
                ></textarea>
                <button className="mt-3 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                  Lưu ghi chú
                </button>
              </div>
            )}

            {activeTab === 'questions' && (
              <div>
                <h3 className="text-lg font-semibold mb-4">Hỏi đáp</h3>
                <div className="mb-4">
                  <textarea
                    className="w-full border rounded-md p-3 h-24"
                    placeholder="Đặt câu hỏi của bạn về bài học này..."
                  ></textarea>
                  <button className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                    Gửi câu hỏi
                  </button>
                </div>
                <div className="space-y-4">
                  <p className="text-gray-500 text-center">Chưa có câu hỏi nào cho bài học này</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Danh sách bài học */}

      <div className="w-full md:w-1/4 bg-gray-100 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <div className="p-3 bg-gray-800 text-white">
            <h3 className="font-medium">Nội dung module</h3>
            <p className="text-sm mt-1">{}</p>
          </div>

          <ModuleNavigation
            courseId={course?.courseId}
            modules={course?.modules || []}
            currentLessonId={lecture?.lectureId}
          />
        </div>

        <div className="mt-4 bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Giảng viên</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p className="font-medium">
                {course?.instructor?.user?.lastName} {course?.instructor?.user?.firstName}
              </p>
              <p className="text-sm text-gray-600">Giảng viên</p>
            </div>
          </div>
          <button className="mt-3 w-full border border-blue-600 text-blue-600 px-4 py-2 rounded-md hover:bg-blue-50">
            Xem thông tin
          </button>
        </div>
      </div>
    </div>
  );
}
