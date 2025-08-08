import { Course, Module, LessonType } from '@/types/courses';

// Dữ liệu mẫu cho khóa học
export const getCourse = (courseId: string): Course => {
  return {
    courseId,
    instructorId: '1',
    title: 'Your Step-by-Step Guide to Becoming a Professional Software Tester',
    description:
      'Học cách trở thành một Software Tester chuyên nghiệp với lộ trình chi tiết từng bước',
    overview: 'Khóa học toàn diện về kiểm thử phần mềm',
    durationTime: 2220, // Tổng thời gian (phút)
    price: 599000,
    approved: null,
    rating: 4.5,
    comment: null,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Dữ liệu mẫu cho các module và bài học
export const getModules = (): Module[] => {
  return [
    {
      moduleId: '1',
      courseId: '1',
      title: 'Giới thiệu',
      orderIndex: 1,
      description: 'Module giới thiệu khóa học',
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [
        {
          lessonId: '1',
          moduleId: '1',
          title: 'Requirement Material',
          contentType: LessonType.VIDEO,
          isFree: true,
          contentUrl: 'https://example.com/videos/lesson1.mp4',
          duration: 360, // 6 phút
          orderIndex: 1,
          description: 'Tài liệu yêu cầu cho khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lessonId: '2',
          moduleId: '1',
          title: 'Giới thiệu nhanh',
          contentType: LessonType.VIDEO,
          isFree: true,
          contentUrl: 'https://example.com/videos/lesson2.mp4',
          duration: 480, // 8 phút
          orderIndex: 2,
          description: 'Giới thiệu tổng quan về khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      moduleId: '2',
      courseId: '1',
      title: 'Giới thiệu nhanh',
      orderIndex: 2,
      description: 'Module giới thiệu chi tiết',
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [
        {
          lessonId: '3',
          moduleId: '2',
          title: 'Giới thiệu nhanh',
          contentType: LessonType.VIDEO,
          isFree: false,
          contentUrl: 'https://example.com/videos/lesson3.mp4',
          duration: 720, // 12 phút
          orderIndex: 1,
          description: 'Giới thiệu chi tiết về khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          lessonId: '4',
          moduleId: '2',
          title: 'Test 1',
          contentType: LessonType.QUIZ,
          isFree: false,
          contentUrl: '',
          duration: 0,
          orderIndex: 2,
          description: 'Bài kiểm tra đầu tiên',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      moduleId: '3',
      courseId: '1',
      title: 'Giới thiệu',
      orderIndex: 3,
      description: 'Module giới thiệu bổ sung',
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [
        {
          lessonId: '5',
          moduleId: '3',
          title: 'Giới thiệu',
          contentType: LessonType.VIDEO,
          isFree: false,
          contentUrl: 'https://example.com/videos/lesson5.mp4',
          duration: 540, // 9 phút
          orderIndex: 1,
          description: 'Giới thiệu bổ sung về khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      moduleId: '4',
      courseId: '1',
      title: 'Giới thiệu',
      orderIndex: 4,
      description: 'Module giới thiệu nâng cao',
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [
        {
          lessonId: '6',
          moduleId: '4',
          title: 'Giới thiệu',
          contentType: LessonType.VIDEO,
          isFree: false,
          contentUrl: 'https://example.com/videos/lesson6.mp4',
          duration: 600, // 10 phút
          orderIndex: 1,
          description: 'Giới thiệu nâng cao về khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
    {
      moduleId: '5',
      courseId: '1',
      title: 'Giới thiệu',
      orderIndex: 5,
      description: 'Module giới thiệu kết thúc',
      createdAt: new Date(),
      updatedAt: new Date(),
      lessons: [
        {
          lessonId: '7',
          moduleId: '5',
          title: 'Giới thiệu',
          contentType: LessonType.VIDEO,
          isFree: false,
          contentUrl: 'https://example.com/videos/lesson7.mp4',
          duration: 420, // 7 phút
          orderIndex: 1,
          description: 'Giới thiệu kết thúc khóa học',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
    },
  ];
};

// Hàm tìm bài học và module theo lessonId
export const findLessonAndModule = (lessonId: string) => {
  const modules = getModules();
  let currentLesson = null;
  let currentModule = null;

  for (const module of modules) {
    const lesson = module.lessons?.find((l) => l.lessonId === lessonId);
    if (lesson) {
      currentLesson = lesson;
      currentModule = module;
      break;
    }
  }

  return { currentLesson, currentModule, modules };
};

// Mock Courses Data
export const mockCourses: any[] = [
  // DEVELOPMENT Courses
  {
    courseId: 'course1',
    title: 'Lập Trình React.js từ Zero đến Hero',
    shortDescription: 'Học cách xây dựng ứng dụng web hiện đại với React.js',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=React.js',
    price: 1299000,
    discountPrice: 799000,
    rating: 4.8,
    totalStudents: 3245,
    totalReviews: 842,
    tbl_instructors: {
      instructorId: 'inst1',
      instructorName: 'Nguyễn Văn A',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=NVA',
    },
    categoryType: 'DEVELOPMENT',
    level: 'ALL',
  },
  {
    courseId: 'course2',
    title: 'Node.js và Express - Xây dựng RESTful API',
    shortDescription: 'Học cách tạo API mạnh mẽ với Node.js và Express',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Node.js',
    price: 1199000,
    discountPrice: 699000,
    rating: 4.6,
    totalStudents: 2198,
    totalReviews: 532,
    tbl_instructors: {
      instructorId: 'inst2',
      instructorName: 'Trần Thị B',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=TTB',
    },
    categoryType: 'DEVELOPMENT',
    level: 'INTERMEDIATE',
  },

  // IT_SOFTWARE Courses
  {
    courseId: 'course3',
    title: 'Machine Learning cơ bản với Python',
    shortDescription: 'Hiểu và áp dụng các thuật toán Machine Learning',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=ML',
    price: 1499000,
    discountPrice: 999000,
    rating: 4.9,
    totalStudents: 4127,
    totalReviews: 1053,
    tbl_instructors: {
      instructorId: 'inst3',
      instructorName: 'Lê Văn C',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=LVC',
    },
    categoryType: 'IT_SOFTWARE',
    level: 'ADVANCED',
  },
  {
    courseId: 'course4',
    title: 'DevOps với Docker và Kubernetes',
    shortDescription: 'Làm chủ các công cụ container hàng đầu trong ngành',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=DevOps',
    price: 1699000,
    discountPrice: 1299000,
    rating: 4.7,
    totalStudents: 1865,
    totalReviews: 421,
    tbl_instructors: {
      instructorId: 'inst4',
      instructorName: 'Phạm Thị D',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=PTD',
    },
    categoryType: 'IT_SOFTWARE',
    level: 'INTERMEDIATE',
  },

  // BUSINESS Courses
  {
    courseId: 'course5',
    title: 'Quản lý Dự án Chuyên nghiệp',
    shortDescription: 'Phương pháp quản lý dự án hiệu quả trong môi trường kinh doanh',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=PM',
    price: 1199000,
    discountPrice: 899000,
    rating: 4.5,
    totalStudents: 2765,
    totalReviews: 634,
    tbl_instructors: {
      instructorId: 'inst5',
      instructorName: 'Hoàng Văn E',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=HVE',
    },
    categoryType: 'BUSINESS',
    level: 'BEGINNER',
  },

  // DESIGN Courses
  {
    courseId: 'course6',
    title: 'UI/UX Design Masterclass',
    shortDescription: 'Thiết kế giao diện người dùng hiệu quả và đẹp mắt',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=UI/UX',
    price: 1399000,
    discountPrice: 899000,
    rating: 4.8,
    totalStudents: 3102,
    totalReviews: 876,
    tbl_instructors: {
      instructorId: 'inst6',
      instructorName: 'Ngô Thị F',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=NTF',
    },
    categoryType: 'DESIGN',
    level: 'ALL',
  },

  // MARKETING Courses
  {
    courseId: 'course7',
    title: 'Digital Marketing Toàn diện',
    shortDescription: 'Chiến lược marketing số cho doanh nghiệp hiện đại',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Marketing',
    price: 1299000,
    discountPrice: 899000,
    rating: 4.6,
    totalStudents: 4521,
    totalReviews: 1243,
    tbl_instructors: {
      instructorId: 'inst7',
      instructorName: 'Đinh Văn G',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=DVG',
    },
    categoryType: 'MARKETING',
    level: 'BEGINNER',
  },

  // FINANCE_ACCOUNTING Courses
  {
    courseId: 'course8',
    title: 'Kế toán Doanh nghiệp Thực tế',
    shortDescription: 'Nắm vững kỹ năng kế toán cần thiết cho doanh nghiệp',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Accounting',
    price: 1199000,
    discountPrice: 899000,
    rating: 4.5,
    totalStudents: 1987,
    totalReviews: 423,
    tbl_instructors: {
      instructorId: 'inst8',
      instructorName: 'Lý Thị H',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=LTH',
    },
    categoryType: 'FINANCE_ACCOUNTING',
    level: 'INTERMEDIATE',
  },

  // PERSONAL_DEVELOPMENT Courses
  {
    courseId: 'course9',
    title: 'Kỹ năng Giao tiếp Hiệu quả',
    shortDescription: 'Nâng cao khả năng giao tiếp trong công việc và cuộc sống',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Communication',
    price: 899000,
    discountPrice: 599000,
    rating: 4.7,
    totalStudents: 5624,
    totalReviews: 1876,
    tbl_instructors: {
      instructorId: 'inst9',
      instructorName: 'Võ Văn I',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=VVI',
    },
    categoryType: 'PERSONAL_DEVELOPMENT',
    level: 'ALL',
  },

  // HEALTH_FITNESS Courses
  {
    courseId: 'course10',
    title: 'Yoga cho người bận rộn',
    shortDescription: 'Tập yoga hiệu quả trong 20 phút mỗi ngày',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Yoga',
    price: 799000,
    discountPrice: 499000,
    rating: 4.9,
    totalStudents: 7832,
    totalReviews: 2134,
    tbl_instructors: {
      instructorId: 'inst10',
      instructorName: 'Đặng Thị K',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=DTK',
    },
    categoryType: 'HEALTH_FITNESS',
    level: 'BEGINNER',
  },

  // MUSIC Courses
  {
    courseId: 'course11',
    title: 'Guitar cơ bản cho người mới bắt đầu',
    shortDescription: 'Học đàn guitar từ con số 0',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Guitar',
    price: 899000,
    discountPrice: 599000,
    rating: 4.8,
    totalStudents: 4521,
    totalReviews: 1243,
    tbl_instructors: {
      instructorId: 'inst11',
      instructorName: 'Trương Văn L',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=TVL',
    },
    categoryType: 'MUSIC',
    level: 'BEGINNER',
  },

  // OFFICE_PRODUCTIVITY Courses
  {
    courseId: 'course12',
    title: 'Excel nâng cao cho doanh nghiệp',
    shortDescription: 'Làm chủ Excel với các kỹ thuật phân tích dữ liệu nâng cao',
    thumbnail: 'https://placehold.co/600x400/1dbe70/FFFFFF.png?text=Excel',
    price: 899000,
    discountPrice: 599000,
    rating: 4.6,
    totalStudents: 6271,
    totalReviews: 1532,
    tbl_instructors: {
      instructorId: 'inst12',
      instructorName: 'Mai Văn M',
      avatar: 'https://placehold.co/300x300/1dbe70/FFFFFF.png?text=MVM',
    },
    categoryType: 'OFFICE_PRODUCTIVITY',
    level: 'ADVANCED',
  },
];


export const mockCategories:  any[] = [
  {
    categoryId: 'cat1',
    categoryType: 'DEVELOPMENT',
    createdAt: '2023-01-15T08:30:00Z',
    updatedAt: '2023-01-15T08:30:00Z',
  },
  {
    categoryId: 'cat2',
    categoryType: 'BUSINESS',
    createdAt: '2023-01-16T09:15:00Z',
    updatedAt: '2023-01-16T09:15:00Z',
  },
  {
    categoryId: 'cat3',
    categoryType: 'FINANCE_ACCOUNTING',
    createdAt: '2023-01-17T10:20:00Z',
    updatedAt: '2023-01-17T10:20:00Z',
  },
  {
    categoryId: 'cat4',
    categoryType: 'IT_SOFTWARE',
    createdAt: '2023-01-18T11:45:00Z',
    updatedAt: '2023-01-18T11:45:00Z',
  },
  {
    categoryId: 'cat5',
    categoryType: 'OFFICE_PRODUCTIVITY',
    createdAt: '2023-01-19T13:10:00Z',
    updatedAt: '2023-01-19T13:10:00Z',
  },
  {
    categoryId: 'cat6',
    categoryType: 'PERSONAL_DEVELOPMENT',
    createdAt: '2023-01-20T14:25:00Z',
    updatedAt: '2023-01-20T14:25:00Z',
  },
  {
    categoryId: 'cat7',
    categoryType: 'DESIGN',
    createdAt: '2023-01-21T15:30:00Z',
    updatedAt: '2023-01-21T15:30:00Z',
  },
  {
    categoryId: 'cat8',
    categoryType: 'MARKETING',
    createdAt: '2023-01-22T16:45:00Z',
    updatedAt: '2023-01-22T16:45:00Z',
  },
  {
    categoryId: 'cat9',
    categoryType: 'HEALTH_FITNESS',
    createdAt: '2023-01-23T17:50:00Z',
    updatedAt: '2023-01-23T17:50:00Z',
  },
  {
    categoryId: 'cat10',
    categoryType: 'MUSIC',
    createdAt: '2023-01-24T18:15:00Z',
    updatedAt: '2023-01-24T18:15:00Z',
  },
];