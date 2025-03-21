'use client';

import React, { useState } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

export default function PrivacySettingsPage() {
  const [firstName, setFirstName] = useState('Anh');
  const [lastName, setLastName] = useState('Bảo');

  // State cho các tùy chọn quyền riêng tư
  const [showProfile, setShowProfile] = useState(true);
  const [showCourses, setShowCourses] = useState(true);

  const handleSave = () => {
    // Logic lưu các tùy chọn quyền riêng tư
    console.log('Save privacy');
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
                <h1 className="text-3xl font-bold font-oswald">Quyền riêng tư</h1>
                <p className="text-black mt-2">Sửa đổi cài đặt quyền riêng tư của bạn tại đây</p>
              </div>

              {/* Privacy Settings */}
              <div className="mb-8">
                <div className="bg-white p-6">
                  <h2 className="text-base font-medium mb-6">Cài đặt trang hồ sơ</h2>

                  <div className="space-y-6">
                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="showProfile"
                          type="checkbox"
                          checked={showProfile}
                          onChange={() => setShowProfile(!showProfile)}
                          className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="showProfile" className="text-black">
                          Hiển thị hồ sơ của bạn cho người dùng đăng nhập
                        </label>
                      </div>
                    </div>

                    <div className="flex items-start">
                      <div className="flex h-5 items-center">
                        <input
                          id="showCourses"
                          type="checkbox"
                          checked={showCourses}
                          onChange={() => setShowCourses(!showCourses)}
                          className="h-4 w-4 text-[#1dbe70] border-gray-300 focus:ring-[#1dbe70]"
                        />
                      </div>
                      <div className="ml-3 text-sm">
                        <label htmlFor="showCourses" className="text-black">
                          Hiển thị các khóa học bạn đang tham gia trong hồ sơ của mình
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-start">
                    <button
                      onClick={handleSave}
                      className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-6 rounded-lg shadow-custom transition-colors duration-300 text-sm font-medium w-24"
                    >
                      Lưu
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
