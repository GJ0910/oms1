'use client';

import { useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderDetailsPage } from '@/components/orders/OrderDetailsPage';

export default function OrderPage() {
  const { user } = useAuth();
  const params = useParams();
  const id = params.id as string;

  if (!user) {
    return null;
  }

  return (
    <AppLayout
      headerTitle="Order Details"
      breadcrumbs={[
        { label: 'Home', href: '/' },
        { label: 'Orders', href: '/orders/search' },
        { label: id },
      ]}
    >
      <OrderDetailsPage orderId={id} />
    </AppLayout>
  );
}
