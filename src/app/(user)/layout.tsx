'use client';

import React from 'react';
import { Toaster } from 'react-hot-toast';
import Header from '@/layouts/Header';

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col font-robotoCondensed">
      <Toaster position="top-right" />
      <main className="flex-grow">{children}</main>
    </div>
  );
}
