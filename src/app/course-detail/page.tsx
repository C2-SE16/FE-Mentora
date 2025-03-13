'use client';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Star, ShoppingCart, EllipsisVertical, Heart } from 'lucide-react';
import Link from 'next/link';
import { Check, ChevronDown } from 'lucide-react';
import { useState } from 'react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import { FileText, HelpCircle } from 'lucide-react';

const learnItems = [
  'Master manual software testing fundamentals',
  'Master manual software testing fundamentals',
  'Master black-box testing techniques like equivalence partitioning and boundary value analysis',
  'Understand API testing fundamentals and hands-on experience with Postman',
];
const sections = [
  {
    title: 'Giới thiệu',
    lessons: [
      { title: 'Requirement Material', duration: '05:30', preview: true },
      { title: 'Giới thiệu nhanh', duration: '07:40' },
      { title: 'Giới thiệu nhanh', duration: '07:40' },
      { title: 'Test 1', questions: 12 },
    ],
  },
  {
    title: 'Giới thiệu',
    lessons: [],
  },
  {
    title: 'Giới thiệu',
    lessons: [],
  },
];
const requirements = [
  'Familiarity with using computers and navigating software applications',
  'Basic understanding of English to follow course instructions and complete assignments',
  'This course is designed for beginners and intermediate learners, so prior knowledge of software testing is not required',
  'A laptop or desktop computer with internet access to complete course materials and projects',
];

