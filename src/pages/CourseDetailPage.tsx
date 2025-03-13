'use client';
import { Button } from '@/components/ui/button';
import { ChevronDown, Star } from 'lucide-react';
import Link from 'next/link';
import CourseDescription from '@/components/module/course-detail/components/CourseDescription';
import CourseSidebar from '@/components/module/course-detail/components/CourseSidebar';
import CourseSectionMenu from '@/components/module/course-detail/components/CourseSectionMenu';
import CommentInput from '@/components/module/course-detail/components/CommentInput';
import CommentCard from '@/components/module/course-detail/components/CommentCard';
import CourseContent from '@/components/module/course-detail/components/CourseContent';

export default function DetailCourse() {
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
            <h1 className="text-[40px] text-[#FFF] font-medium font-oswald">
              The Complete 2025 Software Testing Bootcamp
            </h1>
            <h2 className="text-[20px] text-[#FFF] font-normal font-robotoCondensed pt-3">
              Your Step-by-Step Guide to Becoming a Professional Software Tester
            </h2>
            <div className="flex flex-row items-center space-x-2 pt-3">
              <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed">
                4.5
              </h2>
              <Star className="w-4 h-4 stroke-white fill-transparent stroke-[1.5]" />
              <h2 className="text-[15px] text-[#00FF84] font-normal font-robotoCondensed">
                (2.000.000 đánh giá)
              </h2>
              <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed">
                (2.000 học sinh)
              </h2>
            </div>
            <h2 className="text-[15px] text-[#FFF] font-normal font-robotoCondensed py-3">
              Tạo bởi : <u className="text-[#00FF84]">Bui Anh Dat</u>
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
          <CourseDescription />
          <CourseSidebar />
        </div>
      </div>

      {/* phan  */}
      <div className="h-full grid grid-cols-6 gap-4">
        <CourseSectionMenu />
      </div>
      <div className="h-full  grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4"
        >
          <CourseContent />
          {/* comment input */}
          <CommentInput />
          {/* comments */}
          <div className="col-span-2">
            <h1 className="text-[20px] font-normal font-oswald mb-2">
              Toàn bộ review
            </h1>
            <div className="grid grid-cols-2 gap-8">
              <CommentCard />
              <CommentCard />
              <CommentCard />
              <CommentCard />
            </div>
            <Button variant="link" className="text-[#26FF96] mt-3 text-sm p-0">
              Show more
              <ChevronDown className="w-4 h-4 ml-1 text-[#26FF96]" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
