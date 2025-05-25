export interface Category {
  id?: string;
  name?: string;
}

export interface Course {
  id: string;
  courseId?: string;
  title: string;
  instructor: string;
  rating: number;
  reviews: number;
  currentPrice: string;
  originalPrice: string;
  isBestSeller: boolean;
  image: string;
  updatedDate: string;
  totalHours: number;
  level?: string;
  description?: string;
  categories?: Category[];
  subtitle?: boolean;
  thumbnail?: string;
  price?: string;
  hasDiscount?: boolean;
  discountPercentage?: number;
  voucherCode?: string;
  createdAt?: string;
}

export interface Topic {
  id: string;
  name: string;
  courseCount: number;
}

export interface Mentor {
  id: string;
  name: string;
  role: string;
  avatar: string;
  courseCount: number;
  rating: number;
}
