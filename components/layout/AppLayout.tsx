'use client';

import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';

interface AppLayoutProps {
  children: React.ReactNode;
  headerTitle: string;
  breadcrumbs?: Array<{ label: string; href?: string }>;
}

export function AppLayout({ children, headerTitle, breadcrumbs }: AppLayoutProps) {
  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Sidebar - hidden on mobile, shown on lg+ */}
      <div className="hidden lg:block w-64 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile Sidebar - shown on mobile, hidden on lg+ */}
      <div className="lg:hidden">
        <Sidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-auto w-full">
        {/* Top header - always show */}
        <TopHeader title={headerTitle} breadcrumbs={breadcrumbs} />

        {/* Page content */}
        <main className="flex-1 overflow-auto">
          <div className="p-4 sm:p-6 lg:p-8">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
