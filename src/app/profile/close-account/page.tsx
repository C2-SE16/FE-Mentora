'use client';

import React, { useState } from 'react';
import ProfileSidebar from '@/components/ProfileSideBar/ProfileSidebar';

export default function CloseAccountPage() {
  const [firstName, setFirstName] = useState('Anh');
  const [lastName, setLastName] = useState('Bảo');

  const handleCloseAccount = () => {
    // Logic xử lý đóng tài khoản ở đây
    console.log('Close account');
  };

  return (
    <div className="bg-gray-50">
      <div className="max-w-5xl mx-auto py-8 px-4 sm:px-6">
        <div className="bg-white border border-gray-200 shadow-custom">
          <div className="flex flex-col md:flex-row">
            <ProfileSidebar firstName={firstName} lastName={lastName} />

            {/* Main content */}
            <div className="w-full md:w-3/4 p-6 mx-0 md:mx-10">
              <div className="text-center mb-8">
                <h1 className="text-3xl font-bold font-oswald">Đóng tài khoản</h1>
                <p className="text-black mt-2">Đóng tài khoản của bạn vĩnh viễn</p>
              </div>

              {/* Warning Section */}
              <div className="mb-8">
                <div className="border border-gray-300 rounded-lg bg-white py-6 px-5">
                  <p className="text-black mb-8">
                    <strong className="text-base font-bold mb-4 text-[#B11212]">CẢNH BÁO:   </strong>
                     Nếu bạn đóng tài khoản của mình, bạn sẽ hủy đăng ký từ tất cả 0 khóa học của
                    mình và sẽ mất quyền truy cập vào tài khoản và dữ liệu của bạn được liên kết với
                    tài khoản của bạn mãi mãi, ngay cả khi bạn chọn tạo tài khoản mới bằng cách sử
                    dụng cùng một địa chỉ email trong tương lai .
                  </p>

                  <p className="text-black mb-4">
                    Xin lưu ý, nếu bạn muốn khôi phục tài khoản của mình sau khi gửi yêu cầu xóa,
                    bạn sẽ có 14 ngày sau ngày gửi bạn đầu để liên hệ với support@mentora.com để hủy
                    yêu cầu này.
                  </p>

                  <div className="flex justify-start mt-6">
                    <button
                      onClick={handleCloseAccount}
                      className="bg-[#00FF84] hover:bg-[#00FF84]/80 text-black py-2 px-4 rounded-lg shadow-custom transition-colors duration-300 w-[157px] text-sm font-semibold"
                    >
                      Đóng tài khoản
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
