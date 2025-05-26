export const slugify = (text: string): string => {
  return text
    .toLowerCase()
    .trim()
    .replace(/[áàạảãăắằặẳẵâấầậẩẫ]/g, 'a')
    .replace(/[éèẹẻẽêếềệểễ]/g, 'e')
    .replace(/[íìịỉĩ]/g, 'i')
    .replace(/[óòọỏõôốồộổỗơớờợởỡ]/g, 'o')
    .replace(/[úùụủũưứừựửữ]/g, 'u')
    .replace(/[ýỳỵỷỹ]/g, 'y')
    .replace(/đ/g, 'd')
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

export const createInstructorUrl = (name: string, id: string): string => {
  const slug = slugify(name);
  return `/user/${slug}/${id}`;
};

export const parseInstructorSlug = (slug: string): string => {
  return slug.replace(/-/g, ' ');
};
