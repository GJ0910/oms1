import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import SearchOrdersPageClient from './SearchOrdersPageClient';

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: 'Search Orders',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

function SearchOrdersFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground">
      Loading...
    </div>
  );
}

export default function SearchOrdersPage() {
  return (
    <Suspense fallback={<SearchOrdersFallback />}>
      <SearchOrdersPageClient />
    </Suspense>
  );
}