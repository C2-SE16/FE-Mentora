import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Module } from '@/types/module';
import { MonitorPlay } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface CourseSectionMenuProps {
  modules?: Module[];
  courseId?: string;
}

const CourseSectionMenu: React.FC<CourseSectionMenuProps> = ({ modules = [], courseId }) => {
  return (
    <div className="col-span-6 col-start-1 grid grid-cols-1 px-6 pb-4 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full">
      <div className="col-span-2 w-full">
        <Accordion type="multiple">
          {modules.map((module, index) => (
            <AccordionItem
              key={index}
              value={`section-${index}`}
              className="border-b border-gray-300"
            >
              <AccordionTrigger className="bg-gray-200 py-3 grid grid-cols-7 gap-4 font-bold text-black text-sm px-3">
                <span className="col-span-3 col-start-1 text-sm text-black">{module.title}</span>
                <span className="col-span-3 col-start-4 text-sm text-black">
                  {module.curricula?.length} bài giảng
                </span>
              </AccordionTrigger>
              <AccordionContent className="bg-white px-3 py-2 space-y-2">
                {(module.curricula ?? []).length > 0 ? (
                  (module.curricula ?? []).map((curriculum) => (
                    <div key={curriculum.curriculumId}>
                      {/* <p className="text-sm font-semibold text-black">{curriculum.title}</p> */}
                      {(curriculum.lectures ?? []).length > 0 ? (
                        (curriculum.lectures ?? []).map((lecture) => (
                          <div
                            key={lecture.lectureId}
                            className="flex justify-between items-center text-sm text-black pl-4"
                          >
                            <div className="flex items-center gap-2">
                              <MonitorPlay className="w-4 h-4 text-gray-600" />
                              <Link
                                href={`/courses/${courseId}/curricula/lecture/${lecture.lectureId}`}
                                className="underline text-green-600"
                              >
                                {lecture.title}
                              </Link>

                              {lecture.isFree && (
                                <span className="text-green-600 text-xs ml-2">Miễn phí</span>
                              )}
                            </div>
                            <span className="text-black">{lecture.duration} phút</span>
                          </div>
                        ))
                      ) : (
                        <p className="text-sm text-gray-500 pl-4">Không có bài giảng nào</p>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có nội dung nào</p>
                )}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </div>
  );
};

export default CourseSectionMenu;
