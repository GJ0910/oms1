'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Search, ChevronDown, Calendar, Download, ChevronLeft, ChevronRight, MoreHorizontal } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  REQUEST_TYPES,
  REFUND_STATUSES,
  REATTEMPT_STATUSES,
  UPDATE_STATUSES,
  isRequestOpen,
  generateRequestId,
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
}

// Mock request data
const MOCK_REQUESTS: RequestData[] = [
  // Refund requests
  {
    requestId: '#RFD-050326-0001',
    orderId: '#FTY-030326-0001',
    platformId: 'FY-2301',
    raisedTime: 'March 05, 2026; 10:30',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS User',
    assignedTo: 'Ops User',
    status: REFUND_STATUSES.PENDING,
    remarks: 'Customer requested refund due to product quality issues',
  },
  {
    requestId: '#RFD-050326-0002',
    orderId: '#FTL-020326-0001',
    platformId: 'FY-2302',
    raisedTime: 'March 05, 2026; 11:15',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Admin User',
    assignedTo: 'Ops User',
    status: REFUND_STATUSES.REVIEW,
    remarks: 'Reviewing refund eligibility',
  },
  {
    requestId: '#RFD-040326-0001',
    orderId: '#FTY-280226-0001',
    platformId: 'FY-2304',
    raisedTime: 'March 04, 2026; 14:00',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS User',
    assignedTo: 'Admin User',
    status: REFUND_STATUSES.APPROVAL_PENDING,
    remarks: 'Waiting for manager approval',
  },
  {
    requestId: '#RFD-040326-0002',
    orderId: '#FTL-270226-0001',
    platformId: 'FY-2306',
    raisedTime: 'March 04, 2026; 15:30',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Ops User',
    assignedTo: 'Admin User',
    status: REFUND_STATUSES.ACCEPTED,
    remarks: 'Refund approved, processing started',
  },
  {
    requestId: '#RFD-030326-0001',
    orderId: '#FTY-260226-0001',
    platformId: 'FY-2307',
    raisedTime: 'March 03, 2026; 09:00',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS User',
    assignedTo: 'Ops User',
    status: REFUND_STATUSES.PROCESSING_PENDING,
    remarks: 'Waiting for finance team to process',
  },
  {
    requestId: '#RFD-020326-0001',
    orderId: '#FTL-250226-0001',
    platformId: 'FY-2308',
    raisedTime: 'March 02, 2026; 16:45',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Admin User',
    assignedTo: 'Ops User',
    status: REFUND_STATUSES.PROCESSED,
    remarks: 'Refund completed successfully',
  },
  {
    requestId: '#RFD-010326-0001',
    orderId: '#FTY-240226-0001',
    platformId: 'FY-2309',
    raisedTime: 'March 01, 2026; 11:20',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS User',
    assignedTo: 'Admin User',
    status: REFUND_STATUSES.DEFERRED,
    remarks: 'Refund deferred - customer ineligible',
  },
  // Reattempt requests
  {
    requestId: '#RAT-050326-0001',
    orderId: '#FTL-010326-0001',
    platformId: 'FY-2303',
    raisedTime: 'March 05, 2026; 12:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'CS User',
    assignedTo: 'Ops User',
    status: REATTEMPT_STATUSES.PENDING,
    remarks: 'Customer available tomorrow for delivery',
  },
  {
    requestId: '#RAT-040326-0001',
    orderId: '#FTY-280226-0002',
    platformId: 'FY-2305',
    raisedTime: 'March 04, 2026; 10:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'Ops User',
    assignedTo: 'Ops User',
    status: REATTEMPT_STATUSES.INITIATED,
    remarks: 'Reattempt scheduled for March 06',
  },
  // Update requests
  {
    requestId: '#UPD-050326-0001',
    orderId: '#FTL-040326-0001',
    platformId: '#GARVIT00',
    raisedTime: 'March 05, 2026; 13:45',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'CS User',
    assignedTo: 'Ops User',
    status: UPDATE_STATUSES.PENDING,
    remarks: 'Customer wants to update delivery address',
  },
  {
    requestId: '#UPD-030326-0001',
    orderId: '#FTL-230226-0001',
    platformId: 'FY-2310',
    raisedTime: 'March 03, 2026; 14:30',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'Admin User',
    assignedTo: 'Ops User',
    status: UPDATE_STATUSES.INITIATED,
    remarks: 'Address update sent to courier',
  },
];

