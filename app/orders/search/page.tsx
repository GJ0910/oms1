import { Suspense } from 'react';
import type { Metadata, Viewport } from 'next';
import { Spinner } from '@/components/ui/spinner';
import SearchOrdersPageClient from './SearchOrdersPageClient';

export const metadata: Metadata = {
  title: 'Search Orders',
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
};

function SearchOrdersFallback() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Spinner className="h-8 w-8 text-primary" />
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