'use client';
import { usePathname } from 'next/navigation';
import './globals.css';
import Layout from '@/layouts/Layout';
import { SearchProvider } from '@/contexts/SearchContext';
import React from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

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
    pathname?.startsWith('/register') ||
    pathname?.startsWith('/verify-email') ||
    pathname?.startsWith('/reset-password') ||
    pathname?.startsWith('/forgot-password');

  return (
    <html lang="en">
      <body className="font-robotoCondensed">
        {isDifferentLayout ? (
          children
        ) : (
          <Layout>
            <AuthProvider>
              <SearchProvider>{children}</SearchProvider>
            </AuthProvider>
          </Layout>
        )}
      </body>
    </html>
  );
}
