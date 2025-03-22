'use client';
import ManageCourseHeader from '@/layouts/ManageCourse/ManageCourseHeader';
import ManageCourseSidebar from '@/layouts/ManageCourse/ManageCourseSidebar';
import { usePathname, useRouter } from 'next/navigation';
import React, { useState } from 'react';

const SetupAndTestVideoPage = () => {
  const router = useRouter();
  const pathname = usePathname() ?? ''; // Fix lỗi null
  const courseId = pathname.split('/')[3] || ''; // Fix lỗi undefined

  const [selectedFile, setSelectedFile] = useState<File | null>(null); // Fix lỗi TS
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState('');

  // Xử lý khi chọn file
  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]; // Lấy file đầu tiên từ input
    if (file) {
      setSelectedFile(file);
      setUploadProgress(0);
      setMessage('');
    }
  };

  // Upload file theo từng chunk
  const uploadVideo = async () => {
    if (!selectedFile) return alert('Please select a video file');

    setIsUploading(true);
    const chunkSize = 5 * 1024 * 1024; // 5MB mỗi chunk
    const totalChunks = Math.ceil(selectedFile.size / chunkSize);
    const fileName = `${Date.now()}-${selectedFile.name}`;

    for (let i = 0; i < totalChunks; i++) {
      const start = i * chunkSize;
      const end = Math.min(selectedFile.size, start + chunkSize);
      const chunk = selectedFile.slice(start, end);

      const formData = new FormData();
      formData.append('chunk', chunk);
      formData.append('chunkIndex', i.toString()); // Fix lỗi TS
      formData.append('totalChunks', totalChunks.toString()); // Fix lỗi TS
      formData.append('fileName', fileName);

      await fetch('http://localhost:9090/upload/chunk', {
        method: 'POST',
        body: formData,
      });

      setUploadProgress(((i + 1) / totalChunks) * 100);
    }

    // Gửi yêu cầu ghép file
    await fetch('http://localhost:9090/upload/merge', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, totalChunks }),
    });

    setMessage('Video uploaded successfully!');
    setIsUploading(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* <ManageCourseHeader courseId={courseId} onBack={() => router.push('/instructor/courses')} /> */}

      <div className="flex flex-col md:flex-row flex-1">
        <ManageCourseSidebar courseId={courseId} currentStep="intended-learners" />

        <main className="flex-1 bg-gray p-4">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Upload Course Video</h2>

            <input type="file" accept="video/*" onChange={handleFileChange} className="mb-4" />
            {selectedFile && <p className="text-sm">Selected: {selectedFile.name}</p>}

            <button
              onClick={uploadVideo}
              disabled={isUploading}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>

            {uploadProgress > 0 && (
              <div className="mt-4">
                <p>Upload Progress: {Math.round(uploadProgress)}%</p>
                <div className="w-full bg-gray-300 rounded h-2">
                  <div
                    className="bg-blue-500 h-2 rounded"
                    style={{ width: `${uploadProgress}%` }}
                  ></div>
                </div>
              </div>
            )}

            {message && <p className="mt-4 text-green-500">{message}</p>}
          </div>
        </main>
      </div>
    </div>
  );
};

export default SetupAndTestVideoPage;
