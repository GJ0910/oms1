import { AppLayout } from '@/components/layout/AppLayout';
import { OrderDetailsPage } from '@/components/orders/OrderDetailsPage';
import { Button } from '@/components/ui/button';
import { Edit, Copy, Plus } from 'lucide-react';

export default function Home() {
  return (
    <AppLayout
      headerTitle="Order Details"
      breadcrumbs={[
        { label: 'Orders', href: '/orders/search' },
        { label: '#FT1230251-001' },
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
      <OrderDetailsPage orderId="#FT1230251-001" />
    </AppLayout>
  );
}