const descriptions = [
  'The Complete Software Testing 2024 Bootcamp – All-In-One Testing Guide Ready to launch your career in software testing?',
  'This comprehensive course is designed for absolute beginners and intermediate testers who want to master the essentials and advance to an industry-ready skill set. From manual testing to automation and performance testing, this course provides everything you need to know to land your first software testing job, whether as a full-time professional or a freelancer.',
];
const contents = [
  '  37 hours on-demand video',
  '8 articles',
  '3 downloadable resources',
  'Access on mobile and TV',
  'Full lifetime access',
  'Certificate of completion',
];
export default function DetailCourse() {
  const [showMore, setShowMore] = useState(false);
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
          <Card className="w-full col-span-2 border border-gray-300 shadow-md rounded-none">
            <CardContent className="py-6">
              <h2 className="text-lg font-bold mb-4">
                Bạn sẽ học được những gì?
              </h2>
              <ul className="space-y-3">
                {learnItems
                  .slice(0, showMore ? learnItems.length : 2)
                  .map((item, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <Check className="w-5 h-5 text-black stroke-[1.5]" />
                      {item}
                    </li>
                  ))}
              </ul>
              <Button
                variant="link"
                className="text-[#26FF96] mt-3 text-sm flex items-center"
                onClick={() => setShowMore(!showMore)}
              >
                {showMore ? 'Show less' : 'Show more'}{' '}
                <ChevronDown className="w-4 h-4 ml-1 text-[#26FF96]" />
              </Button>
            </CardContent>
          </Card>
          {/* flex */}
          <Card
            className="bg-white border border-gray-300 shadow-md rounded-none w-full h-[500px] p-4 
             md:grid-cols-1 md:col-span-3 md:px-6 
             lg:fixed lg:top-[10vh] lg:right-[10%] lg:w-[280px]"
          >
            <div className="p-4 bg-slate-300 h-[150px]"></div>
            <div className="pt-5 grid grid-cols-3 gap-4">
              <Button className="col-span-2 h-14 bg-[rgba(0,255,132,0.85)] text-[16px] font-oswald text-black font-normal hover:bg-[#00CC6E]">
                Thêm vào giỏ hàng
              </Button>
              <Button className="col-span-1 h-14 bg-white border border-[rgba(0,255,132,0.85)] rounded-lg flex items-center justify-center hover:bg-slate-100">
                <Heart className="w-8 h-8 text-[rgba(0,255,132,0.85)]" />
              </Button>

              <Button className="col-span-3 h-14 text-[16px] font-oswald text-black font-normal border border-[rgba(0,255,132,0.85)] bg-white hover:bg-slate-100">
                Mua ngay
              </Button>
            </div>
            <h2 className="text-[16px] font-normal font-oswald pt-3">
              Nội dung khóa học
            </h2>
            <div>
              <ul className="list-disc pl-5  text-[15px] font-normal font-robotoCondensed w-full max-w-full">
                {contents.map((item, index) => (
                  <li key={index} className="w-full max-w-full break-words">
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </Card>
        </div>
      </div>

      {/* phan  */}
      <div className="h-full  grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 px-6
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full "
        >
          {/* Tiêu đề khóa học */}
          <div className="col-span-3">
            <h2 className="text-xl font-bold text-gray-900 pt-5">
              Nội dung khóa học
            </h2>
            <p className="text-sm text-gray-600">
              35 phần - 349 bài giảng - 37h30ph
            </p>
          </div>

          {/* Accordion nội dung khóa học */}
          <div className="col-span-2 w-full">
            <Accordion type="multiple">
              {sections.map((section, index) => (
                <AccordionItem
                  key={index}
                  value={`section-${index}`}
                  className="border-b border-gray-300"
                >
                  <AccordionTrigger className="bg-gray-200 py-3 flex justify-between font-bold text-gray-900 px-3">
                    {section.title}
                    <span className="text-sm text-gray-700">
                      4 bài giảng - 30 phút
                    </span>
                  </AccordionTrigger>
                  <AccordionContent className="bg-white px-4 py-2 space-y-2">
                    {section.lessons.length > 0 ? (
                      section.lessons.map((lesson, idx) => (
                        <div
                          key={idx}
                          className="flex justify-between items-center text-sm text-gray-800"
                        >
                          <div className="flex items-center gap-2">
                            {lesson.questions ? (
                              <HelpCircle className="w-4 h-4 text-gray-600" />
                            ) : (
                              <FileText className="w-4 h-4 text-gray-600" />
                            )}
                            {lesson.title}
                            {lesson.preview && (
                              <span className="text-green-600 text-xs ml-2">
                                Preview
                              </span>
                            )}
                          </div>
                          <span className="text-gray-600">
                            {lesson.questions
                              ? `${lesson.questions} câu hỏi`
                              : lesson.duration}
                          </span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">
                        Không có bài học nào
                      </p>
                    )}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </div>
      <div className="h-full  grid grid-cols-6 gap-4">
        <div
          className="col-span-6 col-start-1 grid grid-cols-1 gap-4 px-6
               lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full lg:gap-4"
        >
          <div className="col-span-2">
            <h1 className="text-[20px] font-normal font-oswald mb-2">
              Yêu cầu
            </h1>
            <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
              {requirements.map((item, index) => (
                <li key={index} className="w-full max-w-full break-words">
                  {item}
                </li>
              ))}
            </ul>

            <h1 className="text-[20px] font-normal font-oswald mb-2 mt-7">
              Mô tả
            </h1>
            <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
              {descriptions.map((item, index) => (
                <li key={index} className="w-full max-w-full break-words">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          {/* comment input */}
          <div className="col-span-2 p-5 border border-black rounded-sm">
            <Textarea
              placeholder="Type your message here."
              className="border border-black"
            />
            <div className="flex flex-row justify-between pt-4">
              <div className="grid grid-cols-5 gap-4 items-center justify-center">
                <Button variant="ghost" size="icon">
                  <Star className="w-12 h-12" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="w-12 h-12" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="w-12 h-12" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="w-12 h-12" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Star className="w-12 h-12" />
                </Button>
              </div>
              <Button className="bg-[#00FF84] text-black text-[20px] font-oswald p-5 w-[100px] h-[45px] font-normal items-center justify-center hover:bg-[#00CC6E] border border-black shadow-[0px_4px_4px_rgba(0,0,0,0.25)]">
                Gửi
              </Button>
            </div>
          </div>
          {/* comments */}
          <div className="col-span-2">
            <h1 className="text-[20px] font-normal font-oswald mb-2">
              Toàn bộ review
            </h1>
            <div className="grid grid-cols-2 gap-8">
              <Card className="w-full col-span-1 rounded-none border-0 shadow-none">
                <hr className=" bg-black h-1" />
                <div className="grid grid-cols-5 gap-2 pt-4">
                  <Avatar className="col-span-1">
                    <AvatarImage
                      src="https://github.com/shadcn.png"
                      alt="@shadcn"
                    />
                    <AvatarFallback>CN</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col col-span-3">
                    <h1 className="text-[20px] font-robotoCondensed font-normal">
                      Bui Anh Dat
                    </h1>
                    <div className="flex flex-row justify-between">
                      <div className="flex flex-row items-center justify-center ">
                        <h1 className="pr-3 text-[15px] font-robotoCondensed font-normal">
                          4.5
                        </h1>
                        <Button variant="ghost" size="icon">
                          <Star className="w-12 h-12" />
                        </Button>
                        <h1 className=" text-[15px] font-robotoCondensed font-normal">
                          1 tuần trước
                        </h1>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-end ">
                    <Button variant="ghost" size="icon">
                      <EllipsisVertical className="w-12 h-12" />
                    </Button>
                  </div>
                </div>
                <p className="text-[15px] font-robotoCondensed font-normal">
                  Made more sense as i'm starting my career in manual software
                  testing, i was working without any experience in software and
                  without any training.
                </p>
              </Card>
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
