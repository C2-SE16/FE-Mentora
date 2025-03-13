'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryService from '@/apis/categoryService';
import { Category, CategoryType, categoryTypeToVietnamese } from '@/types/categories';

export default function Step2() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Lấy danh sách categories từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await CategoryService.getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error("Lỗi khi lấy danh sách categories:", err);
        setError("Không thể tải danh sách thể loại. Vui lòng thử lại sau.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string, categoryType: CategoryType) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategory(categoryTypeToVietnamese[categoryType]);
    setIsDropdownOpen(false);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 font-oswald">Thể loại phù hợp với khóa học của bạn là?</h1>
        <p className="text-gray-600 font-robotoCondensed">
          Oke! bạn không thể đề một cái thể loại phù hợp ngay được. Bạn có thể chỉnh nó sau
        </p>
      </div>

      <div className="mb-8">
        {isLoading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        ) : error ? (
          <div className="text-center py-4 text-red-500">
            <p>{error}</p>
            <button 
              onClick={() => CategoryService.getAllCategories().then(setCategories)}
              className="mt-2 text-green-500 underline"
            >
              Thử lại
            </button>
          </div>
        ) : (
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between border border-gray-300 rounded-md py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-robotoCondensed"
            >
              <span className={selectedCategory ? 'text-black' : 'text-gray-400'}>
                {selectedCategory || 'Chọn thể loại khóa học'}
              </span>
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d={isDropdownOpen ? "M5 15l7-7 7 7" : "M19 9l-7 7-7-7"}
                ></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto font-robotoCondensed">
                  {categories.map((category) => (
                    <li
                      key={category.categoryId}
                      onClick={() => category.categoryType && handleCategorySelect(category.categoryId, category.categoryType)}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category.categoryType ? categoryTypeToVietnamese[category.categoryType] : 'Không xác định'}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
  