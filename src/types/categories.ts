import { Course } from './courses';

// Interface cho bảng tbl_categories
export interface Category {
  categoryId: string;
  name: string | null;
  description: string | null;
  createdAt?: Date | null;
  updatedAt?: Date | null;
}

// Interface cho bảng tbl_course_categories (bảng quan hệ)
export interface CourseCategory {
  courseCategoryId: string;
  categoryId: string | null;
  courseId: string | null;
  category?: Category;
}

// Cập nhật interface Course để bao gồm categories
// export interface CourseWithCategories extends Course {
//   categories?: Category[];
// }

// Interface cho việc hiển thị danh sách categories
export interface CategoryListProps {
  categories: Category[];
  selectedCategoryId?: string;
  onSelectCategory?: (categoryId: string) => void;
}
