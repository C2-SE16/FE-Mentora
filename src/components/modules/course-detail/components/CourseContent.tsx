import { Requirement } from '@/types/requirements';
import React from 'react';

interface CourseContentProps {
  requirements?: Requirement[] | undefined;
  descriptions?: string[];
}

const CourseContent: React.FC<CourseContentProps> = ({ requirements = [], descriptions = [] }) => {
  return (
    <div className="col-span-2">
      <h1 className="text-[20px] font-normal font-oswald mb-2">Yêu cầu</h1>
      <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
        {requirements && requirements.length > 0 ? (
          requirements.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item.description} {/* Chỉnh sửa để hiển thị đúng dữ liệu */}
            </li>
          ))
        ) : (
          <li>Không có yêu cầu đặc biệt</li>
        )}
      </ul>

      <h1 className="text-[20px] font-normal font-oswald mb-2 mt-7">Mô tả</h1>
      <ul className="list-disc pl-5 space-y-1 text-[15px] font-normal font-robotoCondensed w-full max-w-full">
        {descriptions && descriptions.length > 0 ? (
          descriptions.map((item, index) => (
            <li key={index} className="w-full max-w-full break-words">
              {item}
            </li>
          ))
        ) : (
          <li>Không có mô tả chi tiết</li>
        )}
      </ul>
    </div>
  );
};

export default CourseContent;
