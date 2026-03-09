import { AppLayout } from '@/components/layout/AppLayout';
import Link from 'next/link';
import { Search, Plus, BarChart3, ListOrdered } from 'lucide-react';

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
  return (
    <AppLayout headerTitle="Home">
      <div className="space-y-8">
        {/* Welcome section */}
        <div>
          <h2 className="text-2xl font-bold text-foreground mb-2">Welcome back, Admin</h2>
          <p className="text-muted-foreground">Access order management tools and analytics from the shortcuts below.</p>
        </div>

        {/* Shortcut cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SHORTCUT_CARDS.map(card => {
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
