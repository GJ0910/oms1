'use client';

import { useState, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Search, ChevronDown, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';

import { ORDER_TYPES, ORDER_STATUSES, shouldHaveAWB, canHaveClone, generateOrderId } from '@/lib/types';
import type { OrderType, OrderStatus } from '@/lib/types';

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

// Generate remaining 90 orders with static pattern following business rules
const generateRemainingOrders = (): OrderData[] => {
  const orders = [...MOCK_ORDERS];
  const statusValues = Object.values(ORDER_STATUSES);
  const brandValues = ['Fitty', 'Fitelo'] as const;
  const orderTypeValues = Object.values(ORDER_TYPES);
  const paymentMethods = ['COD', 'Prepaid', 'Partial COD'];
  const couriers = ['DHL Express', 'Shiprocket', 'BlueDart', 'FedEx'];

  for (let i = 11; i <= 100; i++) {
    const dayOffset = Math.floor((i - 1) / 3);
    const statusIndex = (i - 1) % statusValues.length;
    const brandIndex = (i - 1) % brandValues.length;
    const typeIndex = (i - 1) % orderTypeValues.length;
    const paymentIndex = (i - 1) % paymentMethods.length;
    const courierIndex = (i - 1) % couriers.length;

    const date = new Date('2026-03-03');
    date.setDate(date.getDate() - dayOffset);
    const hours = String((i % 24)).padStart(2, '0');
    const minutes = String((i * 7) % 60).padStart(2, '0');
    
    const brand = brandValues[brandIndex];
    const orderType = orderTypeValues[typeIndex] as OrderType;
    const status = statusValues[statusIndex] as OrderStatus;

    const order: OrderData = {
      id: generateOrderId(brand, date, i),
      timestamp: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${hours}:${minutes}`,
      brand,
      orderType,
      orderTotal: 3499.6,
      platformId: `FY-${String(2300 + i).padStart(4, '0')}`,
      customerName: `Customer ${i}`,
      customerEmail: `customer${i}@example.com`,
      customerPhone: `98765${String(43000 + i).padStart(5, '0')}`,
      paymentMethod: paymentMethods[paymentIndex],
      orderStatus: status,
      awb: shouldHaveAWB(status) ? String(123456789000 + i).substring(0, 12) : 'NA',
      courier: couriers[courierIndex],
      refundStatus: [ORDER_STATUSES.CANCELLED, ORDER_STATUSES.DELIVERY_FAILED].includes(status) ? 'Requested' : 'NA',
    };

    // Only original orders can have clones (not clone orders themselves)
    if (canHaveClone(orderType) && typeIndex === 0) {
      order.cloneOrderId = generateOrderId(brand, date, i + 1000);
      order.cloneReason = 'Reason: Pincode Change';
      order.cloneOrderStatus = ORDER_STATUSES.PLACED;
    }

    orders.push(order);
  }
  return orders;
};

export function OrderListingPage() {
  const searchParams = useSearchParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '27/02/2026',
    end: '03/03/2026',
  });

  const PAGE_SIZE = 10;

  // Use static mock orders combined with generated ones
  const allOrders = useMemo(() => generateRemainingOrders(), []);

  // Filter orders based on URL params and search
  const filteredOrders = useMemo(() => {
    let results = [...allOrders];

    // Apply URL filter params
    const statusParam = searchParams.get('status');
    const paymentTypeParam = searchParams.get('paymentType');
    const sourceParam = searchParams.get('source');
    const isRTOParam = searchParams.get('isRTO');
    const isReplacementParam = searchParams.get('isReplacement');

    // Filter by status if provided
    if (statusParam) {
      results = results.filter(order => 
        order.orderStatus.toLowerCase() === statusParam.toLowerCase()
      );
    }

    // Filter by payment type if provided
    if (paymentTypeParam) {
      results = results.filter(order =>
        order.paymentMethod.toLowerCase().replace(/\s+/g, '') === paymentTypeParam.toLowerCase().replace(/\s+/g, '')
      );
    }

    // Filter by source (order type) if provided
    if (sourceParam) {
      results = results.filter(order => order.orderType.toLowerCase() === sourceParam.toLowerCase());
    }

    // Filter by isRTO if provided
    if (isRTOParam === 'true') {
      results = results.filter(order => order.orderStatus.toLowerCase().includes('rto'));
    }

    // Filter by isReplacement if provided
    if (isReplacementParam === 'true') {
      results = results.filter(order => order.orderStatus.toLowerCase().includes('replacement'));
    }

    // Apply text search if provided
    const query = searchQuery.toLowerCase();
    if (query.trim()) {
      results = results.filter(order =>
        order.id.toLowerCase().includes(query) ||
        order.brand.toLowerCase().includes(query) ||
        order.platformId.toLowerCase().includes(query) ||
        order.awb.toLowerCase().includes(query) ||
        (order.customerEmail?.toLowerCase().includes(query)) ||
        (order.customerPhone?.includes(query))
      );
    }

    return results;
  }, [allOrders, searchQuery, searchParams]);

  // Sort orders
  const sortedOrders = useMemo(() => {
    const sorted = [...filteredOrders];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }
    return sorted;
  }, [filteredOrders, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedOrders.length / PAGE_SIZE);
  const paginatedOrders = sortedOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleExport = () => {
    alert(`Export started for ${sortedOrders.length} orders`);
  };

  const getStatusType = (status: OrderStatus): 'success' | 'warning' | 'pending' | 'error' | 'default' => {
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
  };

  const formatINR = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-card rounded-lg p-4 sm:p-5 border border-border shadow-sm">
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-all duration-200 active:scale-95 whitespace-nowrap shadow-sm"
        >
          <Download className="h-4 w-4" />
          Export {sortedOrders.length} Orders
        </button>

        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
          <input
            type="text"
            placeholder="Search by Order ID, Platform ID, AWB..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-sm"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 text-sm font-medium transition-all hover:bg-muted/40"
        >
          <option value="date">Sort By: Date</option>
          <option value="status">Sort By: Status</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2.5 px-3 py-2 rounded-md border border-border bg-card">
          <Calendar className="h-4 w-4 text-primary/70" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={dateRange.start}
              onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
              className="w-28 px-2.5 py-1.5 rounded-sm border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-muted-foreground/50"
              placeholder="DD/MM/YYYY"
            />
            <span className="text-muted-foreground font-medium">—</span>
            <input
              type="text"
              value={dateRange.end}
              onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
              className="w-28 px-2.5 py-1.5 rounded-sm border border-border/60 bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder-muted-foreground/50"
              placeholder="DD/MM/YYYY"
            />
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Order</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Brand</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Order Type</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Order Total</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Platform ID</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Payment Method</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Order Status</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">AWB</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Refund Status</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Clone Order</th>
              <th className="px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide">Clone Order Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order) => (
              <tr
                key={order.id}
                className="border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors duration-150"
              >
                {/* Order ID + Timestamp */}
                <td className="px-4 py-3">
                  <Link
                    href={`/orders/${order.id.replace('#', '')}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {order.id}
                  </Link>
                  <div className="text-xs text-muted-foreground mt-0.5">{order.timestamp}</div>
                </td>

                {/* Brand */}
                <td className="px-4 py-3 text-foreground">{order.brand}</td>

                {/* Order Type */}
                <td className="px-4 py-3 text-foreground">{order.orderType}</td>

                {/* Order Total */}
                <td className="px-4 py-3 text-foreground font-mono">{formatINR(order.orderTotal)}</td>

                {/* Platform ID */}
                <td className="px-4 py-3 text-foreground">{order.platformId}</td>

                {/* Payment Method */}
                <td className="px-4 py-3 text-foreground">{order.paymentMethod}</td>

                {/* Order Status Badge */}
                <td className="px-4 py-3">
                  <StatusBadge status={getStatusType(order.orderStatus)}>
                    {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
                  </StatusBadge>
                </td>

                {/* AWB + Copy */}
                <td className="px-4 py-3">
                  <div>
                    <div className="flex items-center gap-1">
                      <span className="text-foreground font-mono">{order.awb}</span>
                      {order.awb !== 'NA' && <CopyButton text={order.awb} label="" />}
                    </div>
                    <div className="text-xs text-muted-foreground">Courier: {order.courier}</div>
                  </div>
                </td>

                {/* Refund Status */}
                <td className="px-4 py-3">
                  {order.refundStatus === 'NA' ? (
                    <span className="text-muted-foreground">NA</span>
                  ) : (
                    <StatusBadge status="warning">{order.refundStatus}</StatusBadge>
                  )}
                </td>

                {/* Clone Order */}
                <td className="px-4 py-3">
                  {order.cloneOrderId ? (
                    <div>
                      <Link
                        href={`/orders/${order.cloneOrderId.replace('#', '')}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {order.cloneOrderId}
                      </Link>
                      {order.cloneReason && (
                        <div className="text-xs text-muted-foreground mt-0.5">{order.cloneReason}</div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">NA</span>
                  )}
                </td>

                {/* Clone Order Status */}
                <td className="px-4 py-3">
                  {order.cloneOrderStatus ? (
                    <StatusBadge status="warning">{order.cloneOrderStatus}</StatusBadge>
                  ) : (
                    <span className="text-muted-foreground">NA</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 rounded-lg border border-border bg-card text-sm shadow-sm">
        <div className="text-muted-foreground">
          Showing <span className="font-semibold text-foreground">{paginatedOrders.length}</span> of <span className="font-semibold text-foreground">{sortedOrders.length}</span> orders
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 rounded-lg hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <span className="text-muted-foreground px-2 py-1 rounded">
            <span className="font-semibold text-foreground">{currentPage}</span> / <span className="font-semibold text-foreground">{totalPages}</span>
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 rounded-lg hover:bg-muted/60 disabled:opacity-40 disabled:cursor-not-allowed transition-all duration-200"
            aria-label="Next page"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
