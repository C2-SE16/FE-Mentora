import { Course, Module } from "@/types/courses";

// Dữ liệu mẫu cho khóa học
export const getCourse = (courseId: string): Course => {
  return {
    courseId,
    title: "Your Step-by-Step Guide to Becoming a Professional Software Tester",
    description: "Học cách trở thành một Software Tester chuyên nghiệp với lộ trình chi tiết từng bước",
    rating: 4.5,
    ratingCount: 2,
    enrollments: 2000,
    price: 599000,
    instructor: "Nguyễn Hữu Hoàng",
    language: "Tiếng Việt",
    features: [
      "37 hours on-demand video",
      "8 articles",
      "3 downloadable resources",
      "Full lifetime access",
      "Certificate of completion"
    ]
  };
};

// Dữ liệu mẫu cho các module và bài học
export const getModules = (): Module[] => {
  return [
    {
      moduleId: "1",
      title: "Giới thiệu",
      lessons: [
        { 
          lessonId: "1", 
          title: "Requirement Material", 
          type: "VIDEO", 
          isFree: true,
          contentUrl: "https://example.com/videos/lesson1.mp4",
          duration: 360 // 6 phút
        },
        { 
          lessonId: "2", 
          title: "Giới thiệu nhanh", 
          type: "VIDEO", 
          isFree: true,
          contentUrl: "https://example.com/videos/lesson2.mp4",
          duration: 480 // 8 phút
        },
      ]
    },
    {
      moduleId: "2",
      title: "Giới thiệu nhanh",
      lessons: [
        { 
          lessonId: "3", 
          title: "Giới thiệu nhanh", 
          type: "VIDEO", 
          isFree: false,
          contentUrl: "https://example.com/videos/lesson3.mp4",
          duration: 720 // 12 phút
        },
        { 
          lessonId: "4", 
          title: "Test 1", 
          type: "QUIZ", 
          isFree: false 
        },
      ]
    },
    {
      moduleId: "3",
      title: "Giới thiệu",
      lessons: [
        { 
          lessonId: "5", 
          title: "Giới thiệu", 
          type: "VIDEO", 
          isFree: false,
          contentUrl: "https://example.com/videos/lesson5.mp4",
          duration: 540 // 9 phút
        },
      ]
    },
    {
      moduleId: "4",
      title: "Giới thiệu",
      lessons: [
        { 
          lessonId: "6", 
          title: "Giới thiệu", 
          type: "VIDEO", 
          isFree: false,
          contentUrl: "https://example.com/videos/lesson6.mp4",
          duration: 600 // 10 phút
        },
      ]
    },
    {
      moduleId: "5",
      title: "Giới thiệu",
      lessons: [
        { 
          lessonId: "7", 
          title: "Giới thiệu", 
          type: "VIDEO", 
          isFree: false,
          contentUrl: "https://example.com/videos/lesson7.mp4",
          duration: 420 // 7 phút
        },
      ]
    }
  ];
};

// Hàm tìm bài học và module theo lessonId
export const findLessonAndModule = (lessonId: string) => {
  const modules = getModules();
  let currentLesson = null;
  let currentModule = null;

  for (const module of modules) {
    const lesson = module.lessons.find(l => l.lessonId === lessonId);
    if (lesson) {
      currentLesson = lesson;
      currentModule = module;
      break;
    }
  }

  return { currentLesson, currentModule, modules };
}; 