'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

// Mock data for subscriptions/purchased courses
const mockSubscriptions = [
  {
    id: 'sub1',
    courseName: 'Lập Trình React Từ Zero Đến Hero',
    instructor: 'Nguyễn Văn A',
    price: 999000,
    purchaseDate: '2023-10-15',
    expiryDate: '2024-10-15',
    status: 'active',
    progress: 45,
    imageUrl: '/course-images/react-course.jpg',
  },
  {
    id: 'sub2',
    courseName: 'Python cho người mới bắt đầu',
    instructor: 'Trần Thị B',
    price: 799000,
    purchaseDate: '2023-08-22',
    expiryDate: '2024-08-22',
    status: 'active',
    progress: 78,
    imageUrl: '/course-images/python-course.jpg',
  },
  {
    id: 'sub3',
    courseName: 'UI/UX Design Masterclass',
    instructor: 'Lê Đức C',
    price: 1299000,
    purchaseDate: '2023-11-05',
    expiryDate: '2024-11-05',
    status: 'active',
    progress: 12,
    imageUrl: '/course-images/uiux-course.jpg',
  },
  {
    id: 'sub4',
    courseName: 'Machine Learning cơ bản',
    instructor: 'Phạm Thị D',
    price: 1499000,
    purchaseDate: '2023-07-10',
    expiryDate: '2024-07-10',
    status: 'active',
    progress: 92,
    imageUrl: '/course-images/ml-course.jpg',
  },
];

// Format currency to VND
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
    minimumFractionDigits: 0,
  }).format(amount);
};

// Format date to Vietnamese format
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('vi-VN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

export default function EditSubscriptionPage() {
  const [subscriptions, setSubscriptions] = useState(mockSubscriptions);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedSubscription, setSelectedSubscription] = useState<string | null>(null);

  const handleCancelSubscription = (subscriptionId: string) => {
    setSelectedSubscription(subscriptionId);
    setShowCancelModal(true);
  };

  const confirmCancelSubscription = () => {
    if (selectedSubscription) {
      // In a real application, you would call an API to cancel the subscription
      // For now, we'll just update the local state
      setSubscriptions(subscriptions.filter((sub) => sub.id !== selectedSubscription));
      setShowCancelModal(false);
      setSelectedSubscription(null);
    }
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Gói đăng ký</h1>
                <p className="text-black mt-2">Quản lý các khóa học bạn đã mua</p>
              </div>

              {/* Subscriptions List */}
              <div className="mb-8">
                {subscriptions.length > 0 ? (
                  <div className="space-y-6">
                    {subscriptions.map((subscription) => (
                      <div
                        key={subscription.id}
                        className="border border-gray-200 rounded-lg overflow-hidden"
                      >
                        <div className="flex flex-col md:flex-row">
                          {/* Course Image */}
                          <div className="w-full md:w-1/4 h-[160px] relative bg-gray-100">
                            <div className="w-full h-full flex items-center justify-center">
                              {/* Using a div with background as fallback since we don't have actual images */}
                              <div
                                className="w-full h-full bg-gray-200 flex items-center justify-center"
                                style={{
                                  backgroundImage: `url('https://placehold.co/400x250/1dbe70/FFFFFF.png?text=${encodeURIComponent(subscription.courseName.substring(0, 10) + '...')}')`,
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                }}
                              />
                            </div>
                          </div>

                          {/* Course Details */}
                          <div className="w-full md:w-3/4 p-4 flex flex-col justify-between">
                            <div>
                              <div className="flex justify-between items-start">
                                <h3 className="text-lg font-semibold mb-1">
                                  {subscription.courseName}
                                </h3>
                                <span className="text-lg font-bold text-gray-800">
                                  {formatCurrency(subscription.price)}
                                </span>
                              </div>
                              <p className="text-gray-600 mb-2">
                                Giảng viên: {subscription.instructor}
                              </p>

                              {/* Progress Bar */}
                              <div className="mt-2 mb-3">
                                <div className="flex justify-between text-sm mb-1">
                                  <span>Tiến độ học tập</span>
                                  <span>{subscription.progress}%</span>
                                </div>
                                <div className="w-full bg-gray-200 rounded-full h-2.5">
                                  <div
                                    className="bg-[#1dbe70] h-2.5 rounded-full"
                                    style={{ width: `${subscription.progress}%` }}
                                  ></div>
                                </div>
                              </div>

                              <div className="flex flex-wrap gap-y-2 mt-3 text-sm text-gray-600">
                                <div className="w-full sm:w-1/2">
                                  <span className="font-medium">Ngày mua:</span>{' '}
                                  {formatDate(subscription.purchaseDate)}
                                </div>
                                <div className="w-full sm:w-1/2">
                                  <span className="font-medium">Ngày hết hạn:</span>{' '}
                                  {formatDate(subscription.expiryDate)}
                                </div>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-wrap gap-2 mt-4">
                              <Link
                                href={`/learn/course/${subscription.id}`}
                                className="px-4 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black rounded text-sm font-medium transition-colors"
                              >
                                Tiếp tục học
                              </Link>
                              <button
                                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium transition-colors"
                                onClick={() => handleCancelSubscription(subscription.id)}
                              >
                                Hủy khóa học
                              </button>
                              <Link
                                href={`/course/${subscription.id}`}
                                className="px-4 py-2 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm font-medium transition-colors"
                              >
                                Xem chi tiết
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 border border-gray-200 rounded-lg">
                    <svg
                      className="w-16 h-16 text-gray-300 mx-auto mb-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1.5}
                        d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4"
                      />
                    </svg>
                    <h3 className="text-xl font-medium text-gray-700 mb-2">Chưa có khóa học nào</h3>
                    <p className="text-gray-500 mb-4">Bạn chưa đăng ký khóa học nào.</p>
                    <Link
                      href="/courses"
                      className="inline-block px-6 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black rounded-lg transition-colors duration-300 font-medium"
                    >
                      Khám phá khóa học
                    </Link>
                  </div>
                )}
              </div>

              {/* Information Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-8">
                <h3 className="text-lg font-medium mb-2">Thông tin về gói đăng ký</h3>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>
                    Bạn có thể hủy khóa học trong vòng 30 ngày kể từ ngày mua để được hoàn tiền
                    100%.
                  </li>
                  <li>
                    Sau thời hạn hoàn tiền, bạn vẫn có thể tiếp cận khóa học cho đến khi hết hạn.
                  </li>
                  <li>Sau khi hết hạn, bạn cần gia hạn để tiếp tục truy cập khóa học.</li>
                  <li>
                    Liên hệ{' '}
                    <a href="mailto:support@mentora.com" className="text-[#1dbe70] hover:underline">
                      support@mentora.com
                    </a>{' '}
                    nếu bạn cần hỗ trợ thêm.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cancel Subscription Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận hủy khóa học</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn hủy khóa học này? Sau khi hủy, bạn sẽ không thể truy cập vào nội
              dung khóa học.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowCancelModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Quay lại
              </button>
              <button
                onClick={confirmCancelSubscription}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Xác nhận hủy
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
