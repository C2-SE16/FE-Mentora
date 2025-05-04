'use client';
import { Toaster } from 'react-hot-toast';

export default function InstructorLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 bg-white overflow-y-auto">{children}</main>
      <Toaster position="top-right" />
    </div>
  );
} 