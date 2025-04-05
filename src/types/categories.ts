import { CategoryEnum } from '@/types/enum';
import { Course } from './courses';
import { CourseCategory } from '@/types/course_category';

// Interface cho bảng tbl_categories
export interface Category {
  categoryId: string;
  categoryType: CategoryEnum | null;
  courseCategories?: CourseCategory[];
}

// Export CategoryEnum dưới tên CategoryType để tương thích với code hiện tại
export { CategoryEnum as CategoryType };

// Thêm mapping từ CategoryEnum sang tiếng Việt
export const categoryTypeToVietnamese = {
  [CategoryEnum.INFORMATION_TECHNOLOGY]: 'Công nghệ thông tin',
  [CategoryEnum.MARKETING]: 'Marketing',
  [CategoryEnum.FINANCE]: 'Tài chính',
  [CategoryEnum.BUSINESS]: 'Kinh doanh',
};

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
