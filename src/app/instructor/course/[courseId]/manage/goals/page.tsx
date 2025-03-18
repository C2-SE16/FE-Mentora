'use client';
import { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import ManageCourseHeader from '@/layouts/ManageCourse/ManageCourseHeader';
import ManageCourseSidebar from '@/layouts/ManageCourse/ManageCourseSidebar';
import Link from 'next/link';

export default function GoalsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  // Lấy courseId từ pathname
  const courseId = pathname.split('/')[3]; // Giả sử URL có dạng /instructor/course/[courseId]/manage/goals
  
  // State cho các input fields
  const [learningObjectives, setLearningObjectives] = useState<string[]>(['', '', '', '']);
  const [requirements, setRequirements] = useState<string[]>(['']);
  const [targetAudience, setTargetAudience] = useState<string[]>(['']);
  
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
  const handleSave = () => {
    // Gọi API để lưu thông tin
    console.log('Saving course goals:', {
      learningObjectives: learningObjectives.filter(obj => obj.trim() !== ''),
      requirements: requirements.filter(req => req.trim() !== ''),
      targetAudience: targetAudience.filter(aud => aud.trim() !== '')
    });
    
    // Hiển thị thông báo thành công
    alert('Đã lưu thông tin thành công!');
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <ManageCourseHeader 
        courseId={courseId}
        onBack={() => router.push('/instructor/courses')}
      />
      
      <div className="flex flex-col md:flex-row flex-1">
        <ManageCourseSidebar 
          courseId={courseId}
          currentStep="intended-learners"
        />
        
        <main className="flex-1 bg-white overflow-y-auto">
          <div className="max-w-4xl mx-auto p-6">
            <div className="border border-gray-200 rounded-lg shadow-sm">
              <div className="border-b border-gray-200 bg-gray-50 px-6 py-4">
                <h1 className="text-xl font-bold text-gray-800">Đối tượng học viên</h1>
              </div>
              
              <div className="p-6">
                <p className="text-gray-700 mb-6">
                  Các mô tả sau đây sẽ được hiển thị công khai trên <Link href="#" className="text-blue-600 hover:underline">Trang giới thiệu khóa học</Link> của bạn và sẽ có tác động trực tiếp đến hiệu suất khóa học. Những mô tả này sẽ giúp học viên quyết định xem khóa học của bạn có phù hợp với họ hay không.
                </p>
                
                {/* What will students learn section */}
                <div className="mb-8">
                  <h2 className="font-bold text-gray-800 mb-2">Học viên sẽ học được gì từ khóa học của bạn?</h2>
                  <p className="text-gray-700 mb-4">
                    Bạn phải nhập ít nhất 4 <Link href="#" className="text-blue-600 hover:underline">mục tiêu học tập hoặc kết quả</Link> mà học viên có thể đạt được sau khi hoàn thành khóa học của bạn.
                  </p>
                  
                  {learningObjectives.map((objective, index) => (
                    <div key={`objective-${index}`} className="mb-3 relative">
                      <input
                        type="text"
                        value={objective}
                        onChange={(e) => handleLearningObjectiveChange(index, e.target.value)}
                        placeholder={`Ví dụ: Xác định vai trò và trách nhiệm của một quản lý dự án`}
                        className="w-full border border-gray-300 rounded-md py-2 px-4 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <div className="absolute right-3 top-2 text-gray-400">
                        160
                      </div>
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addField('objective')}
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    Thêm câu trả lời
                  </button>
                </div>
                
                {/* Requirements section */}
                <div className="mb-8">
                  <h2 className="font-bold text-gray-800 mb-2">Yêu cầu hoặc điều kiện tiên quyết để tham gia khóa học của bạn là gì?</h2>
                  <p className="text-gray-700 mb-4">
                    Liệt kê các kỹ năng, kinh nghiệm, công cụ hoặc thiết bị cần thiết mà học viên nên có trước khi tham gia khóa học của bạn.
                    Nếu không có yêu cầu nào, hãy sử dụng không gian này như một cơ hội để giảm rào cản cho người mới bắt đầu.
                  </p>
                  
                  {requirements.map((requirement, index) => (
                    <div key={`requirement-${index}`} className="mb-3 relative">
                      <input
                        type="text"
                        value={requirement}
                        onChange={(e) => handleRequirementChange(index, e.target.value)}
                        placeholder="Ví dụ: Không cần kinh nghiệm lập trình. Bạn sẽ học tất cả những gì bạn cần biết"
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addField('requirement')}
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    Thêm câu trả lời
                  </button>
                </div>
                
                {/* Target audience section */}
                <div className="mb-8">
                  <h2 className="font-bold text-gray-800 mb-2">Khóa học này dành cho ai?</h2>
                  <p className="text-gray-700 mb-4">
                    Viết mô tả rõ ràng về <Link href="#" className="text-blue-600 hover:underline">đối tượng học viên</Link> cho khóa học của bạn, những người sẽ thấy nội dung khóa học của bạn có giá trị.
                    Điều này sẽ giúp bạn thu hút đúng học viên đến với khóa học của bạn.
                  </p>
                  
                  {targetAudience.map((audience, index) => (
                    <div key={`audience-${index}`} className="mb-3">
                      <input
                        type="text"
                        value={audience}
                        onChange={(e) => handleTargetAudienceChange(index, e.target.value)}
                        placeholder="Ví dụ: Lập trình viên Python mới bắt đầu tò mò về khoa học dữ liệu"
                        className="w-full border border-gray-300 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    </div>
                  ))}
                  
                  <button 
                    onClick={() => addField('audience')}
                    className="mt-2 text-blue-600 hover:text-blue-800 flex items-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                      <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd"></path>
                    </svg>
                    Thêm câu trả lời
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSave}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md transition-colors"
              >
                Lưu
              </button>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
} 