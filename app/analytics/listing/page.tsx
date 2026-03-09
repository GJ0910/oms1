import { AppLayout } from '@/components/layout/AppLayout';
import { OrderListingPage } from '@/components/orders/OrderListingPage';

export default function AnalyticsListingPage() {
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
