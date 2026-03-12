'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { RequestListingPage } from '@/components/requests/RequestListingPage';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

export default function AllRequestsPage() {
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
      headerTitle="All Requests"
      breadcrumbs={[
        { label: 'Requests', href: '/requests/all' },
        { label: 'All Requests' },
      ]}
    >
      <RequestListingPage showOnlyOpen={false} />
    </AppLayout>
  );
}