// Generate more mock requests
const generateMoreRequests = (): RequestData[] => {
  const requests = [...MOCK_REQUESTS];
  const requestTypes = Object.values(REQUEST_TYPES);
  const refundStatuses = Object.values(REFUND_STATUSES);
  const reattemptStatuses = Object.values(REATTEMPT_STATUSES);
  const updateStatuses = Object.values(UPDATE_STATUSES);
  const users = ['Admin User', 'Ops User', 'CS User'];
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

    requests.push({
      requestId: generateRequestId(requestType, date, i),
      orderId: generateOrderId(brand, orderDate, i),
      platformId: `FY-${String(2300 + i).padStart(4, '0')}`,
      raisedTime: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${hours}:${minutes}`,
      requestType,
      raisedBy: users[(i - 1) % users.length],
      assignedTo: users[(i + 1) % users.length],
      status,
      remarks: `Request ${i} - ${requestType} request details`,
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
  const [searchQuery, setSearchQuery] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '01/03/2026',
    end: '05/03/2026',
  });

  const PAGE_SIZE = 10;

  // Use static mock requests combined with generated ones
  const allRequests = useMemo(() => generateMoreRequests(), []);

  // Filter requests based on open/all and search
  const filteredRequests = useMemo(() => {
    let filtered = allRequests;

    // Filter by open status if needed
    if (showOnlyOpen) {
      filtered = filtered.filter((request) => isRequestOpen(request.requestType, request.status));
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (request) =>
          request.requestId.toLowerCase().includes(query) ||
          request.orderId.toLowerCase().includes(query) ||
          request.platformId.toLowerCase().includes(query) ||
          request.requestType.toLowerCase().includes(query) ||
          request.raisedBy.toLowerCase().includes(query) ||
          request.assignedTo.toLowerCase().includes(query) ||
          request.status.toLowerCase().includes(query)
      );
    }

    return filtered;
  }, [allRequests, showOnlyOpen, searchQuery]);

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

  const handleExport = () => {
    alert(`Export started for ${sortedRequests.length} requests`);
  };

  const getStatusType = (status: RequestStatus): 'success' | 'warning' | 'pending' | 'error' | 'default' => {
    // Terminal/completed statuses
    if (status === REFUND_STATUSES.PROCESSED || status === REATTEMPT_STATUSES.INITIATED || status === UPDATE_STATUSES.INITIATED) {
      return 'success';
    }
    // Deferred/rejected
    if (status === REFUND_STATUSES.DEFERRED) {
      return 'error';
    }
    // Pending/waiting statuses
    if (status === REFUND_STATUSES.PENDING || status === REATTEMPT_STATUSES.PENDING || status === UPDATE_STATUSES.PENDING) {
      return 'warning';
    }
    // In progress
    return 'pending';
  };

  const getRequestTypeBadge = (type: RequestType): 'success' | 'warning' | 'pending' | 'error' | 'default' => {
    switch (type) {
      case REQUEST_TYPES.REFUND:
        return 'error';
      case REQUEST_TYPES.REATTEMPT:
        return 'warning';
      case REQUEST_TYPES.UPDATE:
        return 'pending';
      default:
        return 'default';
    }
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

        {/* Search */}
        <div className="flex-1 relative min-w-0">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search Requests"
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

                {/* Request Type */}
                <td className="px-4 py-3">
                  <StatusBadge status={getRequestTypeBadge(request.requestType)}>
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

                {/* Remarks */}
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
