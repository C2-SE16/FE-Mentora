'use client';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { Toaster } from 'react-hot-toast';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="top-right" />
      <Header />
      {children}
      <Footer />
    </>
  );
};

export default Layout;
