'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentService } from '@/apis/paymentService';
import { formatCurrency } from '@/utils/formatters';

interface PayoutInfo {
  instructorId: string;
  instructorName: string;
  totalRevenue: number;
  platformFee: number;
  payoutAmount: number;
  currency: string;
  paymentsPending: number;
  lastPayout: string;
}

const InstructorPaymentsPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [payoutInfo, setPayoutInfo] = useState<PayoutInfo | null>(null);
  const [isLoadingInfo, setIsLoadingInfo] = useState<boolean>(true);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchInstructorInfo();
    }
  }, [user]);

  const fetchInstructorInfo = async () => {
    try {
      const instructorInfo = await PaymentService.getMyInstructorInfo();
      if (instructorInfo.isInstructorInDatabase) {
        setInstructorId(instructorInfo.instructorId);
        fetchPayoutInfo(instructorInfo.instructorId);
      } else {
        setError('Bạn cần trở thành giảng viên để xem thông tin thanh toán.');
        setIsLoadingInfo(false);
      }
    } catch (error) {
      console.error('Lỗi khi lấy thông tin instructor:', error);
      setError('Không thể lấy thông tin giảng viên.');
      setIsLoadingInfo(false);
    }
  };

  const fetchPayoutInfo = async (instructorId: string) => {
    try {
      const info = await PaymentService.getInstructorPayout(instructorId);
      setPayoutInfo(info);
      setIsLoadingInfo(false);
    } catch (error) {
      console.error('Lỗi khi lấy thông tin thanh toán:', error);
      setError('Không thể lấy thông tin thanh toán.');
      setIsLoadingInfo(false);
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'Chưa có thanh toán';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="w-8 h-8 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!user) {
    router.push('/login');
    return null;
  }

  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">Thông tin thanh toán</h1>

      {isLoadingInfo ? (
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-t-2 border-[#1dbe70] rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      ) : payoutInfo ? (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold mb-4">Tổng quan thanh toán</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Tổng doanh thu</h3>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(payoutInfo.totalRevenue, payoutInfo.currency)}</p>
              </div>
              <div className="bg-red-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Phí nền tảng</h3>
                <p className="text-2xl font-bold text-red-600">{formatCurrency(payoutInfo.platformFee, payoutInfo.currency)}</p>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <h3 className="text-sm font-medium text-gray-500 mb-1">Số tiền thanh toán</h3>
                <p className="text-2xl font-bold text-green-600">{formatCurrency(payoutInfo.payoutAmount, payoutInfo.currency)}</p>
              </div>
            </div>
          </div>

          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col md:flex-row justify-between gap-4">
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Số lượng giao dịch chờ xử lý</h3>
                <p className="text-lg font-semibold">{payoutInfo.paymentsPending} giao dịch</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-1">Lần thanh toán gần nhất</h3>
                <p className="text-lg font-semibold">{formatDate(payoutInfo.lastPayout)}</p>
              </div>
            </div>
          </div>

          <div className="p-6">
            <h2 className="text-xl font-semibold mb-4">Phương thức thanh toán</h2>
            <div className="flex items-center justify-between bg-gray-50 p-4 rounded-lg">
              <div>
                <p className="font-medium">PayPal</p>
                <button 
                  onClick={() => router.push('/profile/payment-methods')}
                  className="text-blue-600 text-sm hover:underline"
                >
                  Quản lý phương thức thanh toán
                </button>
              </div>
              <div className="text-sm bg-green-100 text-green-800 px-3 py-1 rounded-full">
                Phương thức ưu tiên
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-yellow-100 border border-yellow-200 text-yellow-700 px-4 py-3 rounded-lg mb-6">
          Không có thông tin thanh toán.
        </div>
      )}
    </div>
  );
};

export default InstructorPaymentsPage; 