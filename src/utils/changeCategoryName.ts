export const getCategoryDisplayName = (name: string) => {
  const categoryMap: Record<string, string> = {
    INFORMATION_TECHNOLOGY: 'Công nghệ thông tin',
    MARKETING: 'Marketing',
    FINANCE: 'Tài chính',
    BUSSINESS: 'Kinh doanh',
    DESIGN: 'Thiết kế',
    LIFESTYLE: 'Phong cách sống',
    PERSONAL_DEVELOPMENT: 'Phát triển cá nhân',
    HEALTH: 'Sức khỏe',
    MUSIC: 'Âm nhạc',
    LANGUAGE: 'Ngôn ngữ',
    SCIENCE: 'Khoa học',
    MATH: 'Toán học',
  };

  return categoryMap[name as keyof typeof categoryMap] || name;
};
