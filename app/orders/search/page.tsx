'use client';

import { useState, useMemo, FormEvent } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronLeft, ChevronRight } from 'lucide-react';
import { AppLayout } from '@/components/layout/AppLayout';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';
import { ORDER_TYPES, ORDER_STATUSES } from '@/lib/types';
import type { OrderType, OrderStatus } from '@/lib/types';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';

// RTO and cancellation statuses that should show red badge
const RED_BADGE_STATUSES: OrderStatus[] = [
  ORDER_STATUSES.RTO_NDR,
  ORDER_STATUSES.RTO_IN_TRANSIT_NDR,
  ORDER_STATUSES.RTO_DELIVERED_NDR,
  ORDER_STATUSES.CANCELLATION_REQUESTED,
  ORDER_STATUSES.CANCELLED,
  ORDER_STATUSES.RTO_CANCELLATION,
  ORDER_STATUSES.RTO_IN_TRANSIT_CANCELLATION,
  ORDER_STATUSES.RTO_DELIVERED_CANCELLATION,
  ORDER_STATUSES.CANCELLED_REPLACEMENT_CREATED,
  ORDER_STATUSES.RTO_REPLACEMENT_CREATED,
  ORDER_STATUSES.RTO_IN_TRANSIT_REPLACEMENT_CREATED,
  ORDER_STATUSES.RTO_DELIVERED_REPLACEMENT_CREATED,
];

