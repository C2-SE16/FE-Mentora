import React from 'react';
import Link from 'next/link';
import { twMerge } from 'tailwind-merge';

interface ButtonProps {
  href: string;
  children: React.ReactNode;
  className?: string;
  backgroundColor?: string;
  textColor?: string;
  width?: string | number;
  minWidth?: string | number;
  onClick?: () => void;
}

const Button = ({
  href,
  children,
  className = '',
  backgroundColor,
  textColor,
  width,
  minWidth,
  onClick,
  ...rest
}: ButtonProps) => {
  // Tailwind base classes
  const baseClasses =
    'inline-block rounded-[5px] bg-[#171100] text-white text-center text-[14px] font-semibold leading-[40px] no-underline';

  // Dynamic style for custom colors and width
  const style = {
    backgroundColor: backgroundColor || '',
    color: textColor || '',
    width: width ? `${width}px` : '',
    minWidth: minWidth ? `${minWidth}px` : '110px',
  };

  return (
    <Link
      href={href}
      className={twMerge(baseClasses, className)}
      style={style}
      onClick={onClick}
      {...rest}
    >
      {children}
    </Link>
  );
};

export default Button;
