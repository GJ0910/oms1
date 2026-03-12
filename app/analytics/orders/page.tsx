'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { BarChart3 } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

export default function OrderAnalyticsPage() {
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
      headerTitle="Order Analytics"
      breadcrumbs={[{ label: 'Analytics', href: '/analytics' }, { label: 'Order Analytics' }]}
    >
      <div className="max-w-2xl mx-auto">
        <div className="bg-card border border-border rounded-lg p-8">
          <div className="text-center space-y-4">
            <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mx-auto">
              <BarChart3 className="h-8 w-8 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">Order Analytics</h2>
            <p className="text-muted-foreground">
              The Order Analytics module is under development. We're building comprehensive analytics and reporting features to help you understand your order data better.
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
