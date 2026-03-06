import { BrandCode } from './types';

export function generateOrderId(brandCode: BrandCode, sequenceNumber: number): string {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const year = String(now.getFullYear()).slice(-2);
  const seq = String(sequenceNumber).padStart(4, '0');

  return `#${brandCode}-${day}${month}${year}-${seq}`;
}

export function isValidOrderId(orderId: string): boolean {
  const regex = /^#(FTY|FTL)-\d{6}-\d{4}$/;
  return regex.test(orderId);
}

export function extractBrandFromOrderId(orderId: string): BrandCode | null {
  const match = orderId.match(/^#(FTY|FTL)-/);
  return match ? (match[1] as BrandCode) : null;
}
