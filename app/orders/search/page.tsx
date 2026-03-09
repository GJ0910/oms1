'use client';

import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';
import { ORDER_TYPES, ORDER_STATUSES, shouldHaveAWB, canHaveClone, generateOrderId } from '@/lib/types';
import type { OrderType, OrderStatus } from '@/lib/types';

interface OrderData {
  id: string;
  timestamp: string;
  brand: string;
  orderType: OrderType;
  orderTotal: number;
  shopifyId: string;
  paymentMethod: string;
  orderStatus: OrderStatus;
  awb: string;
  courier: string;
  refundStatus: string;
  cloneOrderId?: string;
  cloneReason?: string;
  cloneOrderStatus?: string;
}

// Static mock data - 100 orders for demo
const MOCK_ORDERS: OrderData[] = [
  { id: '#FTY-030326-0001', timestamp: 'March 03, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2301', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789012', courier: 'DHL Express', refundStatus: 'NA' },
  { id: '#FTL-020326-0001', timestamp: 'March 02, 2026; 12:36', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_SYSTEM, orderTotal: 3499.6, shopifyId: 'FY-2302', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.PLACED, awb: 'NA', courier: 'Shiprocket', refundStatus: 'NA' },
  { id: '#FTL-010326-0001', timestamp: 'March 01, 2026; 12:36', brand: 'Fitelo', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2303', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.PICKUP_DONE, awb: '123456789014', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-010326-0002', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: ORDER_STATUSES.PLACED },
  { id: '#FTY-280226-0001', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2304', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.CANCELLED, awb: 'NA', courier: 'FedEx', refundStatus: 'Requested' },
  { id: '#FTY-280226-0002', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2305', paymentMethod: 'Partial COD', orderStatus: ORDER_STATUSES.CONFIRMED, awb: 'NA', courier: 'DHL Express', refundStatus: 'NA' },
  { id: '#FTL-270226-0001', timestamp: 'February 27, 2026; 08:15', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_MANUAL, orderTotal: 3499.6, shopifyId: 'FY-2306', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789016', courier: 'Shiprocket', refundStatus: 'NA' },
  { id: '#FTY-260226-0001', timestamp: 'February 26, 2026; 14:22', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2307', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.IN_TRANSIT, awb: '123456789017', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-260226-0001', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: ORDER_STATUSES.PLACED },
  { id: '#FTL-250226-0001', timestamp: 'February 25, 2026; 10:45', brand: 'Fitelo', orderType: ORDER_TYPES.MEDUSA, orderTotal: 3499.6, shopifyId: 'FY-2308', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.PLACED, awb: 'NA', courier: 'FedEx', refundStatus: 'NA' },
  { id: '#FTY-240226-0001', timestamp: 'February 24, 2026; 16:30', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, shopifyId: 'FY-2309', paymentMethod: 'Partial COD', orderStatus: ORDER_STATUSES.OUT_FOR_DELIVERY, awb: '123456789019', courier: 'DHL Express', refundStatus: 'NA' },
  { id: '#FTL-230226-0001', timestamp: 'February 23, 2026; 09:18', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_SYSTEM, orderTotal: 3499.6, shopifyId: 'FY-2310', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789020', courier: 'Shiprocket', refundStatus: 'NA' },
];

export default function SearchOrdersPage() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get('q') || '';
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [queryParam]);

  const filteredOrders = useMemo(() => {
    if (!queryParam.trim()) return [];

    const query = queryParam.toLowerCase();
    return MOCK_ORDERS.filter(order =>
      order.id.toLowerCase().includes(query) ||
      order.shopifyId.toLowerCase().includes(query) ||
      order.awb.toLowerCase().includes(query) ||
      order.brand.toLowerCase().includes(query)
    );
  }, [queryParam]);

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 2,
    }).format(amount);
  };

  return (
    <AppLayout
      headerTitle="Search Orders"
      breadcrumbs={[{ label: 'Orders', href: '/orders/search' }]}
    >
      <div className="space-y-6">
        {/* Results or empty state */}
        {queryParam.trim() === '' ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-foreground mb-2">Search for orders</p>
            <p className="text-sm text-muted-foreground">Use the search box in the top bar to find orders by ID, Shopify ID, AWB, phone, or email</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-lg font-medium text-foreground mb-2">No orders found</p>
            <p className="text-sm text-muted-foreground">Try adjusting your search terms</p>
          </div>
        ) : (
          <>
            {/* Table */}
            <div className="rounded-lg border border-border overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-muted/50 border-b border-border">
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Order</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Brand</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Order Type</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Order Total</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Shopify ID</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Payment Method</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Order Status</th>
                    <th className="px-4 py-3 text-left font-semibold text-foreground">AWB</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, index) => (
                    <tr key={order.id} className={`border-b border-border ${index % 2 === 0 ? 'bg-muted/20' : ''}`}>
                      <td className="px-4 py-3">
                        <Link href={`/orders/${order.id.replace('#', '')}`} className="text-primary hover:underline font-medium">
                          {order.id}
                        </Link>
                        <div className="text-xs text-muted-foreground mt-1">{order.timestamp}</div>
                      </td>
                      <td className="px-4 py-3">{order.brand}</td>
                      <td className="px-4 py-3">{order.orderType}</td>
                      <td className="px-4 py-3">{formatINR(order.orderTotal)}</td>
                      <td className="px-4 py-3">{order.shopifyId}</td>
                      <td className="px-4 py-3">{order.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={order.orderStatus === ORDER_STATUSES.DELIVERED ? 'success' : order.orderStatus === ORDER_STATUSES.CANCELLED ? 'error' : order.orderStatus === ORDER_STATUSES.PLACED ? 'warning' : 'pending'}>
                          {order.orderStatus}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {order.awb !== 'NA' ? (
                          <div className="flex items-center gap-2">
                            <span className="font-mono text-xs">{order.awb}</span>
                            <CopyButton text={order.awb} label="Copy" />
                          </div>
                        ) : (
                          <span className="text-muted-foreground">NA</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-card border border-border rounded-lg">
                <div className="text-sm text-muted-foreground">
                  Showing {(currentPage - 1) * PAGE_SIZE + 1} to {Math.min(currentPage * PAGE_SIZE, filteredOrders.length)} of {filteredOrders.length} results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="p-2 hover:bg-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm text-foreground">
                    Page {currentPage} of {totalPages}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="p-2 hover:bg-muted rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
