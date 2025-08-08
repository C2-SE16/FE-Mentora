import axiosInstance from '@/lib/api/axios';

// Define the sort order enum to match the backend
export enum SortOrder {
  ASC = 'asc',
  DESC = 'desc',
}

// Interface for search parameters matching the backend DTO
export interface SearchCourseParams {
  query?: string;
  page?: number;
  limit?: number;
  minRating?: number;
  categoryId?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  minPrice?: number;
  maxPrice?: number;
}

export interface CourseResult {
  id: string;
  title: string;
  description: string;
  price: number;
  discountPrice: number;
  thumbnail: string;
  instructor: string;
  instructorAvatar: string;
  rating: number;
  ratingCount: number;
  categories: { id: string; name: string }[];
}

export interface SearchCoursesResponse {
  courses: CourseResult[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export const searchCourses = async (params: SearchCourseParams): Promise<SearchCoursesResponse> => {
  try {
    const response = await axiosInstance.get('/courses/search', { params });
    return response.data;
  } catch (error) {
    console.error('Error searching courses:', error);
    throw error;
  }
};

/**
 * Get course details by ID
 * @param courseId The ID of the course to fetch
 * @returns Promise with course details
 */
export const getCourseById = async (courseId: string): Promise<CourseResult> => {
  try {
    const response = await axiosInstance.get(`/courses/${courseId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching course ${courseId}:`, error);
    throw error;
  }
};

/**
 * Get featured or recommended courses
 * @param limit Number of courses to fetch
 * @returns Promise with featured courses
 */
export const getFeaturedCourses = async (limit: number = 6): Promise<CourseResult[]> => {
  try {
    const response = await axiosInstance.get('/courses/featured', { params: { limit } });
    return response.data;
  } catch (error) {
    console.error('Error fetching featured courses:', error);
    throw error;
  }
};

/**
 * Get courses by category
 * @param categoryId The ID of the category
 * @param limit Number of courses to fetch
 * @returns Promise with courses in the specified category
 */
export const getCoursesByCategory = async (
  categoryId: string,
  limit: number = 10
): Promise<CourseResult[]> => {
  try {
    const response = await axiosInstance.get('/courses/search', {
      params: {
        categoryId,
        limit,
        sortBy: 'rating',
        sortOrder: SortOrder.DESC,
      },
    });
    return response.data.courses;
  } catch (error) {
    console.error(`Error fetching courses for category ${categoryId}:`, error);
    throw error;
  }
};
