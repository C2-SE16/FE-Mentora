import { FC } from 'react';
import SearchResults from '@/components/modules/searchs/SearchResult';

const SearchPage: FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">10.000 kết quả cho &ldquo;python&rdquo;</h1>
        
        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button className="border rounded p-2 flex items-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="hidden sm:inline">Lọc</span>
            </button>
            <button className="border rounded p-2 flex items-center">
              <span>Mới nhất</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          </div>
          <span className="text-gray-600">10.000 kết quả</span>
        </div>
        
        <div className="flex gap-8">
          <div className="w-1/4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="font-semibold mb-4">Đánh giá</h2>
              <div className="flex flex-col gap-3">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label key={rating} className="flex items-center gap-2">
                    <input type="checkbox" className="form-checkbox h-4 w-4" />
                    <span>{rating} ⭐ & lớn hơn</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          
          <div className="w-3/4">
            <SearchResults />
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;