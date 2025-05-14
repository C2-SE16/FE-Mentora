'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { PaymentService } from '@/apis/paymentService';
import Link from 'next/link';

// Khai báo interface cho response phù hợp
interface VerifyResponse {
  success?: boolean;
  message?: string;
  data?: {
    success?: boolean;
    message?: string;
  };
}

const VerifyPaypalPage = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState<string>('');
  
  useEffect(() => {
    if (!searchParams) {
      setStatus('error');
      setMessage('Token không hợp lệ hoặc đã hết hạn');
      return;
    }
    
    const token = searchParams.get('token');
    if (!token) {
      setStatus('error');
      setMessage('Token không hợp lệ hoặc đã hết hạn');
      return;
    }
    
    verifyPaypal(token);
  }, [searchParams]);
  
  const verifyPaypal = async (token: string) => {
    try {
      const response = await PaymentService.verifyPaypal(token) as VerifyResponse;
      console.log('Verify response:', response);
      
      // Check for nested success field
      const isSuccess = 
        (response && response.success) || 
        (response && response.data && response.data.success);
      
      const responseMessage = 
        (response && response.message) || 
        (response && response.data && response.data.message) || 
        'Tài khoản PayPal đã được xác minh thành công';
      
      if (isSuccess) {
        setStatus('success');
        setMessage(responseMessage);
      } else {
        setStatus('error');
        setMessage(responseMessage || 'Có lỗi xảy ra khi xác thực tài khoản PayPal');
      }
    } catch (error: any) {
      console.error('Verification error:', error);
      
      const errorMessage = 
        error.response?.data?.message || 
        error.response?.data?.data?.message ||
        'Có lỗi xảy ra khi xác thực tài khoản PayPal';
      
      setStatus('error');
      setMessage(errorMessage);
    }
  };

  const handleReturnToPaymentMethods = () => {
    router.push('/profile/payment-methods?from_verify=true');
  };
  
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="bg-white p-8 rounded-lg shadow-md max-w-md w-full">
        <div className="text-center">
          {status === 'loading' && (
            <>
              <div className="w-16 h-16 border-4 border-t-[#1dbe70] border-r-[#1dbe70] border-b-transparent border-l-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <h1 className="text-2xl font-bold mb-2">Đang xác thực...</h1>
              <p className="text-gray-600">Vui lòng đợi trong khi chúng tôi xác thực tài khoản PayPal của bạn.</p>
            </>
          )}
          
          {status === 'success' && (
            <>
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Xác thực thành công!</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button 
                onClick={handleReturnToPaymentMethods}
                className="inline-block px-6 py-3 bg-[#1dbe70] text-white rounded-lg hover:bg-[#18a861] transition"
              >
                Quay lại trang Phương thức thanh toán
              </button>
            </>
          )}
          
          {status === 'error' && (
            <>
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
              <h1 className="text-2xl font-bold mb-2">Xác thực thất bại</h1>
              <p className="text-gray-600 mb-6">{message}</p>
              <button 
                onClick={handleReturnToPaymentMethods}
                className="inline-block px-6 py-3 bg-[#1dbe70] text-white rounded-lg hover:bg-[#18a861] transition"
              >
                Quay lại trang Phương thức thanh toán
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyPaypalPage; 