'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

export default function ProfilePage() {
  const [firstName, setFirstName] = useState('Anh');
  const [lastName, setLastName] = useState('Bảo');
  const [title, setTitle] = useState('');
  const [biography, setBiography] = useState('');
  const [language, setLanguage] = useState('Tiếng Việt');
  const [website, setWebsite] = useState('');
  const [facebook, setFacebook] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [youtube, setYoutube] = useState('');

  const handleSave = () => {
    console.log('Save profile');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <ProfileSidebar firstName={firstName} lastName={lastName} />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6">
              <div className="mb-8">
                <h1 className="text-3xl font-bold text-center font-oswald">Hồ sơ công khai</h1>
                <p className="text-center text-black mt-2">Thêm thông tin về bạn</p>
              </div>

              <div className="mb-8">
                <h2 className="text-base font-semibold mb-4">Thông tin cơ bản</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Tên"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Họ"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="Tiêu đề"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>

                  <div>
                    <div className="border border-gray-300 rounded-lg">
                      <div className="flex border-b border-gray-300">
                        <button className="p-2 border-r border-gray-300 font-bold">B</button>
                        <button className="p-2 border-r border-gray-300 italic">I</button>
                      </div>
                      <textarea
                        value={biography}
                        onChange={(e) => setBiography(e.target.value)}
                        placeholder="Giới thiệu về bạn..."
                        className="w-full p-2 min-h-[100px] outline-none"
                      ></textarea>
                    </div>
                  </div>

                  <div>
                    <select
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70] bg-white"
                    >
                      <option value="Tiếng Việt">Tiếng Việt</option>
                      <option value="English">English</option>
                    </select>
                  </div>
                </div>
              </div>

              <div className="mb-8">
                <h2 className="text-base font-semibold mb-4">Liên kết:</h2>
                <div className="space-y-4">
                  <div>
                    <input
                      type="text"
                      value={website}
                      onChange={(e) => setWebsite(e.target.value)}
                      placeholder="Website (https://...)"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>

                  <div className="flex">
                    <div className="bg-gray-100 p-2 border border-gray-300 rounded-l-lg">
                      http://www.facebook.com/
                    </div>
                    <input
                      type="text"
                      value={facebook}
                      onChange={(e) => setFacebook(e.target.value)}
                      placeholder="Hồ Sơ Facebook"
                      className="flex-1 border-t border-r border-b border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>

                  <div className="flex">
                    <div className="bg-gray-100 p-2 border border-gray-300 rounded-l-lg">
                      http://www.linkedin.com/
                    </div>
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="Hồ Sơ LinkedIn"
                      className="flex-1 border-t border-r border-b border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>

                  <div className="flex">
                    <div className="bg-gray-100 p-2 border border-gray-300 rounded-l-lg">
                      http://www.youtube.com/
                    </div>
                    <input
                      type="text"
                      value={youtube}
                      onChange={(e) => setYoutube(e.target.value)}
                      placeholder="Hồ Sơ Youtube"
                      className="flex-1 border-t border-r border-b border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={handleSave}
                  className="bg-[#00FF84] hover:bg-[#64e2a7] text-black py-2 px-8 rounded transition-colors duration-300text-center text-[14px] font-semibold  no-underline"
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
