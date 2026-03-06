export type UserRole = 'Admin' | 'Ops' | 'CS';

export type OrderType = 'Shopify' | 'Medusa' | 'Clone (Manual)' | 'Clone (System)';

export type OrderStatus =
  | 'Placed'
  | 'Confirmed'
  | 'Pickup Scheduled'
  | 'Out for Pickup'
  | 'Pickup Done'
  | 'In Transit'
  | 'Out for Delivery'
  | 'Delivered'
  | 'Delivery Failed'
  | 'RTO - NDR'
  | 'RTO In Transit - NDR'
  | 'RTO Delivered - NDR'
  | 'Cancellation Requested'
  | 'Cancelled'
  | 'RTO - Cancellation'
  | 'RTO In Transit - Cancellation'
  | 'RTO Delivered - Cancellation'
  | 'Cancelled - Replacement Created'
  | 'RTO - Replacement Created'
  | 'RTO In Transit - Replacement Created'
  | 'RTO Delivered - Replacement Created';

export type BrandCode = 'FTY' | 'FTL';

export const BRAND_NAMES: Record<BrandCode, string> = {
  FTY: 'Fitty',
  FTL: 'Fitelo',
};

export interface User {
  email: string;
  role: UserRole;
  name?: string;
}

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => boolean;
  logout: () => void;
}

export const PERMISSIONS: Record<UserRole, string[]> = {
  Admin: ['SearchOrders', 'CreateOrder', 'OrderAnalytics', 'OrderListing'],
  Ops: ['SearchOrders', 'CreateOrder', 'OrderAnalytics', 'OrderListing'],
  CS: ['SearchOrders'],
};

export const VALID_CREDENTIALS: Record<string, string> = {
  'admin@fitelo.co': 'Admin@123',
  'ops@fitelo.co': 'Ops@123',
  'cs@fitelo.co': 'Cs@123',
};

export const ROLE_MAP: Record<string, UserRole> = {
  'admin@fitelo.co': 'Admin',
  'ops@fitelo.co': 'Ops',
  'cs@fitelo.co': 'CS',
};
