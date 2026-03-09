'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ChevronDown, Menu, X, Package, Search, Plus, BarChart3, LineChart, ListOrdered } from 'lucide-react';

export function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const [expandedGroups, setExpandedGroups] = useState<Record<string, boolean>>({
    orders: true,
    analytics: false,
  });
  const pathname = usePathname();

  const toggleGroup = (group: string) => {
    setExpandedGroups(prev => ({
      ...prev,
      [group]: !prev[group],
    }));
  };

  const isActive = (href: string) => pathname.startsWith(href);

  const navItems = [
    {
      group: 'orders',
      label: 'Orders',
      icon: Package,
      items: [
        { label: 'Search Orders', href: '/orders/search', icon: Search },
        { label: 'Create Order', href: '/orders/create', icon: Plus },
      ],
    },
    {
      group: 'analytics',
      label: 'Analytics',
      icon: BarChart3,
      items: [
        { label: 'Order Analytics', href: '/analytics/orders', icon: LineChart },
        { label: 'Order Listing', href: '/analytics/listing', icon: ListOrdered },
      ],
    },
  ];

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </button>

      {/* Sidebar overlay on mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-200 fixed lg:static inset-y-0 left-0 z-40 w-64 bg-card border-r border-border overflow-y-auto`}>
        <div className="p-4 sm:p-6">
          <div className="flex items-center gap-2 mb-8">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <span className="text-sm font-bold text-primary-foreground">NGF</span>
            </div>
            <div>
              <h1 className="font-semibold text-foreground">No Guilt</h1>
              <p className="text-xs text-muted-foreground">Order Management</p>
            </div>
          </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-4 py-6 space-y-1">
          {navItems.map(({ group, label, icon: Icon, items }) => (
            <div key={group}>
              <button
                onClick={() => toggleGroup(group)}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-md text-sm font-medium transition-colors ${
                  expandedGroups[group]
                    ? 'bg-sidebar-accent text-sidebar-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className="h-4 w-4" />
                  <span>{label}</span>
                </div>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    expandedGroups[group] ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {/* Submenu */}
              {expandedGroups[group] && (
                <div className="ml-2 mt-1 space-y-0.5 border-l-2 border-sidebar-border">
                  {items.map(({ label: itemLabel, href, icon: ItemIcon }) => (
                    <Link
                      key={href}
                      href={href}
                      className={`flex items-center gap-3 px-4 py-2 rounded-md text-sm transition-colors pl-6 ${
                        isActive(href)
                          ? 'bg-sidebar-primary text-sidebar-primary-foreground font-medium'
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
        <div className="border-t border-sidebar-border px-6 py-4 text-xs text-sidebar-accent-foreground">
          <p>© 2024 Fitty Admin</p>
        </div>
      </aside>
    </>
  );
}
