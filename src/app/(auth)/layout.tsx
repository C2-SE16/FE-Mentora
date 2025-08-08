'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/layouts/Header';
import { AuthProvider } from '@/contexts/AuthContext';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-robotoCondensed">
      <Toaster position="top-right" />
      <AuthProvider>
        <Header />
        <main className="flex-grow">{children}</main>
      </AuthProvider>
    </div>
  );
}
