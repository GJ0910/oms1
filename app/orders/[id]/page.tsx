'use client';

import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { OrderDetailsPage } from '@/components/orders/OrderDetailsPage';

export default function OrderPage() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

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
