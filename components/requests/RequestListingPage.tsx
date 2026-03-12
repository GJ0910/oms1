'use client';

import { useState, useMemo, FormEvent } from 'react';
import Link from 'next/link';
import { Search, Calendar, Download, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  REQUEST_TYPES,
  REFUND_STATUSES,
  REATTEMPT_STATUSES,
  UPDATE_STATUSES,
  isRequestOpen,
  generateOrderId,
} from '@/lib/types';
import type { RequestType, RequestStatus } from '@/lib/types';

interface RequestData {
  requestId: string;
  orderId: string;
  platformId: string;
  raisedTime: string;
  requestType: RequestType;
  raisedBy: string;
  assignedTo: string;
  status: RequestStatus;
  remarks: string;
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
}

// Helper function to generate request ID in new format
// #<RequestTypeCode>-<OrderIDWithoutHash>-<RequestCountAgainstThatOrder>
function generateRequestIdNew(type: RequestType, orderId: string, requestCount: number): string {
  const typeCode = type === REQUEST_TYPES.REFUND ? 'REF' : type === REQUEST_TYPES.REATTEMPT ? 'RAT' : 'UPD';
  const orderIdWithoutHash = orderId.replace('#', '');
  const countStr = String(requestCount).padStart(2, '0');
  return `#${typeCode}-${orderIdWithoutHash}-${countStr}`;
}

// Mock request data with new Request ID format and customer data
const MOCK_REQUESTS: RequestData[] = [
  // Refund requests
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-030326-0001', 1),
    orderId: '#FTY-030326-0001',
    platformId: 'FY-2301',
    raisedTime: 'March 05, 2026; 10:30',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: REFUND_STATUSES.PENDING,
    remarks: 'Customer requested refund due to product quality issues',
    customerName: 'John Doe',
    customerEmail: 'john.doe@example.com',
    customerPhone: '9876543210',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTL-020326-0001', 1),
    orderId: '#FTL-020326-0001',
    platformId: 'FY-2302',
    raisedTime: 'March 05, 2026; 11:15',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Admin',
    assignedTo: 'Ops',
    status: REFUND_STATUSES.REVIEW,
    remarks: 'Reviewing refund eligibility',
    customerName: 'Jane Smith',
    customerEmail: 'jane.smith@example.com',
    customerPhone: '9876543211',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-280226-0001', 1),
    orderId: '#FTY-280226-0001',
    platformId: 'FY-2304',
    raisedTime: 'March 04, 2026; 14:00',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Admin',
    status: REFUND_STATUSES.APPROVAL_PENDING,
    remarks: 'Waiting for manager approval',
    customerName: 'Priya Sharma',
    customerEmail: 'priya.sharma@example.com',
    customerPhone: '9876543213',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTL-270226-0001', 1),
    orderId: '#FTL-270226-0001',
    platformId: 'FY-2306',
    raisedTime: 'March 04, 2026; 15:30',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Ops',
    assignedTo: 'Admin',
    status: REFUND_STATUSES.ACCEPTED,
    remarks: 'Refund approved, processing started',
    customerName: 'Neha Gupta',
    customerEmail: 'neha.gupta@example.com',
    customerPhone: '9876543215',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-260226-0001', 1),
    orderId: '#FTY-260226-0001',
    platformId: 'FY-2307',
    raisedTime: 'March 03, 2026; 09:00',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: REFUND_STATUSES.PROCESSING_PENDING,
    remarks: 'Waiting for finance team to process',
    customerName: 'Rahul Singh',
    customerEmail: 'rahul.singh@example.com',
    customerPhone: '9876543216',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTL-250226-0001', 1),
    orderId: '#FTL-250226-0001',
    platformId: 'FY-2308',
    raisedTime: 'March 02, 2026; 16:45',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Admin',
    assignedTo: 'Ops',
    status: REFUND_STATUSES.PROCESSED,
    remarks: 'Refund completed successfully',
    customerName: 'Sneha Kapoor',
    customerEmail: 'sneha.kapoor@example.com',
    customerPhone: '9876543217',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-240226-0001', 1),
    orderId: '#FTY-240226-0001',
    platformId: 'FY-2309',
    raisedTime: 'March 01, 2026; 11:20',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Admin',
    status: REFUND_STATUSES.DEFERRED,
    remarks: 'Refund deferred - customer ineligible',
    customerName: 'Vikram Mehta',
    customerEmail: 'vikram.mehta@example.com',
    customerPhone: '9876543218',
  },
  // Reattempt requests
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REATTEMPT, '#FTL-010326-0001', 1),
    orderId: '#FTL-010326-0001',
    platformId: 'FY-2303',
    raisedTime: 'March 05, 2026; 12:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: REATTEMPT_STATUSES.PENDING,
    remarks: 'Customer available tomorrow for delivery',
    customerName: 'Raj Kumar',
    customerEmail: 'raj.kumar@example.com',
    customerPhone: '9876543212',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REATTEMPT, '#FTY-280226-0002', 1),
    orderId: '#FTY-280226-0002',
    platformId: 'FY-2305',
    raisedTime: 'March 04, 2026; 10:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'Ops',
    assignedTo: 'Ops',
    status: REATTEMPT_STATUSES.INITIATED,
    remarks: 'Reattempt scheduled for March 06',
    customerName: 'Amit Patel',
    customerEmail: 'amit.patel@example.com',
    customerPhone: '9876543214',
  },
  // Update requests
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.UPDATE, '#FTL-040326-0001', 1),
    orderId: '#FTL-040326-0001',
    platformId: '#GARVIT00',
    raisedTime: 'March 05, 2026; 13:45',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: UPDATE_STATUSES.PENDING,
    remarks: 'Customer wants to update delivery address',
    customerName: 'Garvit',
    customerEmail: 'garvit.jaisinghani@fitelo.co',
    customerPhone: '9876500000',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.UPDATE, '#FTL-230226-0001', 1),
    orderId: '#FTL-230226-0001',
    platformId: 'FY-2310',
    raisedTime: 'March 03, 2026; 14:30',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'Admin',
    assignedTo: 'Ops',
    status: UPDATE_STATUSES.INITIATED,
    remarks: 'Address update sent to courier',
    customerName: 'Anita Joshi',
    customerEmail: 'anita.joshi@example.com',
    customerPhone: '9876543219',
  },
];

