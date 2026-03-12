'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { OrderListingPage } from '@/components/orders/OrderListingPage';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

export default function AnalyticsListingPage() {
  const { isLoading } = useAuthGuard();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <AppLayout
      headerTitle="Order Listing"
      breadcrumbs={[
        { label: 'Analytics', href: '/analytics' },
        { label: 'Order Listing' },
      ]}
    >
      <OrderListingPage />
    </AppLayout>
  );
}
