'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { PaymentService } from '@/apis/paymentService';
import { InstructorService } from '@/apis/instructorService';
import { toast } from 'react-hot-toast';

const PaymentMethodsPage = () => {
  const { user, isLoading } = useAuth();
  const router = useRouter();
  const [activeMethod, setActiveMethod] = useState<string | null>('paypal');
  const [paypalEmail, setPaypalEmail] = useState<string>('');
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [hasPendingVerification, setHasPendingVerification] = useState<boolean>(false);
  const [tokenExpired, setTokenExpired] = useState<boolean>(false);
  const [isInstructor, setIsInstructor] = useState<boolean>(false);
  const [instructorId, setInstructorId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPaypalForm, setShowPaypalForm] = useState<boolean>(false);
  const [checkingInstructorStatus, setCheckingInstructorStatus] = useState<boolean>(true);
  const [paypalDataLoaded, setPaypalDataLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (user) {
      checkInstructorStatus();
    }
  }, [user]);

  useEffect(() => {
    const refreshPaypalStatusOnReturn = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const fromVerify = urlParams.get('from_verify');
      
      if (fromVerify === 'true' && instructorId && isInstructor) {
        await fetchPaypalStatus();
      }
    };
    
    if (instructorId && isInstructor && paypalDataLoaded) {
      refreshPaypalStatusOnReturn();
    }
  }, [instructorId, isInstructor, paypalDataLoaded]);

  const checkInstructorStatus = async () => {
    try {
      setCheckingInstructorStatus(true);
      const status = await InstructorService.checkInstructorStatus();
      if (status.isInstructor && status.instructorId) {
        setIsInstructor(true);
        setInstructorId(status.instructorId);
        await fetchPaypalStatus();
      } else {
        setIsInstructor(false);
        setCheckingInstructorStatus(false);
      }
    } catch (error) {
      console.error('Lỗi khi kiểm tra trạng thái instructor:', error);
      setIsInstructor(false);
      setCheckingInstructorStatus(false);
    }
  };

  const fetchPaypalStatus = async () => {
    try {
      console.log('Đang lấy trạng thái PayPal...');
      
      const status = await PaymentService.getMyPaypalVerificationStatus();
      
      console.log('Kết quả trạng thái PayPal:', status);
      
      setPaypalEmail(status.paypalEmail || '');
      setIsVerified(status.isVerified);
      setHasPendingVerification(status.hasPendingVerification);
      setTokenExpired(status.tokenExpired);
      setPaypalDataLoaded(true);
      setCheckingInstructorStatus(false);
    } catch (error) {
      console.error('Lỗi khi lấy trạng thái PayPal:', error);
      setPaypalDataLoaded(true);
      setCheckingInstructorStatus(false);
    }
  };

  const handleRegisterPaypal = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!instructorId) return;

    setIsSubmitting(true);
    try {
      await PaymentService.registerPaypal(instructorId, paypalEmail);
      toast.success('Đã đăng ký tài khoản PayPal. Vui lòng kiểm tra email để xác nhận.');
      await fetchPaypalStatus();
      setShowPaypalForm(false);
    } catch (error) {
      console.error('Lỗi khi đăng ký PayPal:', error);
      toast.error('Không thể đăng ký tài khoản PayPal. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChangePaypal = () => {
    // Pre-populate the form with the current email
    setShowPaypalForm(true);
  };

  const handleResendVerification = async () => {
    setIsSubmitting(true);
    try {
      await PaymentService.resendPaypalVerification();
      toast.success('Đã gửi lại email xác nhận. Vui lòng kiểm tra hộp thư của bạn.');
      await fetchPaypalStatus();
    } catch (error) {
      console.error('Lỗi khi gửi lại email xác nhận:', error);
      toast.error('Không thể gửi lại email xác nhận. Vui lòng thử lại sau.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const refreshPaypalData = async () => {
    if (instructorId) {
      await fetchPaypalStatus();
      toast.success('Đã làm mới dữ liệu');
    }
  };

  if (isLoading || checkingInstructorStatus) {
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
      <h1 className="text-3xl font-bold mb-8">Phương thức thanh toán</h1>
      
      <div className="mb-10">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-start mb-4">
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-indigo-500 text-lg">i</span>
            </div>
            <div>
              <p className="mb-4">Chọn phương thức thanh toán bên dưới.</p>
              <p>Dịch vụ xử lý thanh toán sẽ được cung cấp bởi bên thứ ba. Bằng cách nhập thông tin để thiết lập phương thức thanh toán, bạn đồng ý rằng bên thứ ba liên quan có thể thu thập và xử lý dữ liệu cá nhân của bạn theo các Điều khoản sử dụng và Chính sách bảo mật.</p>
            </div>
          </div>

          

          {isInstructor ? (
            <>
              {/* Phương thức PayPal */}
              <div className="border border-gray-200 rounded-lg mb-4 p-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center">
                    <Image src="/mentora-logo.svg" alt="PayPal" width={100} height={50} className="mr-4" />
                    <div>
                      <p className="font-medium">PayPal</p>
                      {paypalEmail ? (
                        <p className="text-sm text-gray-600">
                          {isVerified ? 'Hoạt động' : hasPendingVerification ? 'Chờ xác nhận' : tokenExpired ? 'Token hết hạn' : 'Chưa xác nhận'} - {paypalEmail}
                        </p>
                      ) : (
                        <p className="text-sm text-gray-600">Chưa kết nối</p>
                      )}
                    </div>
                  </div>
                  {!paypalEmail ? (
                    <button 
                      onClick={() => setShowPaypalForm(true)} 
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                    >
                      Kết nối
                    </button>
                  ) : !isVerified ? (
                    <div className="flex gap-2">
                      {(tokenExpired || !hasPendingVerification) && (
                        <button 
                          onClick={handleResendVerification}
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                        >
                          {isSubmitting ? 'Đang xử lý...' : 'Gửi lại email xác nhận'}
                        </button>
                      )}
                    </div>
                  ) : (
                    <button 
                      onClick={handleChangePaypal}
                      className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                    >
                      Thay đổi tài khoản
                    </button>
                  )}
                </div>

                {showPaypalForm && (
                  <div className="mt-4 p-4 border border-gray-200 rounded-lg">
                    <h2 className="font-medium mb-2">{paypalEmail && isVerified ? 'Thay đổi tài khoản PayPal' : 'Kết nối tài khoản PayPal'}</h2>
                    <form onSubmit={handleRegisterPaypal}>
                      <div className="mb-4">
                        <label htmlFor="paypalEmail" className="block text-sm font-medium text-gray-700 mb-1">
                          Email PayPal
                        </label>
                        <input
                          type="email"
                          id="paypalEmail"
                          value={paypalEmail}
                          onChange={(e) => setPaypalEmail(e.target.value)}
                          required
                          className="w-full p-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="your.email@example.com"
                        />
                      </div>
                      {paypalEmail && isVerified && (
                        <div className="mb-4 p-3 bg-yellow-50 rounded-lg text-sm text-yellow-800">
                          <p>Lưu ý: Thay đổi tài khoản PayPal sẽ yêu cầu xác thực lại và có thể ảnh hưởng đến các khoản thanh toán đang chờ xử lý.</p>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <button
                          type="submit"
                          disabled={isSubmitting}
                          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition disabled:bg-gray-400"
                        >
                          {isSubmitting ? 'Đang xử lý...' : paypalEmail && isVerified ? 'Cập nhật' : 'Kết nối'}
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowPaypalForm(false)}
                          className="px-4 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition"
                        >
                          Hủy
                        </button>
                      </div>
                    </form>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="text-center p-4 bg-gray-100 rounded-lg">
              <p>Bạn cần trở thành giảng viên để thiết lập phương thức thanh toán.</p>
              <Link href="/instructor/register" className="mt-2 inline-block px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                Đăng ký làm giảng viên
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentMethodsPage; 