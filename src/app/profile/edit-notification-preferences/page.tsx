'use client';

import React, { useState } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

export default function NotificationSettingsPage() {
  const [firstName, setFirstName] = useState('Anh');
  const [lastName, setLastName] = useState('Bảo');

  // State cho các tùy chọn thông báo
  const [serviceUpdates, setServiceUpdates] = useState(true);
  const [productUpdates, setProductUpdates] = useState(true);
  const [promotions, setPromotions] = useState(true);
  const [learningEnabled, setLearningEnabled] = useState(true);
  const [learningStats, setLearningStats] = useState(true);
  const [inspiration, setInspiration] = useState(true);
  const [courseSuggestions, setCourseSuggestions] = useState(true);
  const [instructorNotifications, setInstructorNotifications] = useState(true);

  const handleSave = () => {
    // Logic lưu các tùy chọn thông báo
    console.log('Lưu tùy chọn thông báo');
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar firstName={firstName} lastName={lastName} />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Tùy chọn thông báo</h1>
                <p className="text-black mt-2">Quản lý các loại liên lạc bạn nhận được</p>
              </div>

              {/* Service Updates */}
              <div className="mb-6 border border-gray-300 bg-white p-4">
                <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                  <h2 className="text-base font-normal">Cập nhật và dịch vụ</h2>
                  <label className="inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      className="sr-only peer"
                      checked={serviceUpdates}
                      onChange={() => setServiceUpdates(!serviceUpdates)}
                    />
                    <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF84]"></div>
                  </label>
                </div>

                <div className="space-y-4 ml-1">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="productUpdates"
                      checked={productUpdates}
                      onChange={() => setProductUpdates(!productUpdates)}
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                    />
                    <label htmlFor="productUpdates" className="ml-2 text-sm text-black">
                      Ra mắt sản phẩm và thông báo
                    </label>
                  </div>

                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="promotions"
                      checked={promotions}
                      onChange={() => setPromotions(!promotions)}
                      className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                    />
                    <label htmlFor="promotions" className="ml-2 text-sm text-black">
                      Cung cấp và khuyến mãi
                    </label>
                  </div>
                </div>
              </div>

              {/* Learning Section */}
              <div className="mb-8">
                <div className="border border-gray-300bg-white p-4">
                  <div className="flex justify-between items-center mb-4 border-b border-gray-300 pb-4">
                    <h2 className="text-base font-medium">Học tập của bạn</h2>
                    <label className="inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={learningEnabled}
                        onChange={() => setLearningEnabled(!learningEnabled)}
                      />
                      <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#00FF84]"></div>
                    </label>
                  </div>

                  <div className="space-y-4 ml-1">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="learningStats"
                        checked={learningStats}
                        onChange={() => setLearningStats(!learningStats)}
                        className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      />
                      <label htmlFor="learningStats" className="ml-2 text-sm text-black">
                        Thông kê học tập
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="inspiration"
                        checked={inspiration}
                        onChange={() => setInspiration(!inspiration)}
                        className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      />
                      <label htmlFor="inspiration" className="ml-2 text-sm text-black">
                        Cảm hứng (mẹo, câu chuyện, v.v.)
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="courseSuggestions"
                        checked={courseSuggestions}
                        onChange={() => setCourseSuggestions(!courseSuggestions)}
                        className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      />
                      <label htmlFor="courseSuggestions" className="ml-2 text-sm text-black">
                        Gợi ý khóa học
                      </label>
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="instructorNotifications"
                        checked={instructorNotifications}
                        onChange={() => setInstructorNotifications(!instructorNotifications)}
                        className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                      />
                      <label htmlFor="instructorNotifications" className="ml-2 text-sm text-black">
                        Thông báo từ giảng viên
                      </label>
                    </div>
                  </div>
                </div>
              </div>

              {/* Note */}
              <div className="mb-4">
                <p className="text-sm text-gray-600">
                  <span className="font-medium">Lưu ý:</span> Có thể mất một vài giờ để các thay đổi
                  được phản ánh trong sở thích của bạn. Bạn vẫn sẽ nhận được các email giao dịch
                  liên quan đến tài khoản của bạn và mua hàng nếu bạn hủy đăng ký.
                </p>
              </div>

              {/* Save Button */}
              <div className="flex justify-start mb-5">
                <button
                  onClick={handleSave}
                  className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-8 rounded-lg shadow-custom transition-colors duration-300 text-sm font-medium"
                >
                  Lưu
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
