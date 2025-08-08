'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

// Mock data for payment methods
const mockPaymentMethods = [
  {
    id: 'pm1',
    type: 'paypal',
    email: 'your.email@example.com',
    isDefault: true,
    lastUsed: '2023-12-15',
  },
];

export default function EditPaymentMethodPage() {
  const [paymentMethods, setPaymentMethods] = useState(mockPaymentMethods);
  const [showAddPayPal, setShowAddPayPal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [methodToRemove, setMethodToRemove] = useState<string | null>(null);
  const [newPayPalEmail, setNewPayPalEmail] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddPayPal = () => {
    setShowAddPayPal(true);
  };

  const handleRemovePaymentMethod = (id: string) => {
    setMethodToRemove(id);
    setShowRemoveModal(true);
  };

  const confirmRemovePaymentMethod = () => {
    if (methodToRemove) {
      setPaymentMethods(paymentMethods.filter((method) => method.id !== methodToRemove));
      setShowRemoveModal(false);
      setMethodToRemove(null);
    }
  };

  const handleSavePayPal = () => {
    if (!newPayPalEmail || !newPayPalEmail.includes('@')) {
      alert('Vui lòng nhập một địa chỉ email hợp lệ');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      const newMethod = {
        id: `pm${paymentMethods.length + 1}`,
        type: 'paypal',
        email: newPayPalEmail,
        isDefault: paymentMethods.length === 0,
        lastUsed: new Date().toISOString().split('T')[0],
      };

      setPaymentMethods([...paymentMethods, newMethod]);
      setShowAddPayPal(false);
      setNewPayPalEmail('');
      setIsSubmitting(false);
    }, 1000);
  };

  const setDefaultPaymentMethod = (id: string) => {
    setPaymentMethods(
      paymentMethods.map((method) => ({
        ...method,
        isDefault: method.id === id,
      }))
    );
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

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Phương thức thanh toán</h1>
                <p className="text-black mt-2">Quản lý thông tin thanh toán của bạn</p>
              </div>

              {/* Payment Methods Section */}
              <div className="mb-8">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-lg font-semibold">Phương thức đã lưu</h2>
                  <button
                    onClick={handleAddPayPal}
                    className="px-4 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black rounded text-sm font-medium transition-colors"
                  >
                    + Thêm phương thức
                  </button>
                </div>

                {/* List of Payment Methods */}
                {paymentMethods.length > 0 ? (
                  <div className="space-y-4">
                    {paymentMethods.map((method) => (
                      <div
                        key={method.id}
                        className="border border-gray-200 rounded-lg p-4 flex flex-col md:flex-row md:items-center justify-between"
                      >
                        <div className="flex items-center mb-3 md:mb-0">
                          {method.type === 'paypal' && (
                            <div className="w-12 h-12 bg-[#169BD7] rounded-md flex items-center justify-center mr-4">
                              <svg
                                className="w-8 h-8 text-white"
                                viewBox="0 0 24 24"
                                fill="currentColor"
                              >
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.144-.05.29-.08.432-.303 1.435-.866 2.683-1.66 3.697-.778.99-1.778 1.743-2.98 2.235-1.19.486-2.59.73-4.17.73h-.71c-.776 0-1.425.53-1.59 1.252l-.06.29-.516 3.288-.023.15c-.013.082-.034.157-.065.233a.693.693 0 0 1-.679.454v-.021zm7.446-17.388h-.05l-1.422 9.06h.74c.67 0 1.23-.057 1.687-.17.458-.114.84-.29 1.156-.533.32-.244.58-.553.8-.928.224-.375.392-.82.51-1.338l.033-.156c.028-.124.05-.25.07-.376.186-1.165-.012-2.035-.593-2.583-.582-.55-1.52-.826-2.812-.826l-4.866-.001 4.019-.149h.728z" />
                              </svg>
                            </div>
                          )}
                          <div>
                            <div className="flex items-center">
                              <h3 className="font-medium">PayPal</h3>
                              {method.isDefault && (
                                <span className="ml-2 text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
                                  Mặc định
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600">{method.email}</p>
                            <p className="text-xs text-gray-500">
                              Sử dụng gần đây: {formatDate(method.lastUsed)}
                            </p>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          {!method.isDefault && (
                            <button
                              onClick={() => setDefaultPaymentMethod(method.id)}
                              className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm transition-colors"
                            >
                              Đặt làm mặc định
                            </button>
                          )}
                          <button
                            onClick={() => handleRemovePaymentMethod(method.id)}
                            className="px-3 py-1.5 bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 rounded text-sm transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 border border-gray-200 rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg
                        className="w-8 h-8 text-gray-400"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={1.5}
                          d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
                        />
                      </svg>
                    </div>
                    <h3 className="text-lg font-medium text-gray-700 mb-2">
                      Chưa có phương thức thanh toán
                    </h3>
                    <p className="text-gray-500 mb-4">
                      Thêm phương thức thanh toán để thanh toán nhanh hơn.
                    </p>
                    <button
                      onClick={handleAddPayPal}
                      className="inline-block px-6 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black rounded-lg transition-colors duration-300 font-medium"
                    >
                      Thêm phương thức thanh toán
                    </button>
                  </div>
                )}
              </div>

              {/* PayPal Section */}
              <div className="mb-8">
                <h2 className="text-lg font-semibold mb-4">Về PayPal</h2>
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <div className="flex items-start">
                    <div className="shrink-0 mt-0.5">
                      <svg
                        className="w-5 h-5 text-blue-600"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z"
                          clipRule="evenodd"
                        ></path>
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-700">
                        PayPal là dịch vụ thanh toán trực tuyến an toàn và phổ biến. Khi bạn thêm
                        tài khoản PayPal, bạn có thể thanh toán nhanh chóng mà không cần nhập lại
                        thông tin thẻ.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-x-4 bg-gray-50 p-4 rounded-lg border border-gray-200">
                  <div className="w-12 h-12 bg-[#169BD7] rounded-md flex items-center justify-center">
                    <svg className="w-8 h-8 text-white" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.144-.05.29-.08.432-.303 1.435-.866 2.683-1.66 3.697-.778.99-1.778 1.743-2.98 2.235-1.19.486-2.59.73-4.17.73h-.71c-.776 0-1.425.53-1.59 1.252l-.06.29-.516 3.288-.023.15c-.013.082-.034.157-.065.233a.693.693 0 0 1-.679.454v-.021zm7.446-17.388h-.05l-1.422 9.06h.74c.67 0 1.23-.057 1.687-.17.458-.114.84-.29 1.156-.533.32-.244.58-.553.8-.928.224-.375.392-.82.51-1.338l.033-.156c.028-.124.05-.25.07-.376.186-1.165-.012-2.035-.593-2.583-.582-.55-1.52-.826-2.812-.826l-4.866-.001 4.019-.149h.728z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">PayPal</h3>
                    <p className="text-sm text-gray-600">
                      Thanh toán an toàn trực tuyến với tài khoản PayPal hoặc thẻ tín dụng
                    </p>
                  </div>
                </div>
              </div>

              {/* Information Box */}
              <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <h3 className="text-base font-medium mb-2">Thông tin về thanh toán</h3>
                <ul className="text-gray-600 space-y-2 list-disc pl-5">
                  <li>Thông tin thanh toán của bạn được bảo mật và mã hóa</li>
                  <li>
                    Bạn sẽ được thông báo trước khi bất kỳ khoản thanh toán nào được thực hiện
                  </li>
                  <li>Bạn có thể thay đổi hoặc xóa phương thức thanh toán bất kỳ lúc nào</li>
                  <li>
                    Liên hệ{' '}
                    <a href="mailto:support@mentora.com" className="text-[#1dbe70] hover:underline">
                      support@mentora.com
                    </a>{' '}
                    nếu bạn có bất kỳ câu hỏi nào về thanh toán
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add PayPal Modal */}
      {showAddPayPal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold">Thêm tài khoản PayPal</h3>
              <button
                onClick={() => setShowAddPayPal(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>

            <div className="mb-4">
              <div className="flex items-center mb-4">
                <div className="w-10 h-10 bg-[#169BD7] rounded flex items-center justify-center mr-3">
                  <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.144-.05.29-.08.432-.303 1.435-.866 2.683-1.66 3.697-.778.99-1.778 1.743-2.98 2.235-1.19.486-2.59.73-4.17.73h-.71c-.776 0-1.425.53-1.59 1.252l-.06.29-.516 3.288-.023.15c-.013.082-.034.157-.065.233a.693.693 0 0 1-.679.454v-.021zm7.446-17.388h-.05l-1.422 9.06h.74c.67 0 1.23-.057 1.687-.17.458-.114.84-.29 1.156-.533.32-.244.58-.553.8-.928.224-.375.392-.82.51-1.338l.033-.156c.028-.124.05-.25.07-.376.186-1.165-.012-2.035-.593-2.583-.582-.55-1.52-.826-2.812-.826l-4.866-.001 4.019-.149h.728z" />
                  </svg>
                </div>
                <span className="font-medium">PayPal</span>
              </div>

              <label
                htmlFor="paypal-email"
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email PayPal của bạn
              </label>
              <input
                type="email"
                id="paypal-email"
                value={newPayPalEmail}
                onChange={(e) => setNewPayPalEmail(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2 mb-4 focus:outline-none focus:ring-2 focus:ring-[#1dbe70]"
                placeholder="your.email@example.com"
                required
              />

              <p className="text-sm text-gray-600 mb-4">
                Bằng cách thêm tài khoản PayPal, bạn đồng ý với
                <a href="#" className="text-[#1dbe70] hover:underline ml-1">
                  Điều khoản dịch vụ
                </a>{' '}
                của chúng tôi.
              </p>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowAddPayPal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSavePayPal}
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#00FF84] hover:bg-[#00FF84]/80 text-black rounded-lg transition-colors flex items-center"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Đang xử lý...
                  </>
                ) : (
                  'Lưu'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Remove Payment Method Modal */}
      {showRemoveModal && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-xl font-bold mb-4">Xác nhận xóa phương thức thanh toán</h3>
            <p className="text-gray-600 mb-6">
              Bạn có chắc chắn muốn xóa phương thức thanh toán này? Bạn sẽ cần thêm lại sau nếu muốn
              sử dụng.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowRemoveModal(false)}
                className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={confirmRemovePaymentMethod}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Xác nhận xóa
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
