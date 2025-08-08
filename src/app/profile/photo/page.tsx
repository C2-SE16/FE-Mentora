'use client';

import React, { useState, useRef } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';
import api from '@/apis/api';
import toast from 'react-hot-toast';
import { useAuth } from '@/contexts/AuthContext';

export default function ProfilePhotoPage() {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { refetchUser } = useAuth();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleCancelPreview = () => {
    setPreviewImage(null);
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSave = async () => {
    if (!selectedFile) {
      toast.error('Vui lòng chọn ảnh trước khi lưu');
      return;
    }

    try {
      setIsUploading(true);

      const formData = new FormData();
      formData.append('file', selectedFile);

      const token = localStorage.getItem('accessToken');

      const response = await api.post('upload-image/avatar', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.data && response.data.data.success) {
        toast.success('Cập nhật ảnh đại diện thành công');

        await refetchUser();

        window.dispatchEvent(new CustomEvent('avatar-updated'));

        handleCancelPreview();
      } else {
        toast.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
      }
    } catch (error) {
      console.error('Error uploading avatar:', error);
      console.log(error);
      toast.error('Có lỗi xảy ra khi cập nhật ảnh đại diện');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            {/* Sidebar */}
            <ProfileSidebar />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Ảnh</h1>
                <p className="text-black mt-2">Thêm một bức ảnh vào hồ sơ của bạn</p>
              </div>

              {/* Image Preview Section */}
              <div className="mb-8 cursor-pointer">
                <h2 className="text-base font-normal mb-4">Xem trước ảnh</h2>
                <div className="border border-gray-300 rounded w-full mx-auto h-[260px] flex flex-col items-center justify-center">
                  {previewImage ? (
                    <>
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="max-h-[220px] max-w-full object-contain"
                      />
                      <button
                        onClick={handleCancelPreview}
                        className="mt-2 bg-gray-200 hover:bg-gray-300 text-gray-700 py-1 px-3 rounded-md text-sm"
                      >
                        Hủy chọn ảnh
                      </button>
                    </>
                  ) : (
                    <div className="w-24 h-24 rounded-full bg-gray-200 flex items-center justify-center ">
                      <svg
                        className="w-16 h-16 text-gray-400"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.5" />
                        <path
                          d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                        <path
                          d="M19 19C17.89 17.97 16.57 17.21 15.13 16.77C14.47 17.55 13.28 18 12 18C10.72 18 9.53 17.55 8.87 16.77C7.43 17.21 6.11 17.97 5 19"
                          stroke="currentColor"
                          strokeWidth="1.5"
                        />
                      </svg>
                    </div>
                  )}
                </div>
              </div>

              {/* Upload Section */}
              <div className="mb-8">
                <h2 className="text-base font-normal mb-4">Thêm / Thay đổi ảnh</h2>
                <div className="flex flex-col sm:flex-row items-center gap-2">
                  <div className="w-full flex-1 border border-gray-300 rounded bg-white py-2 px-3 text-gray-700">
                    <input
                      type="text"
                      className="w-full focus:outline-none"
                      readOnly
                      placeholder="Không có tệp nào được chọn"
                      value={selectedFile ? selectedFile.name : ''}
                    />
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/png,image/jpg,image/webp"
                    className="hidden"
                    onChange={handleFileChange}
                  />
                  <button
                    onClick={handleUploadClick}
                    className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded mt-2 sm:mt-0"
                    disabled={isUploading}
                  >
                    Tải ảnh lên
                  </button>
                  {previewImage && (
                    <button
                      onClick={handleCancelPreview}
                      className="w-full sm:w-auto bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-2 px-4 rounded mt-2 sm:mt-0"
                      disabled={isUploading}
                    >
                      Hủy
                    </button>
                  )}
                </div>
              </div>

              {/* Save Button */}
              <div>
                <button
                  onClick={handleSave}
                  className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-6 rounded transition-colors duration-300 flex items-center"
                  disabled={isUploading || !selectedFile}
                >
                  {isUploading ? (
                    <>
                      <div className="w-5 h-5 border-t-2 border-black rounded-full animate-spin mr-2"></div>
                      Đang tải lên...
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
