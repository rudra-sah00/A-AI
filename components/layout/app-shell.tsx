"use client"

import { useState, useEffect } from 'react';
import Sidebar from './sidebar';
import Header from './header';
import { useAuth } from '@/components/providers/auth-provider';
import { useRouter } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

export default function AppShell({ children }: { children: React.ReactNode }) {
  const [isMounted, setIsMounted] = useState(false);
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
    
    if (!isLoading && !user) {
      router.push('/');
    }
  }, [user, isLoading, router]);

  if (!isMounted || isLoading) {
    return (
      <div className="min-h-screen flex flex-col">
        <div className="border-b border-border h-16 flex items-center px-4">
          <Skeleton className="h-8 w-[200px]" />
          <div className="ml-auto flex gap-4">
            <Skeleton className="h-8 w-8 rounded-full" />
            <Skeleton className="h-8 w-24" />
          </div>
        </div>
        <div className="flex flex-1">
          <div className="hidden md:flex flex-col w-64 border-r border-border p-4">
            <Skeleton className="h-10 w-full mb-6" />
            {Array(6).fill(0).map((_, i) => (
              <Skeleton key={i} className="h-8 w-full mb-3" />
            ))}
          </div>
          <div className="flex-1 p-6">
            <Skeleton className="h-8 w-[300px] mb-8" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array(6).fill(0).map((_, i) => (
                <Skeleton key={i} className="h-[200px] w-full rounded-lg" />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Header is already sticky in its component */}
      <Header />
      
      {/* Content area with fixed sidebar and scrollable main */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar - fixed, non-scrollable */}
        <Sidebar />
        
        {/* Main content - only this should scroll */}
        <main className="flex-1 md:ml-64 overflow-auto p-4 md:p-6 h-[calc(100vh-4rem)]">
          {children}
        </main>
      </div>
    </div>
  );
}