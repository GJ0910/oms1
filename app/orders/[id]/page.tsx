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
        { label: 'Orders', href: '/orders/search' },
        { label: id },
      ]}
      actions={
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Order
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Plus className="h-4 w-4" />
            Create Clone
          </Button>
          <Button variant="destructive" size="sm">
            Cancel Order
          </Button>
        </div>
      }
    >
      <OrderDetailsPage orderId={id} />
    </AppLayout>
  );
}
