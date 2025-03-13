'use client';
import { usePathname } from 'next/navigation';
import './globals.css';
import Layout from '@/layouts/Layout';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const pathname = usePathname();
  const isDifferentLayout =
    pathname?.startsWith('/courses/step1') || pathname?.startsWith('/register');
  return (
    <html lang="en">
      <body>{isDifferentLayout ? children : <Layout>{children}</Layout>}</body>
    </html>
  );
}