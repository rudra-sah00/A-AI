"use client"

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '@/components/providers/auth-provider';

const publicRoutes = ['/login', '/'];

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const isPublicRoute = publicRoutes.includes(pathname);

  useEffect(() => {
    if (!isLoading) {
      if (!isAuthenticated && !isPublicRoute) {
        router.push('/'); // Changed from '/login' to '/'
      } else if (isAuthenticated && pathname === '/login') {
        router.push('/dashboard');
      }
    }
  }, [isAuthenticated, isLoading, router, isPublicRoute, pathname]);

  // Show nothing while checking authentication
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If not authenticated and trying to access a protected route, don't render children
  if (!isAuthenticated && !isPublicRoute) {
    return null;
  }

  // Otherwise, render the children
  return <>{children}</>;
}