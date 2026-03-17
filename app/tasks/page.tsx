'use client';

import { AppLayout } from '@/components/layout/AppLayout';
import { MyTasksPage } from '@/components/tasks/MyTasksPage';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

export default function TasksPage() {
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
      headerTitle="My Tasks"
      breadcrumbs={[
        { label: 'My Tasks' },
      ]}
    >
      <MyTasksPage />
    </AppLayout>
  );
}
