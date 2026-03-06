'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderListingPage } from '@/components/orders/OrderListingPage';

export default function AnalyticsListingPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <AppLayout
      headerTitle="Order Listing"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Analytics', href: '/analytics' },
        { label: 'Order Listing' },
      ]}
    >
      <OrderListingPage />
    </AppLayout>
  );
}