// Generate more mock requests
const generateMoreRequests = (): RequestData[] => {
  const requests = [...MOCK_REQUESTS];
  const requestTypes = Object.values(REQUEST_TYPES);
  const refundStatuses = Object.values(REFUND_STATUSES);
  const reattemptStatuses = Object.values(REATTEMPT_STATUSES);
  const updateStatuses = Object.values(UPDATE_STATUSES);
  const users = ['Admin', 'Ops', 'CS'];
  const brands = ['Fitty', 'Fitelo'] as const;

  for (let i = 12; i <= 50; i++) {
    const typeIndex = (i - 1) % requestTypes.length;
    const requestType = requestTypes[typeIndex];
    const date = new Date('2026-03-05');
    date.setDate(date.getDate() - Math.floor(i / 5));
    const hours = String((i % 24)).padStart(2, '0');
    const minutes = String((i * 7) % 60).padStart(2, '0');

    let status: RequestStatus;
    if (requestType === REQUEST_TYPES.REFUND) {
      status = refundStatuses[(i - 1) % refundStatuses.length];
    } else if (requestType === REQUEST_TYPES.REATTEMPT) {
      status = reattemptStatuses[(i - 1) % reattemptStatuses.length];
    } else {
      status = updateStatuses[(i - 1) % updateStatuses.length];
    }

    const brand = brands[(i - 1) % brands.length];
    const orderDate = new Date(date);
    orderDate.setDate(orderDate.getDate() - 2);
    const orderId = generateOrderId(brand, orderDate, i);
    const requestCount = ((i - 1) % 3) + 1; // Simulate multiple requests per order

    requests.push({
      requestId: generateRequestIdNew(requestType, orderId, requestCount),
      orderId,
      platformId: `FY-${String(2300 + i).padStart(4, '0')}`,
      raisedTime: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${hours}:${minutes}`,
      requestType,
      raisedBy: users[(i - 1) % users.length],
      assignedTo: users[(i + 1) % users.length],
      status,
      remarks: `Request ${i} - ${requestType} request details`,
      customerName: `Customer ${i}`,
      customerEmail: `customer${i}@example.com`,
      customerPhone: `98765${String(43000 + i).padStart(5, '0')}`,
    });
  }

  return requests;
};

interface RequestListingPageProps {
  showOnlyOpen?: boolean;
}

export function RequestListingPage({ showOnlyOpen = false }: RequestListingPageProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '01/03/2026',
    end: '05/03/2026',
  });

  const PAGE_SIZE = 10;

  // Use static mock requests combined with generated ones
  const allRequests = useMemo(() => generateMoreRequests(), []);

  // Filter requests based on open/all and search (only filters when activeSearch is set)
  const filteredRequests = useMemo(() => {
    let filtered = allRequests;

    // Filter by open status if needed
    if (showOnlyOpen) {
      filtered = filtered.filter((request) => isRequestOpen(request.requestType, request.status));
    }

    // Filter by search query - only when activeSearch is set (after explicit submit)
    if (activeSearch.trim()) {
      const query = activeSearch.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.requestId.toLowerCase().includes(query) ||
          request.orderId.toLowerCase().includes(query) ||
          (request.customerName?.toLowerCase().includes(query)) ||
          (request.customerEmail?.toLowerCase().includes(query)) ||
          (request.customerPhone?.includes(query))
      );
    }

    return filtered;
  }, [allRequests, showOnlyOpen, activeSearch]);

  // Sort requests
  const sortedRequests = useMemo(() => {
    const sorted = [...filteredRequests];
    if (sortBy === 'date') {
      sorted.sort((a, b) => new Date(b.raisedTime).getTime() - new Date(a.raisedTime).getTime());
    }
    return sorted;
  }, [filteredRequests, sortBy]);

  // Pagination
  const totalPages = Math.ceil(sortedRequests.length / PAGE_SIZE);
  const paginatedRequests = sortedRequests.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const handleSearch = (e: FormEvent) => {
    e.preventDefault();
    setActiveSearch(localSearchQuery.trim());
    setCurrentPage(1);
  };

  const handleExport = () => {
    alert(`Export started for ${sortedRequests.length} requests`);
  };

  const getStatusType = (status: RequestStatus): 'success' | 'warning' | 'pending' | 'error' | 'default' => {
    // Deferred should be red
    if (status === REFUND_STATUSES.DEFERRED) {
      return 'error';
    }
    // Terminal/completed statuses
    if (status === REFUND_STATUSES.PROCESSED || status === REATTEMPT_STATUSES.INITIATED || status === UPDATE_STATUSES.INITIATED) {
      return 'success';
    }
    // Pending/waiting statuses
    if (status === REFUND_STATUSES.PENDING || status === REATTEMPT_STATUSES.PENDING || status === UPDATE_STATUSES.PENDING) {
      return 'warning';
    }
    // In progress
    return 'pending';
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-card rounded-lg p-4 border border-border">
        {/* Export Button */}
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export {sortedRequests.length} Requests
        </button>

        {/* Search - explicit submit only */}
        <form onSubmit={handleSearch} className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by name, email, phone, Order ID, Request ID"
            value={localSearchQuery}
            onChange={(e) => setLocalSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
          />
        </form>

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
          <option value="type">Sort By: Type</option>
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
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order ID</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Platform ID</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Request ID</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Raised Time</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Request Type</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Raised By</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Assigned To</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Remarks</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.map((request, index) => (
              <tr
                key={request.requestId}
                className={`border-b border-border last:border-b-0 ${
                  index % 2 === 1 ? 'bg-muted/20' : ''
                } hover:bg-muted/30 transition-colors`}
              >
                {/* Order ID */}
                <td className="px-4 py-3">
                  <Link
                    href={`/orders/${request.orderId.replace('#', '')}`}
                    className="text-primary hover:underline font-medium"
                  >
                    {request.orderId}
                  </Link>
                </td>

                {/* Platform ID */}
                <td className="px-4 py-3 text-foreground">{request.platformId}</td>

                {/* Request ID */}
                <td className="px-4 py-3">
                  <span className="font-mono text-foreground">{request.requestId}</span>
                </td>

                {/* Raised Time */}
                <td className="px-4 py-3 text-foreground text-xs">{request.raisedTime}</td>

                {/* Request Type - neutral badge (default style) */}
                <td className="px-4 py-3">
                  <StatusBadge status="default">
                    {request.requestType}
                  </StatusBadge>
                </td>

                {/* Raised By */}
                <td className="px-4 py-3 text-foreground">{request.raisedBy}</td>

                {/* Assigned To */}
                <td className="px-4 py-3 text-foreground">{request.assignedTo}</td>

                {/* Status */}
                <td className="px-4 py-3">
                  <StatusBadge status={getStatusType(request.status)}>
                    {request.status}
                  </StatusBadge>
                </td>

                {/* Remarks - only show latest remark */}
                <td className="px-4 py-3">
                  <span className="text-muted-foreground text-xs line-clamp-2 max-w-48">
                    {request.remarks}
                  </span>
                </td>

                {/* Action */}
                <td className="px-4 py-3">
                  <button
                    className="p-1.5 rounded hover:bg-muted transition-colors"
                    aria-label="More actions"
                  >
                    <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card text-sm">
        <div className="text-muted-foreground">
          Showing {paginatedRequests.length} of {sortedRequests.length} requests
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
