// Brand codes for order IDs
export const BRAND_CODES = {
  'Fitty': 'FTY',
  'Fitelo': 'FTL',
} as const;

// Order types - allowed values only
export const ORDER_TYPES = {
  SHOPIFY: 'Shopify',
  MEDUSA: 'Medusa',
  CLONE_MANUAL: 'Clone (Manual)',
  CLONE_SYSTEM: 'Clone (System)',
} as const;

export type OrderType = typeof ORDER_TYPES[keyof typeof ORDER_TYPES];

// Order statuses - complete enum
export const ORDER_STATUSES = {
  PLACED: 'Placed',
  CONFIRMED: 'Confirmed',
  PICKUP_SCHEDULED: 'Pickup Scheduled',
  OUT_FOR_PICKUP: 'Out for Pickup',
  PICKUP_DONE: 'Pickup Done',
  IN_TRANSIT: 'In Transit',
  OUT_FOR_DELIVERY: 'Out for Delivery',
  DELIVERED: 'Delivered',
  DELIVERY_FAILED: 'Delivery Failed',
  RTO_NDR: 'RTO - NDR',
  RTO_IN_TRANSIT_NDR: 'RTO In Transit - NDR',
  RTO_DELIVERED_NDR: 'RTO Delivered - NDR',
  CANCELLATION_REQUESTED: 'Cancellation Requested',
  CANCELLED: 'Cancelled',
  RTO_CANCELLATION: 'RTO - Cancellation',
  RTO_IN_TRANSIT_CANCELLATION: 'RTO In Transit - Cancellation',
  RTO_DELIVERED_CANCELLATION: 'RTO Delivered - Cancellation',
  CANCELLED_REPLACEMENT_CREATED: 'Cancelled - Replacement Created',
  RTO_REPLACEMENT_CREATED: 'RTO - Replacement Created',
  RTO_IN_TRANSIT_REPLACEMENT_CREATED: 'RTO In Transit - Replacement Created',
  RTO_DELIVERED_REPLACEMENT_CREATED: 'RTO Delivered - Replacement Created',
} as const;

export type OrderStatus = typeof ORDER_STATUSES[keyof typeof ORDER_STATUSES];

// Helper function to check if status allows AWB
export function shouldHaveAWB(status: OrderStatus): boolean {
  const noAwbStatuses = [ORDER_STATUSES.PLACED, ORDER_STATUSES.CONFIRMED];
  return !noAwbStatuses.includes(status);
}

// Helper function to check if order can have clone
export function canHaveClone(orderType: OrderType): boolean {
  const cloneTypes = [ORDER_TYPES.CLONE_MANUAL, ORDER_TYPES.CLONE_SYSTEM];
  return !cloneTypes.includes(orderType);
}

// Helper function to generate order ID in correct format
export function generateOrderId(brandName: string, date: Date, sequence: number): string {
  const brandCode = BRAND_CODES[brandName as keyof typeof BRAND_CODES] || 'FTY';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const xxxx = String(sequence).padStart(4, '0');
  return `#${brandCode}-${dd}${mm}${yy}-${xxxx}`;
}
