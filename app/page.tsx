'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Search, Plus, BarChart3, ListOrdered } from 'lucide-react';
import { getAuthUser, hasPermission, type AuthUser } from '@/lib/auth';
import { Spinner } from '@/components/ui/spinner';

const SHORTCUT_CARDS = [
  {
    id: 'search-orders',
    label: 'Search Orders',
    description: 'Find and view existing orders',
    href: '/orders/search',
    icon: Search,
  },
  {
    id: 'create-order',
    label: 'Create Order',
    description: 'Create a new order',
    href: '/orders/create',
    icon: Plus,
  },
  {
    id: 'order-analytics',
    label: 'Order Analytics',
    description: 'View analytics and reports',
    href: '/analytics/orders',
    icon: BarChart3,
  },
  {
    id: 'order-listing',
    label: 'Order Listing',
    description: 'Browse all orders',
    href: '/analytics/listing',
    icon: ListOrdered,
  },
];

export default function Home() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const authUser = getAuthUser();
    if (!authUser) {
      router.replace('/login');
    } else {
      setUser(authUser);
      setIsLoading(false);
    }
  }, [router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  // Filter cards based on user role
  const visibleCards = user
    ? SHORTCUT_CARDS.filter((card) => hasPermission(user.role, card.id))
    : [];

  return (
    <AppLayout headerTitle="Home">
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Welcome back, {user?.name ?? 'User'}
          </h2>
          <p className="text-muted-foreground/80">Access order management tools and analytics from the shortcuts below.</p>
        </div>

        {/* Shortcut cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
          {visibleCards.map(card => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group relative bg-card border border-border rounded-lg p-5 sm:p-6 hover:shadow-md hover:border-primary/40 transition-all duration-200 active:scale-95 overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                <div className="relative z-10">
                  <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/15 transition-colors duration-200 shadow-sm">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <h3 className="text-base font-semibold text-foreground mb-1.5 group-hover:text-primary/90 transition-colors">{card.label}</h3>
                  <p className="text-sm text-muted-foreground/80">{card.description}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
