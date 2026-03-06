'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { useEffect } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { PERMISSIONS } from '@/lib/types';
import { Search, Plus, BarChart3, ListOrdered, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const SHORTCUT_CARDS = [
  {
    id: 'search-orders',
    label: 'Search Orders',
    description: 'Find and view existing orders',
    href: '/orders/search',
    icon: Search,
    permission: 'SearchOrders',
  },
  {
    id: 'create-order',
    label: 'Create Order',
    description: 'Create a new order',
    href: '/orders/create',
    icon: Plus,
    permission: 'CreateOrder',
  },
  {
    id: 'order-analytics',
    label: 'Order Analytics',
    description: 'View analytics and reports',
    href: '/analytics/orders',
    icon: BarChart3,
    permission: 'OrderAnalytics',
  },
  {
    id: 'order-listing',
    label: 'Order Listing',
    description: 'Browse all orders',
    href: '/analytics/listing',
    icon: ListOrdered,
    permission: 'OrderListing',
  },
];

export default function HomePage() {
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!user) {
    return null;
  }

  const userPermissions = PERMISSIONS[user.role];
  const visibleCards = SHORTCUT_CARDS.filter(card => userPermissions.includes(card.permission));

  return (
    <AppLayout headerTitle="Home">
      <div className="space-y-6">
        {/* Welcome section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, {user.name}!</h2>
          <p className="text-muted-foreground">You're logged in as <span className="font-medium">{user.email}</span> with <span className="font-medium">{user.role}</span> role.</p>
        </div>

        {/* Shortcut cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {visibleCards.map(card => {
            const Icon = card.icon;
            return (
              <Link
                key={card.id}
                href={card.href}
                className="group bg-card border border-border rounded-lg p-6 hover:shadow-md transition-all hover:border-primary/50"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Icon className="h-6 w-6 text-primary" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors opacity-0 group-hover:opacity-100" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-1">{card.label}</h3>
                <p className="text-sm text-muted-foreground">{card.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
