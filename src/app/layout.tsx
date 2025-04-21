'use client';
import { usePathname } from 'next/navigation';
import './globals.css';
import Layout from '@/layouts/Layout';
import { SearchProvider } from '@/components/modules/searchs/SearchContext';
import React from 'react';
import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();

  // Kiểm tra các đường dẫn cần layout riêng
  const isDifferentLayout =
    pathname?.startsWith('/courses/create') ||
    pathname?.startsWith('/instructor') ||
    pathname?.startsWith('/login') ||
    pathname?.startsWith('/register');

  return (
    <html lang="en">
      <body className="font-robotoCondensed">
        {isDifferentLayout ? (
          children
        ) : (
          <Layout>
            <SearchProvider>{children}</SearchProvider>
          </Layout>
        )}
      </body>
    </html>
  );
}
