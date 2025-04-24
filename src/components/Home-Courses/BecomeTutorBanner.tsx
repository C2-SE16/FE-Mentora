import Image from 'next/image';
import React from 'react';
import Button from '../Button/Button';

const BecomeTutorBanner = () => {
  return (
    <div className="bg-black h-[320px] flex flex-col items-center justify-center pt-85 pb-94">
      <div className="flex items-start justify-center">
        <h1 className="text-white text-2xl font-bold">Trở thành giảng viên</h1>
        <span>
          <Image
            src="/mentora-footer.svg"
            alt="logo"
            width={100}
            height={100}
            className="w-[150px] ml-2"
          />
        </span>
      </div>
      <Button
        href="#!"
        backgroundColor="#00FF84"
        textColor="black"
        minWidth={195}
        className="mt-6 rounded-2xl leading-[55px] text-center"
      >
        Đăng kí ngay
      </Button>
    </div>
  );
};

export default BecomeTutorBanner;
