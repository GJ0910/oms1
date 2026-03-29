'use client';

import { ChevronRight, Home, ChevronDown, LogOut, User, Search } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';
import { getAuthUser, clearAuthUser, getUserInitials, type AuthUser } from '@/lib/auth';

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
  const [user, setUser] = useState<AuthUser | null>(null);
  const router = useRouter();

  useEffect(() => {
    setUser(getAuthUser());
  }, []);

  const handleLogout = () => {
    clearAuthUser();
    setIsDropdownOpen(false);
    router.push('/login');
  };

  const userEmail = user?.email ?? '';
  const userRole = user?.role ?? '';
  const userInitials = user ? getUserInitials(user.name) : 'U';

  const handleGlobalSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (globalSearchQuery.trim()) {
      router.push(`/orders/search?q=${encodeURIComponent(globalSearchQuery)}`);
      setGlobalSearchQuery('');
    }
  };

  return (
    <header className="sticky top-0 z-20 border-b border-border bg-card shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between px-4 sm:px-6 lg:px-8 py-3.5 gap-4 sm:gap-0">
        {/* Left side - Title and Breadcrumbs */}
        <div className="flex-1 min-w-0">
          {breadcrumbs.length > 0 ? (
            <div className="flex items-center gap-1.5 mb-2.5 overflow-x-auto pb-1">
              <Link href="/" className="inline-flex items-center flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 rounded hover:bg-muted/40">
                <Home className="h-4 w-4" />
              </Link>
              {breadcrumbs.map((item, index) => (
                <div key={index} className="flex items-center gap-1.5 flex-shrink-0">
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground/60" />
                  {item.href ? (
                    <Link
                      href={item.href}
                      className="text-xs sm:text-sm text-muted-foreground hover:text-foreground transition-colors truncate px-1.5 py-1 rounded hover:bg-muted/40"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-xs sm:text-sm text-foreground font-medium truncate px-1.5 py-1">{item.label}</span>
                  )}
                </div>
              ))}
            </div>
          ) : null}
          <h1 className="text-xl sm:text-2xl font-bold text-foreground truncate">{title}</h1>
        </div>

        {/* Center - Global Search */}
        <div className="flex-1 flex justify-center px-4">
          <form onSubmit={handleGlobalSearch} className="w-full max-w-md">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                type="text"
                placeholder="Search by Order ID, Platform ID, AWB..."
                value={globalSearchQuery}
                onChange={(e) => setGlobalSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-transparent transition-all"
              />
            </div>
          </form>
        </div>

        {/* Right side - User section and Actions */}
        <div className="flex items-center gap-3 sm:ml-4">
          {/* User Info */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-2.5 px-2.5 py-1.5 rounded-lg hover:bg-muted/60 transition-all duration-200 active:scale-95"
            >
              {/* Avatar */}
              <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center flex-shrink-0 border border-primary/20">
                <span className="text-xs font-semibold text-primary">{userInitials}</span>
              </div>
              
              {/* User details - hidden on mobile */}
              <div className="hidden sm:flex flex-col items-start gap-0.5">
                <span className="text-xs text-muted-foreground/80">{userEmail}</span>
                <span className="text-xs font-medium text-foreground leading-tight">{userRole}</span>
              </div>

              <ChevronDown className={`h-4 w-4 text-muted-foreground/70 flex-shrink-0 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg py-1.5 z-50">
                <button className="w-full px-3.5 py-2 text-sm text-foreground hover:bg-muted/60 transition-colors flex items-center gap-3 rounded-md mx-1.5 my-0.5">
                  <User className="h-4 w-4 text-muted-foreground/70" />
                  Edit Profile
                </button>
                <div className="border-t border-border/50 my-1" />
                <button 
                  onClick={handleLogout}
                  className="w-full px-3.5 py-2 text-sm text-foreground hover:bg-destructive/10 hover:text-destructive transition-colors flex items-center gap-3 rounded-md mx-1.5 my-0.5"
                >
                  <LogOut className="h-4 w-4 text-muted-foreground/70" />
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
