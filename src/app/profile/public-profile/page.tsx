'use client';

import React, { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';
import { useAuth } from '@/contexts/AuthContext';

export default function PublicProfilePage() {
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setIsLoading(false);
    }
  }, [user]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-12 h-12 border-t-4 border-[#1dbe70] border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Hồ sơ công khai</h1>
                <p className="text-black mt-2">Đây là cách người khác nhìn thấy hồ sơ của bạn</p>
              </div>

              {/* Public Profile Preview */}
              <div className="border border-gray-200 rounded-lg p-6 mb-8">
                <div className="flex flex-col items-center mb-6">
                  <Image
                    src={user?.avatar || '/avatar.png'}
                    alt="Avatar"
                    width={120}
                    height={120}
                    className="w-[120px] h-[120px] rounded-full mb-4 object-cover"
                  />
                  <h2 className="text-2xl font-bold text-center">{user?.fullName}</h2>
                  {user?.title && <p className="text-gray-600 text-center mt-1">{user.title}</p>}
                </div>

                {user?.description && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Giới thiệu</h3>
                    <p className="text-gray-700 whitespace-pre-wrap">{user.description}</p>
                  </div>
                )}

                {/* Social Links */}
                {(user?.websiteLink ||
                  user?.facebookLink ||
                  user?.linkedinLink ||
                  user?.youtubeLink) && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-2">Liên kết</h3>
                    <div className="flex flex-wrap gap-3">
                      {user?.websiteLink && (
                        <a
                          href={user.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 21C16.9706 21 21 16.9706 21 12C21 7.02944 16.9706 3 12 3C7.02944 3 3 7.02944 3 12C3 16.9706 7.02944 21 12 21Z"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.6001 9H20.4001"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M3.6001 15H20.4001"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12 3C10.2003 5.63187 9.24316 8.71789 9.2001 11.88C9.2001 15.04 10.1701 18.13 12 21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                            <path
                              d="M12.0001 3C13.7998 5.63187 14.757 8.71789 14.8001 11.88C14.8001 15.04 13.8301 18.13 12.0001 21"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            />
                          </svg>
                          Website
                        </a>
                      )}

                      {user?.facebookLink && (
                        <a
                          href={user.facebookLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M24 12C24 5.37258 18.6274 0 12 0C5.37258 0 0 5.37258 0 12C0 17.9895 4.38823 22.954 10.125 23.8542V15.4688H7.07812V12H10.125V9.35625C10.125 6.34875 11.9165 4.6875 14.6576 4.6875C15.9705 4.6875 17.3438 4.92188 17.3438 4.92188V7.875H15.8306C14.34 7.875 13.875 8.80001 13.875 9.74899V12H17.2031L16.6711 15.4688H13.875V23.8542C19.6118 22.954 24 17.9895 24 12Z" />
                          </svg>
                          Facebook
                        </a>
                      )}

                      {user?.linkedinLink && (
                        <a
                          href={user.linkedinLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M20.447 20.452H16.893V14.883C16.893 13.555 16.866 11.846 15.041 11.846C13.188 11.846 12.905 13.291 12.905 14.785V20.452H9.351V9H12.765V10.561H12.811C13.288 9.661 14.448 8.711 16.181 8.711C19.782 8.711 20.448 11.081 20.448 14.166V20.452H20.447ZM5.337 7.433C4.193 7.433 3.274 6.507 3.274 5.368C3.274 4.23 4.194 3.305 5.337 3.305C6.477 3.305 7.401 4.23 7.401 5.368C7.401 6.507 6.476 7.433 5.337 7.433ZM7.119 20.452H3.555V9H7.119V20.452ZM22.225 0H1.771C0.792 0 0 0.774 0 1.729V22.271C0 23.227 0.792 24 1.771 24H22.222C23.2 24 24 23.227 24 22.271V1.729C24 0.774 23.2 0 22.222 0H22.225Z" />
                          </svg>
                          LinkedIn
                        </a>
                      )}

                      {user?.youtubeLink && (
                        <a
                          href={user.youtubeLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
                        >
                          <svg
                            className="w-5 h-5 mr-2"
                            viewBox="0 0 24 24"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M23.498 6.186C23.2393 5.29136 22.6948 4.49932 21.95 3.89C21.189 3.26 20.257 2.93 19.3 2.86C16.136 2.6 11.468 2.6 11.468 2.6C8.51761 2.56333 5.57001 2.73364 2.65 3.11C1.693 3.2 0.764 3.54 0.005 4.17C-0.723 4.80105 -1.24428 5.60445 -1.472 6.5C-1.80599 8.48188 -1.96855 10.4928 -1.957 12.507C-1.97099 14.5223 -1.80363 16.5342 -1.472 18.514C-1.24737 19.4008 -0.724595 20.1952 0 20.814C0.764 21.444 1.692 21.774 2.651 21.864C5.817 22.127 10.48 22.127 10.48 22.127C13.4322 22.1637 16.3798 21.9934 19.3 21.614C20.257 21.544 21.189 21.214 21.95 20.584C22.6807 19.986 23.2251 19.2041 23.499 18.32C23.8297 16.337 23.9923 14.3265 23.985 12.313C24.0064 10.2655 23.8435 8.22064 23.499 6.2L23.498 6.186ZM9.401 16.407V8.593L15.5 12.507L9.401 16.407Z" />
                          </svg>
                          YouTube
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Info box */}
                <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg mt-8">
                  <p className="text-sm text-gray-600">
                    <span className="font-semibold">Lưu ý:</span> Đây là xem trước của hồ sơ công
                    khai của bạn. Bạn có thể quản lý thông tin hiển thị công khai trong phần{' '}
                    <Link href="/profile/edit-privacy" className="text-[#1dbe70] hover:underline">
                      Quyền riêng tư
                    </Link>
                    .
                  </p>
                </div>
              </div>

              <div className="flex justify-start space-x-4">
                <Link
                  href="/profile"
                  className="bg-gray-100 hover:bg-gray-200 text-gray-700 py-2 px-6 rounded transition-colors duration-300"
                >
                  Quay lại chỉnh sửa
                </Link>
                <button
                  onClick={() => {
                    // Logic to copy profile sharing link
                    const shareUrl = `${window.location.origin}/user/${user?.id || ''}`;
                    navigator.clipboard.writeText(shareUrl);
                    alert('Đã sao chép liên kết hồ sơ!');
                  }}
                  className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-6 rounded transition-colors duration-300"
                >
                  Sao chép liên kết chia sẻ
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
