import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { FileText, HelpCircle } from 'lucide-react';
import React from 'react';
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

interface Lesson {
  title: string;
  duration?: string;
  preview?: boolean;
  questions?: number;
}

interface Module {
  title: string;
  lessons: Lesson[];
}
interface CourseSectionMenuProps {
  modules?: Module[]; // modules is now optional
}

const CourseSectionMenu: React.FC<CourseSectionMenuProps> = ({ modules = [] }) => {
  return (
    <div className="col-span-6 col-start-1 grid grid-cols-1 px-6 lg:grid-cols-3 lg:col-span-4 lg:col-start-2 lg:px-0 w-full">
      <div className="col-span-2 w-full">
        <Accordion type="multiple">
          {modules.map((module, index) => (
            <AccordionItem
              key={index}
              value={`section-${index}`}
              className="border-b border-gray-300"
            >
              <AccordionTrigger className="bg-gray-200 py-3 flex justify-between font-bold text-gray-900 px-3">
                {module.title}
                <span className="text-sm text-gray-700">{module.lessons.length} bài giảng</span>
              </AccordionTrigger>
              <AccordionContent className="bg-white px-4 py-2 space-y-2">
                {module.lessons.length > 0 ? (
                  module.lessons.map((lesson, idx) => (
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
                          <span className="text-green-600 text-xs ml-2">Preview</span>
                        )}
                      </div>
                      <span className="text-gray-600">
                        {lesson.questions ? `${lesson.questions} câu hỏi` : lesson.duration}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">Không có bài học nào</p>
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
