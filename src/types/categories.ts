import { CategoryEnum } from '@/types/enum';
import { Course } from './courses';
import { CourseCategory } from '@/types/course_category';

// Interface cho bảng tbl_categories
export interface Category {
  categoryId: string;
  categoryType: CategoryEnum | null;
  courseCategories?: CourseCategory[];
}

// Interface cho bảng tbl_course_categories (bảng quan hệ)

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
