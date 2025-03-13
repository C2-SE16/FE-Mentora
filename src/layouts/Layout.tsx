'use client';
import Header from '@/layouts/Header';
import Footer from '@/layouts/Footer';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <html lang="en">
      <body className="font-roboto-condensed">
        <Header />
        {children}
        <Footer />
      </body>
    </html>
  );
};

export default Layout;
