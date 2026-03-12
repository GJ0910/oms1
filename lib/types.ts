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

// Request Types
export const REQUEST_TYPES = {
  REFUND: 'Refund',
  REATTEMPT: 'Reattempt',
  UPDATE: 'Update',
} as const;

export type RequestType = typeof REQUEST_TYPES[keyof typeof REQUEST_TYPES];

// Request Statuses by Type
export const REFUND_STATUSES = {
  PENDING: 'Pending',
  REVIEW: 'Review',
  APPROVAL_PENDING: 'Approval Pending',
  ACCEPTED: 'Accepted',
  PROCESSING_PENDING: 'Processing Pending',
  PROCESSED: 'Processed',
  DEFERRED: 'Deferred',
} as const;

export const REATTEMPT_STATUSES = {
  PENDING: 'Pending',
  INITIATED: 'Initiated',
} as const;

export const UPDATE_STATUSES = {
  PENDING: 'Pending',
  INITIATED: 'Initiated',
} as const;

export type RefundStatus = typeof REFUND_STATUSES[keyof typeof REFUND_STATUSES];
export type ReattemptStatus = typeof REATTEMPT_STATUSES[keyof typeof REATTEMPT_STATUSES];
export type UpdateStatus = typeof UPDATE_STATUSES[keyof typeof UPDATE_STATUSES];
export type RequestStatus = RefundStatus | ReattemptStatus | UpdateStatus;

// Open (non-terminal) statuses for each request type
export const REFUND_OPEN_STATUSES: RefundStatus[] = [
  REFUND_STATUSES.PENDING,
  REFUND_STATUSES.REVIEW,
  REFUND_STATUSES.APPROVAL_PENDING,
  REFUND_STATUSES.ACCEPTED,
  REFUND_STATUSES.PROCESSING_PENDING,
];

export const REFUND_TERMINAL_STATUSES: RefundStatus[] = [
  REFUND_STATUSES.PROCESSED,
  REFUND_STATUSES.DEFERRED,
];

export const REATTEMPT_OPEN_STATUSES: ReattemptStatus[] = [
  REATTEMPT_STATUSES.PENDING,
];

export const REATTEMPT_TERMINAL_STATUSES: ReattemptStatus[] = [
  REATTEMPT_STATUSES.INITIATED,
];

export const UPDATE_OPEN_STATUSES: UpdateStatus[] = [
  UPDATE_STATUSES.PENDING,
];

export const UPDATE_TERMINAL_STATUSES: UpdateStatus[] = [
  UPDATE_STATUSES.INITIATED,
];

// Helper function to check if a request status is open (non-terminal)
export function isRequestOpen(type: RequestType, status: RequestStatus): boolean {
  switch (type) {
    case REQUEST_TYPES.REFUND:
      return REFUND_OPEN_STATUSES.includes(status as RefundStatus);
    case REQUEST_TYPES.REATTEMPT:
      return REATTEMPT_OPEN_STATUSES.includes(status as ReattemptStatus);
    case REQUEST_TYPES.UPDATE:
      return UPDATE_OPEN_STATUSES.includes(status as UpdateStatus);
    default:
      return false;
  }
}

// Helper function to generate request ID
export function generateRequestId(type: RequestType, date: Date, sequence: number): string {
  const typeCode = type === REQUEST_TYPES.REFUND ? 'RFD' : type === REQUEST_TYPES.REATTEMPT ? 'RAT' : 'UPD';
  const dd = String(date.getDate()).padStart(2, '0');
  const mm = String(date.getMonth() + 1).padStart(2, '0');
  const yy = String(date.getFullYear()).slice(-2);
  const xxxx = String(sequence).padStart(4, '0');
  return `#${typeCode}-${dd}${mm}${yy}-${xxxx}`;
}
