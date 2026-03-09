'use client';

import { ChevronRight, Home, ChevronDown, LogOut, User, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface TopHeaderProps {
  title: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
}

export function TopHeader({ title, breadcrumbs = [], actions }: TopHeaderProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [globalSearchQuery, setGlobalSearchQuery] = useState('');
  const router = useRouter();
  const userEmail = 'admin@fitelo.co';
  const userRole = 'Admin';

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      router.push(`/orders/search?q=${encodeURIComponent(globalSearchQuery)}`);
      setGlobalSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8 py-4 gap-4 sm:gap-0">
        {/* Left side - Title and Breadcrumbs */}
        <div className="flex-1 min-w-0">
          {breadcrumbs.length > 0 ? (
            <div className="flex items-center gap-2 mb-2 overflow-x-auto">
              <Link href="/" className="inline-flex items-center flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors">
                <Home className="h-4 w-4" />
              </Link>
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-2 flex-shrink-0">
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors truncate"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-xs sm:text-sm text-foreground font-medium truncate">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{title}</h1>
        </div>

        {/* Center - Global Search */}
        <form onSubmit={handleGlobalSearch} className="flex-1 max-w-md mx-auto px-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Search orders by ID, Shopify ID, AWB, phone, email..."
              value={globalSearchQuery}
              onChange={(e) => setGlobalSearchQuery(e.target.value)}
              className="w-full px-4 py-2 pr-10 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
            />
            <button
              type="submit"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label="Search"
            >
              <Search className="h-4 w-4" />
            </button>
          </div>
        </form>

        {/* Right side - User section and Actions */}
        <div className="flex items-center gap-4 sm:ml-4">
          {/* User Info */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-xs font-semibold text-primary">A</span>
              </div>
              
              {/* User details - hidden on mobile */}
              <div className="hidden sm:flex flex-col items-start">
                <span className="text-xs text-muted-foreground">{userEmail}</span>
                <span className="text-xs font-medium text-foreground">{userRole}</span>
              </div>

              <ChevronDown className="h-4 w-4 text-muted-foreground flex-shrink-0" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-2 z-50">
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Edit Profile
                </button>
                <button className="w-full px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors flex items-center gap-2 border-t border-border">
                  <LogOut className="h-4 w-4" />
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Actions */}
          {actions && (
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              {actions}
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
