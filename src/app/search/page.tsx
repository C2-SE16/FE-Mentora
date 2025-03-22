'use client';

import { FC, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import SearchResults from '@/components/modules/searchs/SearchResult';
import {
  searchCourses,
  SearchCourseParams,
  SearchCoursesResponse,
  SortOrder,
} from '@/apis/searchService';

const SearchPage: FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchResults, setSearchResults] = useState<SearchCoursesResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Get search query from URL
  const query = searchParams?.get('q') || '';
  const page = parseInt(searchParams?.get('page') || '1');
  const categoryId = searchParams?.get('category') || undefined;
  const minRating = searchParams?.get('rating')
    ? parseFloat(searchParams.get('rating') || '0')
    : undefined;

  // Function to update URL with new search parameters
  const updateSearchParams = (params: Record<string, string | null>) => {
    const urlSearchParams = new URLSearchParams(searchParams?.toString());

    // Update or remove parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        urlSearchParams.delete(key);
      } else {
        urlSearchParams.set(key, value);
      }
    });

    // Reset to page 1 when filters change
    if (!('page' in params)) {
      urlSearchParams.set('page', '1');
    }

    // Build the new URL
    const newUrl = `${window.location.pathname}?${urlSearchParams.toString()}`;
    router.push(newUrl);
  };

  // Handle rating filter change
  const handleRatingChange = (rating: number) => {
    // If the same rating is clicked again, remove the filter
    if (minRating === rating) {
      updateSearchParams({ rating: null });
    } else {
      updateSearchParams({ rating: rating.toString() });
    }
  };

  useEffect(() => {
    const fetchSearchResults = async () => {
      if (!query) {
        // If no query, set empty results but don't show loading
        setSearchResults({
          courses: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        });
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);

      try {
        // Prepare search parameters
        const params: SearchCourseParams = {
          query,
          page,
          limit: 10,
          minRating,
          categoryId,
          sortBy: 'createdAt',
          sortOrder: SortOrder.DESC,
        };

        // Call the search API
        const results = await searchCourses(params);
        console.log('Search results:', results); // Debug log
        setSearchResults(results);
      } catch (err) {
        console.error('Error fetching search results:', err);
        setError('Failed to load search results. Please try again.');
        // Set empty results on error
        setSearchResults({
          courses: [],
          pagination: { total: 0, page: 1, limit: 10, totalPages: 0 },
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchSearchResults();
  }, [query, page, categoryId, minRating]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <main className="flex-1 max-w-6xl mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">
          {isLoading
            ? 'Đang tìm kiếm...'
            : query
              ? `${searchResults?.pagination?.total || 0} kết quả cho "${query}"`
              : 'Kết quả tìm kiếm'}
        </h1>

        <div className="flex justify-between items-center mb-4">
          <div className="flex space-x-2">
            <button className="border rounded p-2 flex items-center bg-white">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
                />
              </svg>
              <span className="hidden sm:inline">Lọc</span>
            </button>
            <button className="border rounded p-2 flex items-center bg-white">
              <span>Mới nhất</span>
              <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
          <span className="text-gray-600">
            {!isLoading && searchResults?.pagination
              ? `${searchResults.pagination.total} kết quả`
              : ''}
          </span>
        </div>

        <div className="flex flex-col md:flex-row gap-4 md:gap-8">
          <div className="w-full md:w-1/4">
            <div className="bg-white rounded-lg p-4 shadow">
              <h2 className="font-semibold mb-4">Đánh giá</h2>
              <div className="flex flex-col gap-3">
                {[4.5, 4.0, 3.5, 3.0].map((rating) => (
                  <label
                    key={rating}
                    className="flex items-center gap-2 whitespace-nowrap cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      className="form-checkbox h-4 w-4 flex-shrink-0"
                      checked={minRating === rating}
                      onChange={() => handleRatingChange(rating)}
                    />
                    <div className="flex items-center">
                      <span className="w-6 text-right">{rating}</span>
                      <span className="text-yellow-400 mx-1">⭐</span>
                      <span>& lớn hơn</span>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          <div className="w-full md:w-3/4">
            {isLoading ? (
              <div className="flex justify-center items-center h-64 bg-white rounded-lg shadow">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                {error}
              </div>
            ) : searchResults?.courses && searchResults.courses.length > 0 ? (
              <SearchResults courses={searchResults.courses} />
            ) : (
              <div className="bg-white rounded-lg p-8 text-center shadow">
                <p className="text-gray-500">
                  Không tìm thấy khóa học nào phù hợp với tiêu chí của bạn.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default SearchPage;
