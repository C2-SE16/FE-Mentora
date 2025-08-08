'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import CategoryService from '@/apis/categoryService';
import { Category } from '@/types/categories';

export default function Step2() {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [courseTitle, setCourseTitle] = useState<string | null>(null);
  const [validationError, setValidationError] = useState<string | null>(null);

  // Lấy danh sách categories từ API khi component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        const data = await CategoryService.getAllCategories();
        setCategories(data);
        setError(null);
      } catch (err) {
        console.error('Lỗi khi lấy danh sách categories:', err);
        setError('Không thể tải danh sách thể loại. Vui lòng thử lại sau.');
      } finally {
        setIsLoading(false);
      }
    };

    // Lấy tiêu đề khóa học từ localStorage
    const savedTitle = localStorage.getItem('courseTitle');
    if (savedTitle) {
      setCourseTitle(savedTitle);
    } else {
      setValidationError('Vui lòng nhập tiêu đề khóa học ở bước 1');
    }

    fetchCategories();
  }, []);

  const handleCategorySelect = (categoryId: string, categoryName: string | null) => {
    setSelectedCategoryId(categoryId);
    setSelectedCategory(categoryName);
    setIsDropdownOpen(false);
    setValidationError(null);
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 font-oswald">
          Thể loại phù hợp với khóa học của bạn là?
        </h1>
        <p className="text-gray-600 font-robotoCondensed">
          Bạn có thể chọn thể loại hoặc để trống. Bạn có thể chỉnh sửa sau.
        </p>
      </div>

      {/* Chỉ hiển thị thông báo lỗi khi thiếu tiêu đề */}
      {validationError && !courseTitle && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md text-red-600">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                clipRule="evenodd"
              ></path>
            </svg>
            <span className="font-medium">{validationError}</span>
          </div>
          <button
            onClick={() => router.push('/courses/create/step1')}
            className="mt-2 text-sm text-red-700 underline"
          >
            Quay lại bước 1
          </button>
        </div>
      )}

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
              className={`w-full flex items-center justify-between border rounded-md py-3 px-4 bg-white focus:outline-none focus:ring-2 focus:ring-green-500 font-robotoCondensed ${!selectedCategory && !courseTitle ? 'border-red-300' : 'border-gray-300'}`}
              data-selected-category-id={selectedCategoryId}
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
                  d={isDropdownOpen ? 'M5 15l7-7 7 7' : 'M19 9l-7 7-7-7'}
                ></path>
              </svg>
            </button>

            {isDropdownOpen && (
              <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
                <ul className="py-1 max-h-60 overflow-auto font-robotoCondensed">
                  {categories.map((category) => (
                    <li
                      key={category.categoryId}
                      onClick={() =>
                        category.categoryId &&
                        handleCategorySelect(category.categoryId, category.name)
                      }
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    >
                      {category.name ? category.name : 'Không xác định'}
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
