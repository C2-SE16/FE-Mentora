import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { LearningObjective } from '@/types/learning-object';
import { Heart } from 'lucide-react';
import React from 'react';
const contents = [
  '  37 hours on-demand video',
  '8 articles',
  '3 downloadable resources',
  'Access on mobile and TV',
  'Full lifetime access',
  'Certificate of completion',
];
interface CourseSidebarProps {
  courseId: string;
  learningObject?: LearningObjective[];
}
const CourseSidebar: React.FC<CourseSidebarProps> = ({ courseId, learningObject = [] }) => {
  return (
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
      <h2 className="text-[16px] font-normal font-oswald pt-3">Nội dung khóa học</h2>
      <div>
        <ul className="list-disc pl-5  text-[15px] font-normal font-robotoCondensed w-full max-w-full">
          {learningObject.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item.description}
            </li>
          ))}
        </ul>
      </div>
    </Card>
  );
};

export default CourseSidebar;
