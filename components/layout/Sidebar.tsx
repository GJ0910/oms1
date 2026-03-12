'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  ChevronDown,
  Menu,
  X,
  Package,
  Search,
  Plus,
  BarChart3,
  LineChart,
  ListOrdered,
} from 'lucide-react';
import { getAuthUser, hasPermission, type AuthUser } from '@/lib/auth';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    orders: true,
    analytics: false,
  });
  const [user, setUser] = useState<AuthUser | null>(null);

  const pathname = usePathname();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const toggleGroup = (group: string) => {
    setExpandedGroups((prev) => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const allNavItems = [
    {
      group: 'orders',
      label: 'Orders',
      icon: Package,
      items: [
        { label: 'Search Orders', href: '/orders/search', icon: Search, permissionId: 'search-orders' },
        { label: 'Create Order', href: '/orders/create', icon: Plus, permissionId: 'create-order' },
      ],
    },
    {
      group: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      items: [
        { label: 'Order Analytics', href: '/analytics/orders', icon: LineChart, permissionId: 'order-analytics' },
        { label: 'Order Listing', href: '/analytics/listing', icon: ListOrdered, permissionId: 'order-listing' },
      ],
    },
  ];

  // Filter nav items based on user role
  const navItems = user
    ? allNavItems
        .map((group) => ({
          ...group,
          items: group.items.filter((item) => hasPermission(user.role, item.permissionId)),
        }))
        .filter((group) => group.items.length > 0)
    : [];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 rounded-md p-2 transition-colors hover:bg-muted lg:hidden"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`${isOpen ? 'translate-x-0' : '-translate-x-full'
          } fixed inset-y-0 left-0 z-40 w-64 overflow-y-auto border-r border-border bg-card transition-transform duration-200 lg:static`}
      >
        <div className="flex min-h-full flex-col p-4 sm:p-6">
          {/* Branding */}
          <div className="mb-8 flex items-center gap-2">
            <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-lg bg-primary">
              <span className="text-sm font-bold text-primary-foreground">NGF</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">No Guilt Fitness</h1>
              <p className="text-xs text-muted-foreground">Order Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map(({ group, label, icon: Icon, items }) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className={`w-full rounded-md px-4 py-2.5 text-sm font-medium transition-colors ${expandedGroups[group]
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      <span>{label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform ${expandedGroups[group] ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>

                {/* Submenu */}
                {expandedGroups[group] && (
                  <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-sidebar-border">
                    {items.map(({ label: itemLabel, href, icon: ItemIcon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 rounded-md px-4 py-2 pl-6 text-sm transition-colors ${isActive(href)
                            ? 'bg-sidebar-primary font-medium text-sidebar-primary-foreground'
                            : 'text-sidebar-foreground hover:bg-sidebar-accent/30'
                          }`}
                      >
                        <ItemIcon className="h-4 w-4" />
                        <span>{itemLabel}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-6 border-t border-sidebar-border px-2 pt-4 text-xs text-sidebar-accent-foreground">
            <p>© 2024 No Guilt Fitness</p>
          </div>
        </div>
      </aside>
    </>
  );
}
