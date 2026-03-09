import { AppLayout } from '@/components/layout/AppLayout';
import { OrderDetailsPage } from '@/components/orders/OrderDetailsPage';
import { Button } from '@/components/ui/button';
import { Edit, Plus } from 'lucide-react';

interface OrderPageProps {
  params: Promise<{
    id: string;
  }>;
}

export async function generateMetadata({ params }: OrderPageProps) {
  const { id } = await params;
  return {
    title: `Order ${id} - Fitty Admin`,
  };
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;

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
