'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

import { ChevronDown, LogOut, User } from 'lucide-react';

export function UserSection() {

  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  const user = {
    email: 'admin@fitelo.co',
    role: 'Admin',
  };

  const initials = user.email.split('@')[0].slice(0, 2).toUpperCase();

  const handleLogout = () => {
    localStorage.removeItem('demo_user');
    setIsOpen(false);
    router.push('/login');
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-muted transition-colors"
      >
        {/* Avatar */}
        <div className="w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-semibold">
          {initials}
        </div>

        {/* Email and Role */}
        <div className="hidden sm:flex flex-col items-start">
          <div className="text-xs text-muted-foreground">Email:</div>
          <div className="text-sm font-medium text-foreground max-w-xs truncate">{user.email}</div>
          <div className="text-xs text-muted-foreground">Role:</div>
          <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-primary/10 text-primary text-xs font-semibold">
            {user.role}
          </div>
        </div>

        {/* Chevron */}
        <ChevronDown className="h-4 w-4 text-muted-foreground" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-card border border-border rounded-lg shadow-lg z-50">
          <button
            onClick={() => setIsOpen(false)}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-lg"
          >
            <User className="h-4 w-4" />
            Edit Profile
          </button>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-destructive/10 transition-colors rounded-b-lg"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      )}
    </div>
  );
}
