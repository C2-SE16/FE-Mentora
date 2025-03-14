import { Course } from './courses';

// Enum tương ứng với category_enum trong Prisma
export enum CategoryType {
  INFORMATION_TECHNOLOGY = 'INFORMATION_TECHNOLOGY',
  MARKETING = 'MARKETING',
  FINANCE = 'FINANCE',
  BUSSINESS = 'BUSSINESS'
}

// Interface cho bảng tbl_categories
export interface Category {
  categoryId: string;
  categoryType: CategoryType | null;
  courseCategories?: CourseCategory[];
}

// Interface cho bảng tbl_course_categories (bảng quan hệ)
export interface CourseCategory {
  courseCategoryId: string;
  categoryId: string | null;
  courseId: string | null;
  category?: Category;
  course?: Course;
}

// Cập nhật interface Course để bao gồm categories
export interface CourseWithCategories extends Course {
  categories?: Category[];
  courseCategories?: CourseCategory[];
}

// Interface cho việc hiển thị danh sách categories
export interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
}

// Mapping từ CategoryType sang tên hiển thị tiếng Việt
export const categoryTypeToVietnamese: Record<CategoryType, string> = {
  [CategoryType.INFORMATION_TECHNOLOGY]: 'IT & Phần mềm',
  [CategoryType.MARKETING]: 'Marketing',
  [CategoryType.FINANCE]: 'Tài chính',
  [CategoryType.BUSSINESS]: 'Kinh doanh'
}; 