import React from 'react';

const SkeletonCourseCard = () => {
  return (
    <div className="flex flex-col md:flex-row bg-white rounded-lg shadow-sm overflow-hidden animate-pulse">
      {/* Skeleton Image */}
      <div className="w-full md:w-64 h-48 md:h-auto bg-gray-200"></div>
      
      <div className="flex-1 p-4 flex flex-col">
        {/* Title and Price */}
        <div className="flex justify-between items-start mb-4">
          <div className="h-6 bg-gray-200 rounded w-3/4"></div>
          <div className="h-6 bg-gray-200 rounded w-20"></div>
        </div>
        
        {/* Description */}
        <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
        
        {/* Instructor */}
        <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
        
        {/* Rating */}
        <div className="flex items-center mb-2">
          <div className="h-4 bg-gray-200 rounded w-24"></div>
        </div>
        
        {/* Duration */}
        <div className="h-3 bg-gray-200 rounded w-2/3 mb-4"></div>
        
        {/* Tag */}
        <div className="mt-auto">
          <div className="h-5 bg-gray-200 rounded w-12"></div>
        </div>
      </div>
    </div>
  );
};

export default SkeletonCourseCard;