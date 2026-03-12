'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { AlertCircle } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

export default function CreateOrderPage() {
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
      headerTitle="Create Order"
      breadcrumbs={[{ label: 'Orders', href: '/orders/search' }, { label: 'Create Order' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-amber-100 rounded-lg flex items-center justify-center mx-auto">
              <AlertCircle className="h-8 w-8 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Create Order</h2>
            <p className="text-muted-foreground">
              The Create Order module is under development. We're working on building this feature to enable you to create new orders directly from the dashboard.
            </p>
            <p className="text-sm text-muted-foreground pt-4 border-t border-border">
              This feature will be available in an upcoming release. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
