'use client';

import { useState, useEffect } from 'react';
import VideoPlayer from './components/VideoPlayer';
import ModuleNavigation from './components/ModuleNavigation';
import { Course, LessonType } from '@/types/courses';
import { Lecture } from '@/types/lecture';
import DiscussingTab from './components/DiscussingTab';
import { ProgressService } from '@/apis/progressService';
import { decodeJWT } from '@/utils/jwt';

interface LectureContentProps {
  lecture?: Lecture;
  course?: Course;
  requirements?: {
    requirementId: string;
    courseId: string;
    description: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
  }[];
  targetAudience?: {
    audienceId: string;
    courseId: string;
    description: string;
    orderIndex: number;
    createdAt: string;
    updatedAt: string;
  }[];
}

export default function LectureContent({ lecture, course }: LectureContentProps) {
  const [progress, setProgress] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<'requirements' | 'targetAudience' | 'discussing'>(
    'requirements'
  );

  return (
    <div className="flex flex-col md:flex-row w-full">
      {/* Video Player và Nội dung bài học */}
      <div className="w-full md:w-3/4 p-4">
        <div className="bg-white shadow-md rounded-md overflow-hidden">
          <VideoPlayer
            videoUrl={`http://localhost:9090/videos/${course?.courseId}/${lecture?.lectureId}.mp4`}
            lectureId={lecture?.lectureId || undefined}
          />

          <div className="p-4 border-b">
            <div className="mb-4">
              <h2 className="text-xl font-semibold">{lecture?.title || 'Chọn một bài học'}</h2>
              <div className="flex items-center mt-1">
                <div className="flex items-center"></div>
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
                className={`px-4 py-2 font-medium ${activeTab === 'requirements' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('requirements')}
              >
                Yêu cầu
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'targetAudience' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('targetAudience')}
              >
                Đối tượng học viên
              </button>
              <button
                className={`px-4 py-2 font-medium ${activeTab === 'discussing' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-600'}`}
                onClick={() => setActiveTab('discussing')}
              >
                Thảo luận
              </button>
            </div>
          </div>

          <div className="p-4">
            {activeTab === 'requirements' && (
              <div>
                <div className="space-y-4 bg-blue-50 p-4 rounded-md">
                  <ul className="list-disc pl-5 space-y-2">
                    {course?.requirements?.map((req) => (
                      <li key={req.requirementId} className="text-gray-700">
                        {req.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'targetAudience' && (
              <div>
                <div className="space-y-4 bg-blue-50 p-4 rounded-md">
                  <ul className="list-disc pl-5 space-y-2">
                    {course?.targetAudience?.map((audience) => (
                      <li key={audience.audienceId} className="text-gray-700">
                        {audience.description}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {activeTab === 'discussing' && lecture && (
              <DiscussingTab curriculumId={lecture.curriculumId || ''} />
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
            currentLessonId={lecture?.lectureId || ''}
          />
        </div>

        <div className="mt-4 bg-white shadow-md rounded-md p-4">
          <h3 className="text-lg font-semibold mb-2">Giảng viên</h3>
          <div className="flex items-center">
            <div className="w-12 h-12 bg-gray-300 rounded-full mr-3">
              {course?.tbl_instructors?.user?.avatar && (
                <img
                  src={course.tbl_instructors.user.avatar}
                  alt={course.tbl_instructors.user.fullName}
                  className="w-full h-full rounded-full object-cover"
                />
              )}
            </div>
            <div>
              <p className="font-medium">{course?.tbl_instructors?.user?.fullName}</p>
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
