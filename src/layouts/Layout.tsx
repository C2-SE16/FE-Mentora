'use client';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from '@/contexts/AuthContext';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Toaster position="top-right" />
      <AuthProvider>
        <Header />
        {children}
        <Footer />
      </AuthProvider>
    </>
  );
};

export default Layout;
