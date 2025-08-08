'use client';

import React, { useEffect, useState } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';
import api from '@/apis/api';
import toast from 'react-hot-toast';
import { ProfileFormData } from '@/interfaces/profile-form';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, refetchUser, isLoggedIn, isLoading } = useAuth();
  const router = useRouter();
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    fullName: '',
    title: '',
    description: '',
    websiteLink: '',
    facebookLink: '',
    linkedinLink: '',
    youtubeLink: '',
  });
  const [language, setLanguage] = useState('Tiếng Việt');

  // Khởi tạo form data khi user data được tải
  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || '',
        title: user.title || '',
        description: user.description || '',
        websiteLink: user.websiteLink || '',
        facebookLink: user.facebookLink || '',
        linkedinLink: user.linkedinLink || '',
        youtubeLink: user.youtubeLink || '',
      });
    }
  }, [user]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = async () => {
    try {
      setIsUpdating(true);

      // Create a copy of formData to work with
      const updateData = { ...formData };

      // Format website link if it's not empty
      if (updateData.websiteLink && updateData.websiteLink.trim() !== '') {
        if (
          !updateData.websiteLink.startsWith('http://') &&
          !updateData.websiteLink.startsWith('https://')
        ) {
          updateData.websiteLink = `https://${updateData.websiteLink}`;
        }
      } else {
        delete updateData.websiteLink;
      }

      // Handle social media links
      if (updateData.facebookLink && updateData.facebookLink.trim() !== '') {
        updateData.facebookLink = `http://www.facebook.com/${updateData.facebookLink.replace(/^(https?:\/\/)?(www\.)?facebook\.com\/?/i, '')}`;
      } else {
        delete updateData.facebookLink;
      }

      if (updateData.linkedinLink && updateData.linkedinLink.trim() !== '') {
        updateData.linkedinLink = `http://www.linkedin.com/${updateData.linkedinLink.replace(/^(https?:\/\/)?(www\.)?linkedin\.com\/?/i, '')}`;
      } else {
        delete updateData.linkedinLink;
      }

      if (updateData.youtubeLink && updateData.youtubeLink.trim() !== '') {
        updateData.youtubeLink = `http://www.youtube.com/${updateData.youtubeLink.replace(/^(https?:\/\/)?(www\.)?youtube\.com\/?/i, '')}`;
      } else {
        delete updateData.youtubeLink;
      }

      // Get the token
      const token = localStorage.getItem('accessToken');

      // Call the API
      const response = await api.patch('user/profile', updateData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data) {
        toast.success('Cập nhật hồ sơ thành công');
        await refetchUser();
        window.dispatchEvent(new CustomEvent('profile-updated'));
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      if (error instanceof AxiosError && error.response && error.response.data) {
        const errorData = error.response.data;
        console.log('Error details:', errorData);
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật hồ sơ');
      }
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <ProfileSidebar />

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
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleChange}
                      placeholder="Tên"
                      className="w-full border border-gray-300 rounded-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>
                  <div>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
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
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
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
                      name="websiteLink"
                      value={formData.websiteLink}
                      onChange={handleChange}
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
                      name="facebookLink"
                      value={formData.facebookLink}
                      onChange={handleChange}
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
                      name="linkedinLink"
                      value={formData.linkedinLink}
                      onChange={handleChange}
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
                      name="youtubeLink"
                      value={formData.youtubeLink}
                      onChange={handleChange}
                      placeholder="Hồ Sơ Youtube"
                      className="flex-1 border-t border-r border-b border-gray-300 rounded-r-lg p-2 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-start">
                <button
                  onClick={handleSave}
                  disabled={isUpdating}
                  className="bg-[#00FF84] hover:bg-[#64e2a7] text-black py-2 px-8 rounded transition-colors duration-300 text-center text-[14px] font-semibold no-underline flex items-center"
                >
                  {isUpdating ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-black rounded-full animate-spin mr-2"></div>
                      Đang lưu...
                    </>
                  ) : (
                    'Lưu'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
