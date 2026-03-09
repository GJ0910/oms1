import { AppLayout } from '@/components/layout/AppLayout';
import { OrderDetailsPage } from '@/components/orders/OrderDetailsPage';

export default function Home() {
  return (
    <AppLayout
      headerTitle="Order Details"
      breadcrumbs={[
        { label: 'Orders', href: '/orders/search' },
        { label: '#FT1230251-001' },
      ]}
    >
      <OrderDetailsPage orderId="#FT1230251-001" />
    </AppLayout>
  );
}
