'use client';
import { useState } from 'react';
import { Curriculum, CurriculumType, Lecture, Quiz } from '@/types/courses';
import LectureService from '@/apis/lectureService';
import { toast } from 'react-hot-toast';
import LectureContentUploader from './LectureContentUploader';
import { useRouter } from 'next/navigation';

interface CurriculumItemProps {
  curriculum: Curriculum;
  curriculumIndex: number;
  moduleId: string;
  courseId: string;
  curriculumRef: (el: HTMLDivElement | null) => void;
  movingCurriculumId: string | null;
  handleCurriculumTitleChange: (moduleId: string, curriculumId: string, newTitle: string) => void;
  handleCurriculumTypeChange: (
    moduleId: string,
    curriculumId: string,
    newType: CurriculumType
  ) => void;
  handleMoveCurriculumUp: (moduleId: string, curriculumIndex: number) => void;
  handleMoveCurriculumDown: (moduleId: string, curriculumIndex: number) => void;
  handleDeleteCurriculum: (moduleId: string, curriculumId: string) => void;
  totalCurricula: number;
  fetchModules: () => Promise<void>;
}

export default function CurriculumItem({
  curriculum,
  curriculumIndex,
  moduleId,
  courseId,
  curriculumRef,
  movingCurriculumId,
  handleCurriculumTitleChange,
  handleCurriculumTypeChange,
  handleMoveCurriculumUp,
  handleMoveCurriculumDown,
  handleDeleteCurriculum,
  totalCurricula,
  fetchModules,
}: CurriculumItemProps) {
  const [expanded, setExpanded] = useState(false);
  const [showDescriptionInput, setShowDescriptionInput] = useState(false);
  const [description, setDescription] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [showUploader, setShowUploader] = useState(false);
  const [title, setTitle] = useState(curriculum.title || '');
  const router = useRouter();

  // Lấy thông tin từ lecture hoặc quiz
  const getLectureOrQuizInfo = () => {
    if (curriculum.content) {
      return curriculum.content;
    }
    return null;
  };

  const contentInfo = getLectureOrQuizInfo();

  // Kiểm tra kiểu dữ liệu trước khi truy cập thuộc tính
  const hasContent =
    contentInfo &&
    ((curriculum.type === 'LECTURE' &&
      'videoUrl' in contentInfo &&
      (('videoUrl' in contentInfo && contentInfo.videoUrl) ||
        ('articleContent' in contentInfo && contentInfo.articleContent))) ||
      (curriculum.type === 'QUIZ' &&
        'questions' in contentInfo &&
        contentInfo.questions &&
        contentInfo.questions.length > 0));

  // Xử lý cập nhật mô tả
  const handleUpdateDescription = async () => {
    if (!contentInfo || curriculum.type !== 'LECTURE') return;

    try {
      setIsUpdating(true);
      const lectureId = (contentInfo as Lecture).lectureId;
      await LectureService.updateLectureDescription(lectureId, description);
      toast.success('Đã cập nhật mô tả bài giảng');
      setShowDescriptionInput(false);
      fetchModules(); // Cập nhật lại dữ liệu
    } catch (error: any) {
      toast.error('Không thể cập nhật mô tả: ' + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Thêm hàm xử lý thay đổi tiêu đề
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    handleCurriculumTitleChange(moduleId, curriculum.curriculumId, newTitle);
  };

  // Hiển thị icon tương ứng với loại curriculum
  const renderCurriculumTypeIcon = (type: CurriculumType) => {
    switch (type) {
      case 'LECTURE':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-blue-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
            <path d="M14 6a2 2 0 012-2h2a2 2 0 012 2v8a2 2 0 01-2 2h-2a2 2 0 01-2-2V6z" />
          </svg>
        );
      case 'QUIZ':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-purple-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'CODING_EXERCISE':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-green-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'PRACTICE':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-yellow-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
            <path
              fillRule="evenodd"
              d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
              clipRule="evenodd"
            />
          </svg>
        );
      case 'ASSIGNMENT':
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-red-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
            <path
              fillRule="evenodd"
              d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
              clipRule="evenodd"
            />
          </svg>
        );
      default:
        return (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 text-gray-600"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path
              fillRule="evenodd"
              d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
              clipRule="evenodd"
            />
          </svg>
        );
    }
  };

  // Xử lý khi nhấn nút thêm/chỉnh sửa nội dung
  const handleContentButtonClick = () => {
    if (curriculum.type === 'LECTURE') {
      setShowUploader(true);
    } else if (curriculum.type === 'QUIZ') {
      console.log('curriculum', curriculum);
      const quizContent = curriculum.content as Quiz;
      if (quizContent && 'quizId' in quizContent) {
        router.push(`/instructor/course/${courseId}/manage/curriculum/quiz/${quizContent.quizId}`);
      } else {
        toast.error('Không tìm thấy thông tin bài kiểm tra');
      }
    }
  };

  return (
    <div
      ref={curriculumRef}
      data-curriculum-id={curriculum.curriculumId}
      className={`border border-gray-200 rounded-md mb-2 transition-all duration-500 ease-in-out group ${
        movingCurriculumId === curriculum.curriculumId ? 'bg-blue-50' : ''
      }`}
    >
      <div className="p-3 flex items-center">
        <div className="mr-2">{renderCurriculumTypeIcon(curriculum.type)}</div>

        <div className="flex-1">
          <div className="flex items-center">
            <input
              type="text"
              value={title}
              onChange={handleTitleChange}
              placeholder={`Nhập tiêu đề ${curriculum.type === 'LECTURE' ? 'bài giảng' : 'bài kiểm tra'}`}
              className="w-full border-0 bg-transparent focus:ring-0 text-gray-800"
            />
          </div>

          {contentInfo && (
            <div className="text-xs text-gray-500 mt-1">
              {contentInfo &&
                curriculum.type === 'LECTURE' &&
                'videoUrl' in contentInfo &&
                contentInfo.videoUrl && (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Video{' '}
                    {'duration' in contentInfo && contentInfo.duration
                      ? `(${Math.floor(contentInfo.duration / 60)}:${String(contentInfo.duration % 60).padStart(2, '0')})`
                      : ''}
                  </span>
                )}
              {contentInfo &&
                curriculum.type === 'LECTURE' &&
                'articleContent' in contentInfo &&
                contentInfo.articleContent && (
                  <span className="flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3 mr-1"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Bài viết
                  </span>
                )}
              {contentInfo && curriculum.type === 'QUIZ' && (
                <span className="flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-3 w-3 mr-1"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                    <path
                      fillRule="evenodd"
                      d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z"
                      clipRule="evenodd"
                    />
                  </svg>
                  {'questions' in contentInfo && contentInfo.questions
                    ? `${contentInfo.questions.length} câu hỏi`
                    : 'Bài kiểm tra'}
                  {'timeLimit' in contentInfo && contentInfo.timeLimit
                    ? ` (${contentInfo.timeLimit} phút)`
                    : ''}
                </span>
              )}
              {contentInfo.isFree && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-1 rounded">
                  Miễn phí
                </span>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center ml-2">
          <button
            onClick={() => handleMoveCurriculumUp(moduleId, curriculumIndex)}
            disabled={curriculumIndex === 0}
            className={`p-1 mr-1 ${curriculumIndex === 0 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleMoveCurriculumDown(moduleId, curriculumIndex)}
            disabled={curriculumIndex === totalCurricula - 1}
            className={`p-1 mr-1 ${curriculumIndex === totalCurricula - 1 ? 'text-gray-400' : 'text-blue-600 hover:text-blue-800'}`}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </button>
          <button
            onClick={() => handleDeleteCurriculum(moduleId, curriculum.curriculumId)}
            className="p-1 text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity duration-200"
            title="Xóa curriculum"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </button>

          {curriculum.type === 'LECTURE' && (
            <button
              onClick={handleContentButtonClick}
              className="ml-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200"
              title="Thêm nội dung"
            >
              {hasContent ? 'Chỉnh sửa' : '+ Nội dung'}
            </button>
          )}

          {curriculum.type === 'QUIZ' && (
            <button
              onClick={handleContentButtonClick}
              className="ml-2 px-2 py-1 text-xs bg-purple-100 text-purple-700 rounded hover:bg-purple-200"
              title="Thêm câu hỏi"
            >
              {hasContent ? 'Chỉnh sửa' : '+ Câu hỏi'}
            </button>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="ml-2 p-1 text-gray-500 hover:text-gray-700"
            title={expanded ? 'Thu gọn' : 'Mở rộng'}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-4 w-4 transition-transform ${expanded ? 'transform rotate-180' : ''}`}
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>

      {expanded && (
        <div className="px-3 pb-3 pt-0 border-t border-gray-100 mt-1">
          {!showDescriptionInput ? (
            <div className="flex justify-between items-center">
              <div className="text-sm text-gray-600">
                {contentInfo && 'description' in contentInfo && contentInfo.description ? (
                  <div>
                    <span className="font-medium">Mô tả:</span> {contentInfo.description}
                  </div>
                ) : (
                  <span className="text-gray-400">Chưa có mô tả</span>
                )}
              </div>
              <button
                onClick={() => {
                  setShowDescriptionInput(true);
                  if (contentInfo && 'description' in contentInfo) {
                    setDescription(contentInfo.description || '');
                  }
                }}
                className="text-xs text-blue-600 hover:text-blue-800"
              >
                {contentInfo && 'description' in contentInfo && contentInfo.description
                  ? 'Chỉnh sửa mô tả'
                  : 'Thêm mô tả'}
              </button>
            </div>
          ) : (
            <div className="space-y-2">
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Nhập mô tả cho bài giảng..."
                className="w-full p-2 border border-gray-300 rounded-md text-sm"
                rows={3}
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowDescriptionInput(false)}
                  className="px-3 py-1 text-xs text-gray-600 border border-gray-300 rounded-md hover:bg-gray-100"
                  disabled={isUpdating}
                >
                  Hủy
                </button>
                <button
                  onClick={handleUpdateDescription}
                  className="px-3 py-1 text-xs text-white bg-blue-600 rounded-md hover:bg-blue-700"
                  disabled={isUpdating}
                >
                  {isUpdating ? 'Đang lưu...' : 'Lưu mô tả'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Hiển thị uploader khi cần */}
      {showUploader && curriculum.type === 'LECTURE' && contentInfo && (
        <LectureContentUploader
          lecture={contentInfo as Lecture}
          courseId={courseId}
          onClose={() => setShowUploader(false)}
          onSuccess={() => {
            setShowUploader(false);
            fetchModules(); // Cập nhật lại dữ liệu sau khi upload thành công
          }}
        />
      )}
    </div>
  );
}
