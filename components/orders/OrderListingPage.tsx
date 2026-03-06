'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Calendar, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';

interface OrderData {
  id: string;
  timestamp: string;
  brand: string;
  orderType: string;
  orderTotal: number;
  shopifyId: string;
  paymentMethod: string;
  orderStatus: 'delivered' | 'placed' | 'processing' | 'shipped' | 'cancelled' | 'confirmed';
  awb: string;
  courier: string;
  refundStatus: string;
  cloneOrderId?: string;
  cloneReason?: string;
  cloneOrderStatus?: string;
}

// Static mock data - 100 orders for demo
const MOCK_ORDERS: OrderData[] = [
  { id: '#FT000001-001', timestamp: 'March 03, 2026; 12:36', brand: 'Fitty', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2301', paymentMethod: 'COD', orderStatus: 'delivered', awb: '123456789012', courier: 'DHL Express', refundStatus: 'NA' },
  { id: '#FT000002-001', timestamp: 'March 02, 2026; 12:36', brand: 'Fitelo', orderType: 'Clone (System)', orderTotal: 3499.6, shopifyId: 'FY-2302', paymentMethod: 'Prepaid', orderStatus: 'placed', awb: '123456789013', courier: 'Shiprocket', refundStatus: 'NA', cloneOrderId: '#FTL-000002-001', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: 'Placed' },
  { id: '#FT000003-001', timestamp: 'March 01, 2026; 12:36', brand: 'Fitelo', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2303', paymentMethod: 'Prepaid', orderStatus: 'processing', awb: '123456789014', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-000003-001', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: 'Placed' },
  { id: '#FT000004-001', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2304', paymentMethod: 'Prepaid', orderStatus: 'cancelled', awb: '123456789015', courier: 'FedEx', refundStatus: 'Requested' },
  { id: '#FT000005-001', timestamp: 'February 28, 2026; 12:36', brand: 'Fitty', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2305', paymentMethod: 'Partial COD', orderStatus: 'confirmed', awb: 'NA', courier: 'DHL Express', refundStatus: 'NA' },
  { id: '#FT000006-001', timestamp: 'February 27, 2026; 08:15', brand: 'Fitelo', orderType: 'Clone (Manual)', orderTotal: 3499.6, shopifyId: 'FY-2306', paymentMethod: 'COD', orderStatus: 'delivered', awb: '123456789016', courier: 'Shiprocket', refundStatus: 'NA' },
  { id: '#FT000007-001', timestamp: 'February 26, 2026; 14:22', brand: 'Fitty', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2307', paymentMethod: 'Prepaid', orderStatus: 'shipped', awb: '123456789017', courier: 'BlueDart', refundStatus: 'NA', cloneOrderId: '#FTL-000007-001', cloneReason: 'Reason: Pincode Change', cloneOrderStatus: 'Placed' },
  { id: '#FT000008-001', timestamp: 'February 25, 2026; 10:45', brand: 'Fitelo', orderType: 'Medusa', orderTotal: 3499.6, shopifyId: 'FY-2308', paymentMethod: 'COD', orderStatus: 'placed', awb: '123456789018', courier: 'FedEx', refundStatus: 'NA' },
  { id: '#FT000009-001', timestamp: 'February 24, 2026; 16:30', brand: 'Fitty', orderType: 'Shopify', orderTotal: 3499.6, shopifyId: 'FY-2309', paymentMethod: 'Partial COD', orderStatus: 'processing', awb: '123456789019', courier: 'DHL Express', refundStatus: 'Requested' },
  { id: '#FT000010-001', timestamp: 'February 23, 2026; 09:18', brand: 'Fitelo', orderType: 'Clone (System)', orderTotal: 3499.6, shopifyId: 'FY-2310', paymentMethod: 'Prepaid', orderStatus: 'delivered', awb: '123456789020', courier: 'Shiprocket', refundStatus: 'NA' },
];

// Generate remaining 90 orders with static pattern
const generateRemainingOrders = (): OrderData[] => {
  const orders = [...MOCK_ORDERS];
  const statuses: Array<'delivered' | 'placed' | 'processing' | 'shipped' | 'cancelled' | 'confirmed'> = [
    'delivered', 'placed', 'processing', 'shipped', 'cancelled', 'confirmed'
  ];
  const brands = ['Fitty', 'Fitelo'];
  const orderTypes = ['Shopify', 'Clone (System)', 'Clone (Manual)', 'Medusa'];
  const paymentMethods = ['COD', 'Prepaid', 'Partial COD'];
  const couriers = ['DHL Express', 'Shiprocket', 'BlueDart', 'FedEx'];

  for (let i = 11; i <= 100; i++) {
    const dayOffset = Math.floor((i - 1) / 3);
    const statusIndex = (i - 1) % statuses.length;
    const brandIndex = (i - 1) % brands.length;
    const typeIndex = (i - 1) % orderTypes.length;
    const paymentIndex = (i - 1) % paymentMethods.length;
    const courierIndex = (i - 1) % couriers.length;

    const date = new Date('2026-03-03');
    date.setDate(date.getDate() - dayOffset);
    const hours = String((i % 24)).padStart(2, '0');
    const minutes = String((i * 7) % 60).padStart(2, '0');

    orders.push({
      id: `#FT${String(i).padStart(6, '0')}-001`,
      timestamp: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${hours}:${minutes}`,
      brand: brands[brandIndex],
      orderType: orderTypes[typeIndex],
      orderTotal: 3499.6,
      shopifyId: `FY-${String(2300 + i).padStart(4, '0')}`,
      paymentMethod: paymentMethods[paymentIndex],
      orderStatus: statuses[statusIndex],
      awb: statusIndex !== 4 ? String(123456789000 + i).substring(0, 12) : 'NA',
      courier: couriers[courierIndex],
      refundStatus: statusIndex === 3 || statusIndex === 4 ? 'Requested' : 'NA',
      ...(typeIndex > 0 && { cloneOrderId: `#FTL-${String(i).padStart(6, '0')}-001`, cloneReason: 'Reason: Pincode Change', cloneOrderStatus: 'Placed' }),
    });
  }
  return orders;
};

export function OrderListingPage() {
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

  // Filter orders based on search
  const filteredOrders = useMemo(() => {
    return allOrders.filter(order =>
      order.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.shopifyId.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allOrders, searchQuery]);

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

  const getStatusType = (status: string) => {
    const statusMap: Record<string, 'success' | 'warning' | 'pending' | 'error' | 'default'> = {
      delivered: 'success',
      placed: 'warning',
      processing: 'pending',
      shipped: 'pending',
      cancelled: 'error',
      confirmed: 'warning',
    };
    return statusMap[status.toLowerCase()] || 'default';
  };

  const formatINR = (value: number) => {
    return `₹${value.toLocaleString('en-IN')}`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Listing</h1>
        </div>
        <div className="text-right text-sm">
          <div className="text-muted-foreground">Email:</div>
          <div className="text-foreground font-medium">Role:</div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-card rounded-lg p-4 border border-border">
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export {sortedOrders.length} Orders
        </button>

        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Orders"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </div>

        {/* Sort Dropdown */}
        <select
          value={sortBy}
          onChange={(e) => {
            setSortBy(e.target.value);
            setCurrentPage(1);
          }}
          className="px-4 py-2 rounded-md border border-border bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-primary text-sm"
        >
          <option value="date">Sort By: Date</option>
          <option value="status">Sort By: Status</option>
        </select>

        {/* Date Range */}
        <div className="flex items-center gap-2 text-sm">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            value={dateRange.start}
            onChange={(e) => setDateRange({ ...dateRange, start: e.target.value })}
            className="w-24 px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="DD/MM/YYYY"
          />
          <span className="text-muted-foreground">-</span>
          <input
            type="text"
            value={dateRange.end}
            onChange={(e) => setDateRange({ ...dateRange, end: e.target.value })}
            className="w-24 px-2 py-1 rounded border border-border bg-background text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            placeholder="DD/MM/YYYY"
          />
        </div>
      </div>

      {/* Table */}
      <div className="rounded-lg border border-border bg-card overflow-x-auto shadow-sm">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/50">
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Brand</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order Type</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order Total</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Shopify ID</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Payment Method</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order Status</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">AWB</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Refund Status</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Clone Order</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Clone Order Status</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.map((order, index) => (
              <tr
                key={order.id}
                className={`border-b border-border last:border-b-0 ${
                  index % 2 === 1 ? 'bg-muted/20' : ''
                } hover:bg-muted/30 transition-colors`}
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

                {/* Shopify ID */}
                <td className="px-4 py-3 text-foreground">{order.shopifyId}</td>

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
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="text-foreground font-mono">{order.awb}</div>
                      <div className="text-xs text-muted-foreground">Courier: {order.courier}</div>
                    </div>
                    <CopyButton text={order.awb} label="" />
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
      <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card text-sm">
        <div className="text-muted-foreground">
          Showing {paginatedOrders.length} of {sortedOrders.length} orders
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
            aria-label="Previous page"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <span className="text-muted-foreground">
            {currentPage} of {totalPages}
          </span>

          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
