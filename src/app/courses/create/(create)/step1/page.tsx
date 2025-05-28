'use client';
import { useState, useEffect } from 'react';

export default function Step1() {
  const [title, setTitle] = useState('');
  const [charCount, setCharCount] = useState(0);
  const maxChars = 60;

  // Lấy tiêu đề từ localStorage nếu có
  useEffect(() => {
    const savedTitle = localStorage.getItem('courseTitle');
    if (savedTitle) {
      setTitle(savedTitle);
      setCharCount(savedTitle.length);
    }
  }, []);

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    if (newTitle.length <= maxChars) {
      setTitle(newTitle);
      setCharCount(newTitle.length);

      // Lưu tiêu đề vào localStorage
      localStorage.setItem('courseTitle', newTitle);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <div className="text-center mb-12">
        <h1 className="text-3xl font-bold mb-4 font-oswald">
          Tiêu đề mà bạn muốn đặt cho khóa học của bạn
        </h1>
        <p className="text-gray-600 font-robotoCondensed">
          Oke! bạn không thể tạo một cái tiêu đề tốt ngay được. Bạn có thể chỉnh nó sau
        </p>
      </div>

      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            value={title}
            onChange={handleTitleChange}
            placeholder="e.g. Khóa học python..."
            className="w-full border border-gray-300 rounded-md py-3 px-4 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent font-robotoCondensed"
          />
          <div className="absolute right-3 top-3 text-gray-400 font-robotoCondensed">
            {charCount}/{maxChars}
          </div>
        </div>
      </div>
    </div>
  );
}
