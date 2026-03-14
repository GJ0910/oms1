// Simple localStorage-based mock auth
// No AuthProvider, no useAuth, no complex architecture

export type UserRole = 'Admin' | 'Ops' | 'CS' | 'Finance';

export interface User {
  email: string;
  password: string;
  name: string;
  role: UserRole;
}

export interface AuthUser {
  email: string;
  name: string;
  role: UserRole;
}

// Mock user credentials
const MOCK_USERS: User[] = [
  {
    email: 'admin@fitelo.co',
    password: 'Admin@123',
    name: 'Admin',
    role: 'Admin',
  },
  {
    email: 'ops@fitelo.co',
    password: 'Ops@123',
    name: 'Ops',
    role: 'Ops',
  },
  {
    email: 'cs@fitelo.co',
    password: 'Cs@123',
    name: 'CS',
    role: 'CS',
  },
  {
    email: 'finance@fitelo.co',
    password: 'Finance@123',
    name: 'Finance',
    role: 'Finance',
  },
];

// RBAC permissions
export const ROLE_PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['search-orders', 'create-order', 'order-analytics', 'order-listing', 'open-requests', 'all-requests'],
  Ops: ['search-orders', 'create-order', 'order-analytics', 'order-listing', 'open-requests', 'all-requests'],
  CS: ['search-orders', 'open-requests'],
  Finance: ['search-orders', 'open-requests', 'all-requests'],
};

// Auth storage key
const AUTH_KEY = 'fitelo_auth_user';

// Authenticate user
export function authenticateUser(email: string, password: string): AuthUser | null {
  const user = MOCK_USERS.find(
    (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
  );
  
  if (user) {
    const authUser: AuthUser = {
      email: user.email,
      name: user.name,
      role: user.role,
    };
    return authUser;
  }
  
  return null;
}

// Save user to localStorage
export function saveAuthUser(user: AuthUser): void {
  if (typeof window !== 'undefined') {
    localStorage.setItem(AUTH_KEY, JSON.stringify(user));
  }
}

// Get user from localStorage
export function getAuthUser(): AuthUser | null {
  if (typeof window === 'undefined') {
    return null;
  }
  
  try {
    const stored = localStorage.getItem(AUTH_KEY);
    if (stored) {
      return JSON.parse(stored) as AuthUser;
    }
  } catch {
    // Invalid JSON, clear it
    localStorage.removeItem(AUTH_KEY);
  }
  
  return null;
}

// Clear auth from localStorage
export function clearAuthUser(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem(AUTH_KEY);
  }
}

// Check if user is logged in
export function isLoggedIn(): boolean {
  return getAuthUser() !== null;
}

// Check if user has permission for a module
export function hasPermission(role: UserRole, moduleId: string): boolean {
  return ROLE_PERMISSIONS[role]?.includes(moduleId) ?? false;
}

// Get user initials for avatar
export function getUserInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}
