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
    pathname?.startsWith('/courses/create') || pathname?.startsWith('/register');
  return (
    <html lang="en">
      <body className="font-roboto-condensed">
        {isDifferentLayout ? children : <Layout>{children}</Layout>}
      </body>
    </html>
  );
}
