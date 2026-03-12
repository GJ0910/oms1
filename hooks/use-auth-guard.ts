'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getAuthUser, type AuthUser } from '@/lib/auth';

interface UseAuthGuardResult {
  user: AuthUser | null;
  isLoading: boolean;
}

export function useAuthGuard(): UseAuthGuardResult {
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

  return { user, isLoading };
}
