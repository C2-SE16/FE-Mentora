'use client';
import { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CreateCourseService } from '@/apis/createCourseService';
import { toast } from 'react-hot-toast';

export default function GoalsPage() {
  const pathname = usePathname();

  // Lấy courseId từ pathname
  const courseId = pathname ? pathname.split('/')[3] : '';

  // State cho các input fields
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['', '', '', '']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['']);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Lấy dữ liệu từ API khi component được mount
  useEffect(() => {
    const fetchCourseGoals = async () => {
      if (!courseId) return;

      try {
        setIsLoading(true);
        setErrorMessage(null);
        const courseDetails = await CreateCourseService.getCourseGoalsDetails(courseId);

        // Cập nhật state với dữ liệu từ API
        if (courseDetails.learningObjectives && courseDetails.learningObjectives.length > 0) {
          setLearningObjectives(
            courseDetails.learningObjectives
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((obj) => obj.description)
          );
        }

        if (courseDetails.requirements && courseDetails.requirements.length > 0) {
          setRequirements(
            courseDetails.requirements
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((req) => req.description)
          );
        }

        if (courseDetails.targetAudience && courseDetails.targetAudience.length > 0) {
          setTargetAudience(
            courseDetails.targetAudience
              .sort((a, b) => a.orderIndex - b.orderIndex)
              .map((aud) => aud.description)
          );
        }
      } catch (error: any) {
        setErrorMessage(error.message || 'Không thể tải thông tin khóa học');
        console.error('Lỗi khi tải thông tin khóa học:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourseGoals();
  }, [courseId]);

  // Xử lý thay đổi learning objectives
  const handleLearningObjectiveChange = (index: number, value: string) => {
    const newObjectives = [...learningObjectives];
    newObjectives[index] = value;
    setLearningObjectives(newObjectives);
  };

  // Xử lý thay đổi requirements
  const handleRequirementChange = (index: number, value: string) => {
    const newRequirements = [...requirements];
    newRequirements[index] = value;
    setRequirements(newRequirements);
  };

  // Xử lý thay đổi target audience
  const handleTargetAudienceChange = (index: number, value: string) => {
    const newAudience = [...targetAudience];
    newAudience[index] = value;
    setTargetAudience(newAudience);
  };

  // Thêm field mới
  const addField = (type: 'objective' | 'requirement' | 'audience') => {
    if (type === 'objective') {
      setLearningObjectives([...learningObjectives, '']);
    } else if (type === 'requirement') {
      setRequirements([...requirements, '']);
    } else {
      setTargetAudience([...targetAudience, '']);
    }
  };

  // Lưu thông tin
  const handleSave = async () => {
    if (!courseId) {
      setErrorMessage('Không tìm thấy ID khóa học');
      return;
    }

    // Lưu vị trí cuộn hiện tại
    const scrollPosition = window.scrollY;

    try {
      setIsLoading(true);
      setErrorMessage(null);
      setSuccessMessage(null);

      // Lọc bỏ các mục trống
      const filteredObjectives = learningObjectives.filter((obj) => obj.trim() !== '');
      const filteredRequirements = requirements.filter((req) => req.trim() !== '');
      const filteredAudience = targetAudience.filter((aud) => aud.trim() !== '');

      // Kiểm tra số lượng mục tiêu học tập
      if (filteredObjectives.length < 4) {
        console.log('Không đủ mục tiêu học tập:', filteredObjectives.length);
        setIsLoading(false);
        setErrorMessage('Bạn phải nhập ít nhất 4 mục tiêu học tập');

        // Khôi phục vị trí cuộn sau khi hiển thị thông báo lỗi
        setTimeout(() => {
          window.scrollTo({
            top: scrollPosition,
            behavior: 'auto',
          });
        }, 0);

        return;
      }

      // Cập nhật tất cả thông tin
      await Promise.all([
        CreateCourseService.updateLearningObjectives(courseId, filteredObjectives),
        CreateCourseService.updateRequirements(courseId, filteredRequirements),
        CreateCourseService.updateTargetAudience(courseId, filteredAudience),
      ]);

      setSuccessMessage('Đã lưu thông tin thành công!');

      // Cập nhật lại dữ liệu từ server
      const updatedGoals = await CreateCourseService.getCourseGoalsDetails(courseId);

      // Cập nhật state với dữ liệu mới
      if (updatedGoals.learningObjectives && updatedGoals.learningObjectives.length > 0) {
        setLearningObjectives(
          updatedGoals.learningObjectives
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((obj) => obj.description)
        );
      } else {
        // Nếu không có mục tiêu học tập, đặt lại mảng với 4 chuỗi rỗng
        setLearningObjectives(['', '', '', '']);
      }

      if (updatedGoals.requirements && updatedGoals.requirements.length > 0) {
        setRequirements(
          updatedGoals.requirements
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((req) => req.description)
        );
      } else {
        // Nếu không có yêu cầu, đặt lại mảng với 1 chuỗi rỗng
        setRequirements(['']);
      }

      if (updatedGoals.targetAudience && updatedGoals.targetAudience.length > 0) {
        setTargetAudience(
          updatedGoals.targetAudience
            .sort((a, b) => a.orderIndex - b.orderIndex)
            .map((aud) => aud.description)
        );
      } else {
        // Nếu không có đối tượng mục tiêu, đặt lại mảng với 1 chuỗi rỗng
        setTargetAudience(['']);
      }

      // Khôi phục vị trí cuộn sau khi cập nhật thành công
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto',
        });
      }, 0);
    } catch (error: any) {
      setErrorMessage(error.message || 'Không thể lưu thông tin khóa học');
      console.error('Lỗi khi lưu thông tin khóa học:', error);

      // Khôi phục vị trí cuộn sau khi hiển thị thông báo lỗi
      setTimeout(() => {
        window.scrollTo({
          top: scrollPosition,
          behavior: 'auto',
        });
      }, 0);
    } finally {
      setIsLoading(false);
    }
  };

  // Tự động ẩn thông báo thành công và lỗi sau 5 giây
  useEffect(() => {
    if (successMessage || errorMessage) {
      const timer = setTimeout(() => {
        if (successMessage) setSuccessMessage(null);
        if (errorMessage) setErrorMessage(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [successMessage, errorMessage]);

  return (
    <>
      {/* Thông báo cố định */}
      {errorMessage && (
        <div className="fixed top-16 left-0 right-0 z-50 mx-auto max-w-4xl px-4">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded shadow-md relative">
            <span className="block sm:inline">{errorMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setErrorMessage(null)}
            >
              <span className="text-red-500">×</span>
            </button>
          </div>
        </div>
      )}

      {successMessage && (
        <div className="fixed top-16 left-0 right-0 z-50 mx-auto max-w-4xl px-4">
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded shadow-md relative">
            <span className="block sm:inline">{successMessage}</span>
            <button
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setSuccessMessage(null)}
            >
              <span className="text-green-500">×</span>
            </button>
          </div>
        </div>
      )}

      {isLoading ? (
        <div className="flex justify-center items-center h-full py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      ) : (
        <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
          <div className="border border-gray-200 rounded-lg shadow-sm">
            <div className="border-b border-gray-200 bg-gray-50 px-4 sm:px-6 py-4">
              <h1 className="text-lg sm:text-xl font-bold text-gray-800">Đối tượng học viên</h1>
            </div>

            <div className="p-4 sm:p-6">
              <p className="text-sm sm:text-base text-gray-700 mb-6">
                Các mô tả sau đây sẽ được hiển thị công khai trên{' '}
                <Link href="#" className="text-blue-600 hover:underline">
                  Trang giới thiệu khóa học
                </Link>{' '}
                của bạn và sẽ có tác động trực tiếp đến hiệu suất khóa học. Những mô tả này sẽ giúp
                học viên quyết định xem khóa học của bạn có phù hợp với họ hay không.
              </p>

              {/* What will students learn section */}
              <div className="mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  Học viên sẽ học được gì từ khóa học của bạn?
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Bạn phải nhập ít nhất 4{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    mục tiêu học tập hoặc kết quả
                  </Link>{' '}
                  mà học viên có thể đạt được sau khi hoàn thành khóa học của bạn.
                </p>

                {learningObjectives.map((objective, index) => (
                  <div key={`objective-${index}`} className="mb-3 relative">
                    <input
                      type="text"
                      value={objective}
                      onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
                      placeholder={`Ví dụ: Xác định vai trò và trách nhiệm của một quản lý dự án`}
                      className="w-full border border-gray-300 rounded-md py-2 px-4 pr-12 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <div className="absolute right-3 top-2 text-gray-400 text-xs sm:text-sm">
                      160
                    </div>
                  </div>
                ))}

                <button
                  onClick={() => addField('objective')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Thêm câu trả lời
                </button>
              </div>

              {/* Requirements section */}
              <div className="mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  Yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn là gì?
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị cần thiết mà học viên nên
                  có trước khi tham gia khóa học của bạn. Nếu không có yêu cầu nào, hãy sử dụng
                  không gian này như một cơ hội để giảm rào cản cho người mới bắt đầu.
                </p>

                {requirements.map((requirement, index) => (
                  <div key={`requirement-${index}`} className="mb-3 relative">
                    <input
                      type="text"
                      value={requirement}
                      onChange={(e) => handleRequirementChange(index, e.target.value)}
                      placeholder="Ví dụ: Không cần kinh nghiệm lập trình. Bạn sẽ học tất cả những gì bạn cần biết"
                      className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addField('requirement')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Thêm câu trả lời
                </button>
              </div>

              {/* Target audience section */}
              <div className="mb-8">
                <h2 className="text-base sm:text-lg font-bold text-gray-800 mb-2">
                  Khóa học này dành cho ai?
                </h2>
                <p className="text-sm sm:text-base text-gray-700 mb-4">
                  Viết mô tả rõ ràng về{' '}
                  <Link href="#" className="text-blue-600 hover:underline">
                    đối tượng học viên
                  </Link>{' '}
                  cho khóa học của bạn, những người sẽ thấy Nội dung khóa học của bạn có giá trị.
                  Điều này sẽ giúp bạn thu hút đúng học viên đến với khóa học của bạn.
                </p>

                {targetAudience.map((audience, index) => (
                  <div key={`audience-${index}`} className="mb-3">
                    <input
                      type="text"
                      value={audience}
                      onChange={(e) => handleTargetAudienceChange(index, e.target.value)}
                      placeholder="Ví dụ: Lập trình viên Python mới bắt đầu tò mò về khoa học dữ liệu"
                      className="w-full border border-gray-300 rounded-md py-2 px-4 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                ))}

                <button
                  onClick={() => addField('audience')}
                  className="mt-2 text-blue-600 hover:text-blue-800 flex items-center text-sm sm:text-base"
                >
                  <svg
                    className="w-3 h-3 sm:w-4 sm:h-4 mr-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                      clipRule="evenodd"
                    ></path>
                  </svg>
                  Thêm câu trả lời
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button
              onClick={handleSave}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-md text-sm sm:text-base transition-colors"
            >
              Lưu
            </button>
          </div>
        </div>
      )}
    </>
  );
}
