'use client';

interface CurriculumHeaderProps {
  isFetching: boolean;
}

export default function CurriculumHeader({ isFetching }: CurriculumHeaderProps) {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center mb-2">
        <h1 className="text-2xl font-bold">Nội dung khóa học</h1>
        {isFetching && <div className="text-sm text-gray-500">Đang tải...</div>}
      </div>
      <p className="text-gray-600">
        Thêm, sắp xếp và quản lý các module và bài học trong khóa học của bạn.
      </p>
    </div>
  );
}