interface OrderData {
  id: string;
  timestamp: string;
  brand: string;
  orderType: OrderType;
  orderTotal: number;
  platformId: string;
  paymentMethod: string;
  orderStatus: OrderStatus;
  awb: string;
  courier: string;
  refundStatus: string;
  cloneOrderId?: string;
  cloneReason?: string;
  cloneOrderStatus?: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

// Static mock data - 100 orders for demo
const MOCK_ORDERS: OrderData[] = [
  { id: '#FTL-040326-0001', timestamp: 'March 04, 2026; 10:00', brand: 'Fitelo', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 4999.0, platformId: '#GARVIT00', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.PLACED, awb: 'NA', courier: 'Shiprocket', refundStatus: 'NA', customerName: 'Garvit', customerEmail: 'garvit.jaisinghani@fitelo.co', customerPhone: '9876500000' },
  { id: '#FTY-030326-0001', timestamp: 'March 03, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2301', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789012', courier: 'DHL Express', refundStatus: 'NA', customerName: 'John Doe', customerEmail: 'john.doe@example.com', customerPhone: '9876543210' },
  { id: '#FTL-020326-0001', timestamp: 'March 02, 2026; 12:36', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_SYSTEM, orderTotal: 3499.6, platformId: 'FY-2302', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.PLACED, awb: 'NA', courier: 'Shiprocket', refundStatus: 'NA', customerName: 'Jane Smith', customerEmail: 'jane.smith@example.com', customerPhone: '9876543211' },
  { id: '#FTL-010326-0001', timestamp: 'March 01, 2026; 12:36', brand: 'Fitelo', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2303', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.PICKUP_DONE, awb: '123456789014', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-010326-0002', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: ORDER_STATUSES.PLACED, customerName: 'Raj Kumar', customerEmail: 'raj.kumar@example.com', customerPhone: '9876543212' },
  { id: '#FTY-280226-0001', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2304', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.CANCELLED, awb: 'NA', courier: 'FedEx', refundStatus: 'Requested', customerName: 'Priya Sharma', customerEmail: 'priya.sharma@example.com', customerPhone: '9876543213' },
  { id: '#FTY-280226-0002', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2305', paymentMethod: 'Partial COD', orderStatus: ORDER_STATUSES.CONFIRMED, awb: 'NA', courier: 'DHL Express', refundStatus: 'NA', customerName: 'Amit Patel', customerEmail: 'amit.patel@example.com', customerPhone: '9876543214' },
  { id: '#FTL-270226-0001', timestamp: 'February 27, 2026; 08:15', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_MANUAL, orderTotal: 3499.6, platformId: 'FY-2306', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789016', courier: 'Shiprocket', refundStatus: 'NA', customerName: 'Neha Gupta', customerEmail: 'neha.gupta@example.com', customerPhone: '9876543215' },
  { id: '#FTY-260226-0001', timestamp: 'February 26, 2026; 14:22', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2307', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.IN_TRANSIT, awb: '123456789017', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-260226-0001', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: ORDER_STATUSES.PLACED, customerName: 'Rahul Singh', customerEmail: 'rahul.singh@example.com', customerPhone: '9876543216' },
  { id: '#FTL-250226-0001', timestamp: 'February 25, 2026; 10:45', brand: 'Fitelo', orderType: ORDER_TYPES.MEDUSA, orderTotal: 3499.6, platformId: 'FY-2308', paymentMethod: 'COD', orderStatus: ORDER_STATUSES.PLACED, awb: 'NA', courier: 'FedEx', refundStatus: 'NA', customerName: 'Sneha Kapoor', customerEmail: 'sneha.kapoor@example.com', customerPhone: '9876543217' },
  { id: '#FTY-240226-0001', timestamp: 'February 24, 2026; 16:30', brand: 'Fitty', orderType: ORDER_TYPES.SHOPIFY, orderTotal: 3499.6, platformId: 'FY-2309', paymentMethod: 'Partial COD', orderStatus: ORDER_STATUSES.OUT_FOR_DELIVERY, awb: '123456789019', courier: 'DHL Express', refundStatus: 'NA', customerName: 'Vikram Mehta', customerEmail: 'vikram.mehta@example.com', customerPhone: '9876543218' },
  { id: '#FTL-230226-0001', timestamp: 'February 23, 2026; 09:18', brand: 'Fitelo', orderType: ORDER_TYPES.CLONE_SYSTEM, orderTotal: 3499.6, platformId: 'FY-2310', paymentMethod: 'Prepaid', orderStatus: ORDER_STATUSES.DELIVERED, awb: '123456789020', courier: 'Shiprocket', refundStatus: 'NA', customerName: 'Anita Joshi', customerEmail: 'anita.joshi@example.com', customerPhone: '9876543219' },
];

function getStatusBadgeType(status: OrderStatus): 'success' | 'warning' | 'pending' | 'error' | 'default' {
  if (RED_BADGE_STATUSES.includes(status)) {
    return 'error';
  }
  if (status === ORDER_STATUSES.DELIVERED) {
    return 'success';
  }
  if (status === ORDER_STATUSES.PLACED || status === ORDER_STATUSES.CONFIRMED) {
    return 'warning';
  }
  return 'pending';
}

export default function SearchOrdersPage() {
  // ALL hooks must be at the top, before any conditional returns
  const { isLoading: isAuthLoading } = useAuthGuard();
  const searchParams = useSearchParams();
  const router = useRouter();
  const queryParam = searchParams.get('q') || '';
  
  const [localSearchQuery, setLocalSearchQuery] = useState(queryParam);
  const [activeSearch, setActiveSearch] = useState(queryParam);
  const [currentPage, setCurrentPage] = useState(1);
  const PAGE_SIZE = 10;

  // useMemo must be called unconditionally
  const filteredOrders = useMemo(() => {
    if (!activeSearch.trim()) return [];

    const query = activeSearch.toLowerCase();
    return MOCK_ORDERS.filter(order =>
      order.id.toLowerCase().includes(query) ||
      order.platformId.toLowerCase().includes(query) ||
      order.awb.toLowerCase().includes(query) ||
      (order.customerEmail?.toLowerCase().includes(query)) ||
      (order.customerPhone?.includes(query))
    );
  }, [activeSearch]);

  // Derived values (not hooks, safe to compute after hooks)
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

  const handleLocalSearch = (e: FormEvent) => {
    e.preventDefault();
    if (localSearchQuery.trim()) {
      setActiveSearch(localSearchQuery.trim());
      setCurrentPage(1);
      // Update URL without navigation
      router.replace(`/orders/search?q=${encodeURIComponent(localSearchQuery.trim())}`, { scroll: false });
    }
  };

  // Conditional returns AFTER all hooks
  if (isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  return (
    <AppLayout
      headerTitle="Search Orders"
      breadcrumbs={[{ label: 'Orders', href: '/orders/search' }]}
    >
      <div className="space-y-6">
        {/* Local Search Bar */}
        <div className="bg-card border border-border rounded-lg p-4">
          <form onSubmit={handleLocalSearch} className="flex gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Search by Order ID, Platform ID, AWB, email, or phone..."
                value={localSearchQuery}
                onChange={(e) => setLocalSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
              />
            </div>
            <button
              type="submit"
              className="btn-primary px-6"
            >
              Search
            </button>
          </form>
        </div>

        {/* Results or empty state */}
        {activeSearch.trim() === '' ? (
          <div className="text-center py-12">
            <Search className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium text-foreground mb-2">Search for orders</p>
            <p className="text-sm text-muted-foreground">Enter a search term above or use the global search bar to find orders by Order ID, Platform ID, AWB, email, or phone</p>
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
                    <th className="px-4 py-3 text-left font-semibold text-foreground">Platform ID</th>
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
                      <td className="px-4 py-3">{order.platformId}</td>
                      <td className="px-4 py-3">{order.paymentMethod}</td>
                      <td className="px-4 py-3">
                        <StatusBadge status={getStatusBadgeType(order.orderStatus)}>
                          {order.orderStatus}
                        </StatusBadge>
                      </td>
                      <td className="px-4 py-3">
                        {order.awb !== 'NA' ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs">{order.awb}</span>
                            <CopyButton text={order.awb} label="" />
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
