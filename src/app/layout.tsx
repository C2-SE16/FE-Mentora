import './globals.css';
import { FC, ReactNode } from 'react';

interface RootLayoutProps {
  children: ReactNode;
}

const RootLayout: FC<RootLayoutProps> = ({ children }) => {
  return (
    <html lang="vi">
      <body className="bg-gray-50">{children}</body>
    </html>
  );
};

export default RootLayout;
