'use client';

import { ChevronRight, Home } from 'lucide-react';
import Link from 'next/link';

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

        {/* Right side - Actions */}
        {actions && (
          <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap sm:ml-4 justify-end sm:justify-start">
            {actions}
          </div>
        )}
      </div>
    </header>
  );
}
