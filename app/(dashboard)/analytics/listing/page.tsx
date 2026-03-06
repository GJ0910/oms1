'use client';

import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderListingPage } from '@/components/orders/OrderListingPage';

export default function AnalyticsListingPage() {
  const { user } = useAuth();

  if (!user) {
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
