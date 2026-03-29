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
  ClipboardList,
  FileText,
  Files,
  CheckCircle2,
} from 'lucide-react';
import { getAuthUser, hasPermission, type AuthUser } from '@/lib/auth';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    orders: true,
    requests: false,
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
      group: 'requests',
      label: 'Requests',
      icon: ClipboardList,
      items: [
        { label: 'Open Requests', href: '/requests/open', icon: FileText, permissionId: 'open-requests' },
        { label: 'All Requests', href: '/requests/all', icon: Files, permissionId: 'all-requests' },
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
          <div className="mb-8 flex items-center gap-3 px-2">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-lg bg-primary shadow-md">
              <span className="text-xs font-bold text-primary-foreground">NGF</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground leading-tight">No Guilt Fitness</h1>
              <p className="text-xs text-muted-foreground">Order Management</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {/* My Tasks - Direct navigation item */}
            <Link
              href="/tasks"
              className={`flex items-center gap-3 rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                isActive('/tasks')
                  ? 'bg-primary/20 font-semibold text-primary shadow-sm'
                  : 'text-foreground hover:bg-muted/60'
              }`}
              onClick={() => {
                if (window.innerWidth < 1024) {
                  setIsOpen(false);
                }
              }}
            >
              <CheckCircle2 className="h-4 w-4 flex-shrink-0" />
              <span>My Tasks</span>
            </Link>

            {/* Groups */}
            {navItems.map(({ group, label, icon: Icon, items }) => (
              <div key={group}>
                <button
                  onClick={() => toggleGroup(group)}
                  className={`w-full rounded-md px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${expandedGroups[group]
                      ? 'bg-muted/70 text-foreground shadow-sm'
                      : 'text-foreground hover:bg-muted/50'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{label}</span>
                    </div>
                    <ChevronDown
                      className={`h-4 w-4 transition-transform duration-200 flex-shrink-0 ${expandedGroups[group] ? 'rotate-180' : ''
                        }`}
                    />
                  </div>
                </button>

                {/* Submenu */}
                {expandedGroups[group] && (
                  <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-border/40 pl-3">
                    {items.map(({ label: itemLabel, href, icon: ItemIcon }) => (
                      <Link
                        key={href}
                        href={href}
                        className={`flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-all duration-200 ${isActive(href)
                            ? 'bg-primary/20 font-semibold text-primary shadow-sm'
                            : 'text-foreground hover:bg-muted/50'
                          }`}
                      >
                        <ItemIcon className="h-4 w-4 flex-shrink-0" />
                        <span>{itemLabel}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-6 border-t border-border/40 px-2 pt-4 text-xs text-muted-foreground/70">
            <p>© 2024 No Guilt Fitness</p>
          </div>
        </div>
      </aside>
    </>
  );
}
