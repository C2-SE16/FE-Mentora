'use client';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-robotoCondensed">
        <Toaster position="top-right" />
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
