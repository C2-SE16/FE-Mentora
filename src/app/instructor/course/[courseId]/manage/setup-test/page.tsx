'use client';
import { useState } from 'react';
import React from 'react';

const SetupAndTestVideoPage = () => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
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
      formData.append('chunkIndex', i.toString());
      formData.append('totalChunks', totalChunks.toString());
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
    <div className="w-full max-w-4xl mx-auto p-3 sm:p-6">
      <div className="bg-white p-4 sm:p-6 rounded-lg shadow-md">
        <h2 className="text-lg sm:text-xl font-bold mb-4">Upload Course Video</h2>

        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
            <input
              type="file"
              accept="video/*"
              onChange={handleFileChange}
              className="text-sm sm:text-base w-full sm:w-auto"
            />
            <button
              onClick={uploadVideo}
              disabled={isUploading || !selectedFile}
              className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50 text-sm sm:text-base w-full sm:w-auto"
            >
              {isUploading ? 'Uploading...' : 'Upload Video'}
            </button>
          </div>

          {selectedFile && (
            <p className="text-xs sm:text-sm break-all">
              <span className="font-medium">Selected:</span> {selectedFile.name}
            </p>
          )}

          {uploadProgress > 0 && (
            <div className="mt-4">
              <p className="text-sm sm:text-base mb-1">
                Upload Progress: {Math.round(uploadProgress)}%
              </p>
              <div className="w-full bg-gray-300 rounded h-2">
                <div
                  className="bg-blue-500 h-2 rounded"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {message && <p className="mt-4 text-green-500 text-sm sm:text-base">{message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SetupAndTestVideoPage;
