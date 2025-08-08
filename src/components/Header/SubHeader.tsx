'use client';

import api from '@/apis/api';
import { getCategoryDisplayName } from '@/utils/changeCategoryName';
import Link from 'next/link';
import React, { useEffect, useState, useRef } from 'react';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const SubHeader = () => {
  const [categories, setCategories] = useState<any[]>([]);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);
  const categoriesContainerRef = useRef<HTMLDivElement>(null);

  const fetchCategories = async () => {
    try {
      const response = await api.get('categories');

      // Kiểm tra cấu trúc dữ liệu trả về
      if (response.data.data.data.data && response.data.data) {
        // Kiểm tra xem data.data có phải là mảng không
        const categoriesData = response.data.data.data.data || response.data.data;

        if (Array.isArray(categoriesData)) {
          setCategories(categoriesData);
        } else {
          console.error('Dữ liệu categories không phải mảng:', categoriesData);
          setCategories([]);
        }
      } else {
        console.error('Cấu trúc dữ liệu không hợp lệ:', response.data);
        setCategories([]);
      }
    } catch (error) {
      console.error('Lỗi khi lấy danh mục:', error);
      setCategories([]);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Kiểm tra xem có cần hiển thị arrows không
  useEffect(() => {
    const checkForArrows = () => {
      if (categoriesContainerRef.current) {
        const { scrollLeft, scrollWidth, clientWidth } = categoriesContainerRef.current;
        setShowLeftArrow(scrollLeft > 0);
        setShowRightArrow(scrollLeft + clientWidth < scrollWidth);
      }
    };

    // Kiểm tra ban đầu
    checkForArrows();

    // Thêm event listener để kiểm tra khi scroll
    const container = categoriesContainerRef.current;
    if (container) {
      container.addEventListener('scroll', checkForArrows);
      return () => container.removeEventListener('scroll', checkForArrows);
    }
  }, [categories]);

  // Hàm xử lý khi click vào arrows
  const handleScrollLeft = () => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollBy({ left: -200, behavior: 'smooth' });
    }
  };

  const handleScrollRight = () => {
    if (categoriesContainerRef.current) {
      categoriesContainerRef.current.scrollBy({ left: 200, behavior: 'smooth' });
    }
  };


  return (
    <div className="w-full border-b border-t border-gray-200 bg-white shadow-md hidden md:block relative">
      <div className="max-w-[1340px] mx-auto relative">
        {/* Nút mũi tên trái */}
        {showLeftArrow && (
          <button
            onClick={handleScrollLeft}
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 flex items-center justify-center"
          >
            <FaChevronLeft className="text-gray-700" />
          </button>
        )}

        {/* Container danh mục với scrolling */}
        <div
          ref={categoriesContainerRef}
          className="flex space-x-6 py-2 px-8 overflow-x-auto scrollbar-hide"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {Array.isArray(categories) && categories.length > 0 ? (
            categories.map((category: any) => (
              <Link
                key={category.categoryId}
                href={`/categories/${category.name?.toLowerCase() || ''}`}
                className="whitespace-nowrap text-base font-normal py-1 px-2 transition-colors duration-200 hover:text-[#1dbe70] text-gray-700 flex-shrink-0"
              >
                {getCategoryDisplayName(category.name || '')}
              </Link>
            ))
          ) : (
            <div className="text-gray-500">Đang tải danh mục...</div>
          )}
        </div>

        {/* Nút mũi tên phải */}
        {showRightArrow && (
          <button
            onClick={handleScrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white shadow-md rounded-full p-2 flex items-center justify-center"
          >
            <FaChevronRight className="text-gray-700" />
          </button>
        )}
      </div>
    </div>
  );
};

export default SubHeader;
