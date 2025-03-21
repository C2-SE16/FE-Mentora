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
