export const CourseItemSkeleton = () => (
  <div className="w-[330px] animate-pulse">
    <div className="relative overflow-hidden rounded-lg bg-gray-200 h-[133px]"></div>
    <div className="mt-2 h-5 bg-gray-200 rounded w-3/4"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-1/3"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-1/4"></div>
    <div className="mt-2 h-4 bg-gray-200 rounded w-1/2"></div>
    <div className="mt-3 h-8 bg-gray-200 rounded w-1/3"></div>
  </div>
);

export const TopicSkeleton = () => (
  <div>
    <div className="h-[42px] bg-gray-200 rounded animate-pulse"></div>
  </div>
);

export const MentorSkeleton = () => (
  <div className="w-[330px] h-[290px] border border-gray-200 animate-pulse">
    <div className="pt-[30px] px-[30px] pb-4 flex flex-col items-center justify-center h-full">
      <div className="rounded-full w-[165px] h-[165px] bg-gray-200"></div>
      <div className="h-5 bg-gray-200 rounded w-1/2 mt-4"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3 mt-2"></div>
    </div>
  </div>
);
