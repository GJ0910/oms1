'use client';

import { useState, useMemo, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Search, Calendar, Download, ChevronLeft, ChevronRight, ChevronDown, ChevronUp, Eye, EyeOff, Copy, Check, X, MoreVertical } from 'lucide-react';
import { StatusBadge } from '@/components/shared/StatusBadge';
import {
  REQUEST_TYPES,
  REFUND_STATUSES,
  REATTEMPT_STATUSES,
  UPDATE_STATUSES,
  isRequestOpen,
  generateOrderId,
} from '@/lib/types';
import type { RequestType, RequestStatus, RefundStatus, ReattemptStatus, UpdateStatus } from '@/lib/types';
import { getAuthUser, type UserRole } from '@/lib/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from '@/components/ui/dropdown-menu';

// Remark entry type
interface RemarkEntry {
  text: string;
  timestamp: string;
  userName: string;
  role: UserRole;
}

interface RequestData {
  requestId: string;
  orderId: string;
  platformId: string;
  raisedTime: string;
  requestType: RequestType;
  raisedBy: UserRole;
  assignedTo: UserRole;
  status: RequestStatus;
  remarks: RemarkEntry[];
  customerName?: string;
  customerEmail?: string;
  customerPhone?: string;
  refundSourceAccount?: string;
  utrNumber?: string;
  refundedOn?: string;
  processedBy?: string;
}

// Helper function to generate request ID in new format
function generateRequestIdNew(type: RequestType, orderId: string, requestCount: number): string {
  const typeCode = type === REQUEST_TYPES.REFUND ? 'REF' : type === REQUEST_TYPES.REATTEMPT ? 'RAT' : 'UPD';
  const orderIdWithoutHash = orderId.replace('#', '');
  const countStr = String(requestCount).padStart(2, '0');
  return `#${typeCode}-${orderIdWithoutHash}-${countStr}`;
}

// Mock request data with remarks history and proper assignments
const MOCK_REQUESTS: RequestData[] = [
  // Refund requests - assigned to Admin by default
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-030326-0001', 1),
    orderId: '#FTY-030326-0001',
    platformId: 'FY-2301',
    raisedTime: 'March 05, 2026; 10:30',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Admin',
    status: REFUND_STATUSES.PENDING,
    remarks: [
      { text: 'Customer requested refund due to product quality issues', timestamp: 'March 05, 2026 10:30', userName: 'CS', role: 'CS' },
    ],
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
    assignedTo: 'CS',
    status: REFUND_STATUSES.REVIEW,
    remarks: [
      { text: 'Refund request raised', timestamp: 'March 05, 2026 11:15', userName: 'Admin', role: 'Admin' },
      { text: 'Please verify customer bank details', timestamp: 'March 05, 2026 11:30', userName: 'Admin', role: 'Admin' },
    ],
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
    remarks: [
      { text: 'Customer wants full refund', timestamp: 'March 04, 2026 14:00', userName: 'CS', role: 'CS' },
      { text: 'Need to verify order details', timestamp: 'March 04, 2026 14:30', userName: 'Admin', role: 'Admin' },
      { text: 'Customer confirmed bank details', timestamp: 'March 04, 2026 15:00', userName: 'CS', role: 'CS' },
    ],
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
    assignedTo: 'Finance',
    status: REFUND_STATUSES.ACCEPTED,
    remarks: [
      { text: 'Refund approved by Admin', timestamp: 'March 04, 2026 16:00', userName: 'Admin', role: 'Admin' },
    ],
    customerName: 'Neha Gupta',
    customerEmail: 'neha.gupta@example.com',
    customerPhone: '9876543215',
    refundSourceAccount: '1234567890123456',
  },
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTY-260226-0001', 1),
    orderId: '#FTY-260226-0001',
    platformId: 'FY-2307',
    raisedTime: 'March 03, 2026; 09:00',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'CS',
    assignedTo: 'Finance',
    status: REFUND_STATUSES.PROCESSING_PENDING,
    remarks: [
      { text: 'Waiting for finance team to process', timestamp: 'March 03, 2026 09:00', userName: 'CS', role: 'CS' },
      { text: 'Please confirm customer account number', timestamp: 'March 03, 2026 10:00', userName: 'Finance', role: 'Finance' },
    ],
    customerName: 'Rahul Singh',
    customerEmail: 'rahul.singh@example.com',
    customerPhone: '9876543216',
    refundSourceAccount: '9876543210987654',
  },
  // Reattempt requests - assigned to Ops by default
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REATTEMPT, '#FTL-010326-0001', 1),
    orderId: '#FTL-010326-0001',
    platformId: 'FY-2303',
    raisedTime: 'March 05, 2026; 12:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: REATTEMPT_STATUSES.PENDING,
    remarks: [
      { text: 'Customer available tomorrow for delivery', timestamp: 'March 05, 2026 12:00', userName: 'CS', role: 'CS' },
    ],
    customerName: 'Raj Kumar',
    customerEmail: 'raj.kumar@example.com',
    customerPhone: '9876543212',
  },
  // Update requests - assigned to Ops by default
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.UPDATE, '#FTL-040326-0001', 1),
    orderId: '#FTL-040326-0001',
    platformId: '#GARVIT00',
    raisedTime: 'March 05, 2026; 13:45',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'CS',
    assignedTo: 'Ops',
    status: UPDATE_STATUSES.PENDING,
    remarks: [
      { text: 'Customer wants to update delivery address', timestamp: 'March 05, 2026 13:45', userName: 'CS', role: 'CS' },
    ],
    customerName: 'Garvit',
    customerEmail: 'garvit.jaisinghani@fitelo.co',
    customerPhone: '9876500000',
  },
];

// Generate more mock requests
const generateMoreRequests = (): RequestData[] => {
  const requests = [...MOCK_REQUESTS];
  const requestTypes = Object.values(REQUEST_TYPES);
  const refundStatuses = Object.values(REFUND_STATUSES);
  const reattemptStatuses = Object.values(REATTEMPT_STATUSES);
  const updateStatuses = Object.values(UPDATE_STATUSES);
  const users: UserRole[] = ['Admin', 'Ops', 'CS'];
  const brands = ['Fitty', 'Fitelo'] as const;

  for (let i = 12; i <= 50; i++) {
    const typeIndex = (i - 1) % requestTypes.length;
    const requestType = requestTypes[typeIndex];
    const date = new Date('2026-03-05');
    date.setDate(date.getDate() - Math.floor(i / 5));
    const hours = String((i % 24)).padStart(2, '0');
    const minutes = String((i * 7) % 60).padStart(2, '0');

    let status: RequestStatus;
    let assignedTo: UserRole;
    if (requestType === REQUEST_TYPES.REFUND) {
      status = refundStatuses[(i - 1) % refundStatuses.length];
      if (status === REFUND_STATUSES.ACCEPTED || status === REFUND_STATUSES.PROCESSING_PENDING || status === REFUND_STATUSES.PROCESSED) {
        assignedTo = 'Finance';
      } else if (status === REFUND_STATUSES.REVIEW) {
        assignedTo = 'CS';
      } else {
        assignedTo = 'Admin';
      }
    } else if (requestType === REQUEST_TYPES.REATTEMPT) {
      status = reattemptStatuses[(i - 1) % reattemptStatuses.length];
      assignedTo = 'Ops';
    } else {
      status = updateStatuses[(i - 1) % updateStatuses.length];
      assignedTo = 'Ops';
    }

    const brand = brands[(i - 1) % brands.length];
    const orderDate = new Date(date);
    orderDate.setDate(orderDate.getDate() - 2);
    const orderId = generateOrderId(brand, orderDate, i);
    const requestCount = ((i - 1) % 3) + 1;
    const raisedBy = users[(i - 1) % users.length];

    const request: RequestData = {
      requestId: generateRequestIdNew(requestType, orderId, requestCount),
      orderId,
      platformId: `FY-${String(2300 + i).padStart(4, '0')}`,
      raisedTime: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}, ${hours}:${minutes}`,
      requestType,
      raisedBy,
      assignedTo,
      status,
      remarks: [
        { text: `Request ${i} - ${requestType} request details`, timestamp: `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${hours}:${minutes}`, userName: raisedBy, role: raisedBy },
      ],
      customerName: `Customer ${i}`,
      customerEmail: `customer${i}@example.com`,
      customerPhone: `98765${String(43000 + i).padStart(5, '0')}`,
    };

    if (requestType === REQUEST_TYPES.REFUND && status === REFUND_STATUSES.PROCESSED) {
      request.refundSourceAccount = `${String(1234567890 + i * 1000).slice(0, 16)}`;
      request.utrNumber = `UTR${String(100000 + i)}`;
      request.refundedOn = `${date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${hours}:${minutes}`;
      request.processedBy = 'Finance';
    } else if (requestType === REQUEST_TYPES.REFUND && (status === REFUND_STATUSES.ACCEPTED || status === REFUND_STATUSES.PROCESSING_PENDING)) {
      request.refundSourceAccount = `${String(1234567890 + i * 1000).slice(0, 16)}`;
    }

    requests.push(request);
  }

  return requests;
};

// Action definitions with role requirements
interface ActionDefinition {
  id: string;
  label: string;
  validRoles: UserRole[];
  validRequestTypes: RequestType[];
  requiresRemark?: boolean;
  requiresUTR?: boolean;
  requiresAccount?: boolean;
}

const ALL_ACTIONS: ActionDefinition[] = [
  {
    id: 'mark_reattempt_initiated',
    label: 'Mark Reattempt Request Initiated',
    validRoles: ['Ops'],
    validRequestTypes: [REQUEST_TYPES.REATTEMPT],
  },
  {
    id: 'mark_refund_review_before',
    label: 'Mark Refund Request Review (Before Accepted)',
    validRoles: ['Admin'],
    validRequestTypes: [REQUEST_TYPES.REFUND],
    requiresRemark: true,
  },
  {
    id: 'mark_refund_review_after',
    label: 'Mark Refund Request Review (After Accepted)',
    validRoles: ['Finance'],
    validRequestTypes: [REQUEST_TYPES.REFUND],
    requiresRemark: true,
  },
  {
    id: 'mark_refund_accepted',
    label: 'Mark Refund Request Accepted',
    validRoles: ['Finance', 'Admin'],
    validRequestTypes: [REQUEST_TYPES.REFUND],
  },
  {
    id: 'mark_refund_processed',
    label: 'Mark Refund Request Processed',
    validRoles: ['Finance'],
    validRequestTypes: [REQUEST_TYPES.REFUND],
    requiresUTR: true,
    requiresAccount: true,
  },
  {
    id: 'mark_refund_deferred',
    label: 'Mark Refund Request Deferred',
    validRoles: ['Admin', 'Finance'],
    validRequestTypes: [REQUEST_TYPES.REFUND],
  },
  {
    id: 'mark_update_initiated',
    label: 'Mark Update Request Initiated',
    validRoles: ['Ops'],
    validRequestTypes: [REQUEST_TYPES.UPDATE],
  },
];

// Get actions for a request based on type, with enable/disable based on role
function getActionsForRequest(
  requestType: RequestType,
  currentUserRole: UserRole
): { action: ActionDefinition; enabled: boolean }[] {
  return ALL_ACTIONS
    .filter(action => action.validRequestTypes.includes(requestType))
    .map(action => ({
      action,
      enabled: action.validRoles.includes(currentUserRole),
    }));
}

export function MyTasksPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('date');
  const [localSearchQuery, setLocalSearchQuery] = useState('');
  const [activeSearch, setActiveSearch] = useState('');
  const [dateRange, setDateRange] = useState({
    start: '01/03/2026',
    end: '05/03/2026',
  });
  const [currentUser, setCurrentUser] = useState<{ role: UserRole; name: string } | null>(null);
  const [requests, setRequests] = useState<RequestData[]>([]);
  const [expandedRemarks, setExpandedRemarks] = useState<Set<string>>(new Set());
  const [visibleAccounts, setVisibleAccounts] = useState<Set<string>>(new Set());
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  
  // Action modal state
  const [actionModal, setActionModal] = useState<{
    isOpen: boolean;
    request: RequestData | null;
    action: ActionDefinition | null;
  }>({
    isOpen: false,
    request: null,
    action: null,
  });
  const [actionFormData, setActionFormData] = useState({
    remark: '',
    utrNumber: '',
    refundSourceAccount: '',
  });

  const PAGE_SIZE = 10;

  useEffect(() => {
    const user = getAuthUser();
    if (user) {
      setCurrentUser({ role: user.role, name: user.name });
    }
    setRequests(generateMoreRequests());
  }, []);

  // Filter requests: only pending/open requests assigned to the current user
  const filteredRequests = useMemo(() => {
    if (!currentUser) return [];
    
    let filtered = requests.filter((request) => {
      // Only show open requests
      const isOpen = isRequestOpen(request.requestType, request.status);
      // Only show requests assigned to current user
      const isAssignedToMe = request.assignedTo === currentUser.role;
      return isOpen && isAssignedToMe;
    });

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
  }, [requests, currentUser, activeSearch]);

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
    alert(`Export started for ${sortedRequests.length} tasks`);
  };

  const getStatusType = (status: RequestStatus): 'success' | 'warning' | 'pending' | 'error' | 'default' => {
    if (status === REFUND_STATUSES.DEFERRED) {
      return 'error';
    }
    if (status === REFUND_STATUSES.PROCESSED || status === REATTEMPT_STATUSES.INITIATED || status === UPDATE_STATUSES.INITIATED) {
      return 'success';
    }
    if (status === REFUND_STATUSES.PENDING || status === REATTEMPT_STATUSES.PENDING || status === UPDATE_STATUSES.PENDING) {
      return 'warning';
    }
    return 'pending';
  };

  const toggleRemarks = (requestId: string) => {
    setExpandedRemarks(prev => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  };

  const toggleAccountVisibility = (requestId: string) => {
    setVisibleAccounts(prev => {
      const next = new Set(prev);
      if (next.has(requestId)) {
        next.delete(requestId);
      } else {
        next.add(requestId);
      }
      return next;
    });
  };

  const copyAccount = (requestId: string, account: string) => {
    navigator.clipboard.writeText(account);
    setCopiedAccount(requestId);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  const maskAccount = (account: string) => {
    if (account.length <= 4) return account;
    return '*'.repeat(account.length - 4) + account.slice(-4);
  };

  const canViewRefundAccount = currentUser?.role === 'Admin' || currentUser?.role === 'Finance';

  const openActionModal = (request: RequestData, action: ActionDefinition) => {
    setActionModal({
      isOpen: true,
      request,
      action,
    });
    setActionFormData({
      remark: '',
      utrNumber: '',
      refundSourceAccount: request.refundSourceAccount || '',
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      request: null,
      action: null,
    });
    setActionFormData({ remark: '', utrNumber: '', refundSourceAccount: '' });
  };

  const handleActionSubmit = () => {
    if (!actionModal.request || !currentUser || !actionModal.action) return;

    const { request, action } = actionModal;
    const { remark, utrNumber, refundSourceAccount } = actionFormData;

    // Validate required fields
    if (action.requiresRemark && !remark.trim()) {
      alert('Remark is required');
      return;
    }
    if (action.requiresUTR && !utrNumber.trim()) {
      alert('UTR number is required');
      return;
    }
    if (action.requiresAccount && !refundSourceAccount.trim()) {
      alert('Refund Source Account is required');
      return;
    }

    // Process the action
    setRequests(prevRequests => {
      return prevRequests.map(r => {
        if (r.requestId !== request.requestId) return r;

        const now = new Date();
        const timestamp = `${now.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
        const newRemark: RemarkEntry = {
          text: remark.trim() || `Action: ${action.label}`,
          timestamp,
          userName: currentUser.name,
          role: currentUser.role,
        };

        let newStatus = r.status;
        let newAssignedTo = r.assignedTo;
        let updates: Partial<RequestData> = {};

        switch (action.id) {
          case 'mark_reattempt_initiated':
            newStatus = REATTEMPT_STATUSES.INITIATED;
            break;
          case 'mark_refund_review_before':
            newStatus = REFUND_STATUSES.REVIEW;
            newAssignedTo = 'CS';
            break;
          case 'mark_refund_review_after':
            newStatus = REFUND_STATUSES.PROCESSING_PENDING;
            newAssignedTo = 'CS';
            break;
          case 'mark_refund_accepted':
            newStatus = REFUND_STATUSES.ACCEPTED;
            newAssignedTo = 'Finance';
            break;
          case 'mark_refund_processed':
            newStatus = REFUND_STATUSES.PROCESSED;
            updates = {
              utrNumber,
              refundSourceAccount,
              refundedOn: timestamp,
              processedBy: currentUser.name,
            };
            break;
          case 'mark_refund_deferred':
            newStatus = REFUND_STATUSES.DEFERRED;
            break;
          case 'mark_update_initiated':
            newStatus = UPDATE_STATUSES.INITIATED;
            break;
        }

        return {
          ...r,
          status: newStatus,
          assignedTo: newAssignedTo,
          remarks: [...r.remarks, newRemark],
          ...updates,
        };
      });
    });

    closeActionModal();
  };

  return (
    <div className="space-y-6">
      {/* Info banner */}
      <div className="bg-primary/10 border border-primary/20 rounded-lg p-4">
        <p className="text-sm text-foreground">
          Showing pending tasks assigned to you ({currentUser?.role}). Complete these tasks to move requests forward.
        </p>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-card rounded-lg p-4 border border-border">
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export {sortedRequests.length} Tasks
        </button>

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
              {canViewRefundAccount && (
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Refund Account</th>
              )}
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Remarks</th>
              <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Action</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRequests.length === 0 ? (
              <tr>
                <td colSpan={canViewRefundAccount ? 11 : 10} className="px-4 py-12 text-center text-muted-foreground">
                  No pending tasks assigned to you.
                </td>
              </tr>
            ) : (
              paginatedRequests.map((request, index) => {
                const actionsWithState = currentUser
                  ? getActionsForRequest(request.requestType, currentUser.role)
                  : [];
                const latestRemark = request.remarks[request.remarks.length - 1];
                const isExpanded = expandedRemarks.has(request.requestId);
                const isAccountVisible = visibleAccounts.has(request.requestId);
                const showRefundAccount = request.requestType === REQUEST_TYPES.REFUND && canViewRefundAccount;

                return (
                  <tr
                    key={request.requestId}
                    className={`border-b border-border last:border-b-0 ${
                      index % 2 === 1 ? 'bg-muted/20' : ''
                    } hover:bg-muted/30 transition-colors`}
                  >
                    <td className="px-4 py-3">
                      <Link
                        href={`/orders/${request.orderId.replace('#', '')}`}
                        className="text-primary hover:underline font-medium"
                      >
                        {request.orderId}
                      </Link>
                    </td>
                    <td className="px-4 py-3 text-foreground">{request.platformId}</td>
                    <td className="px-4 py-3">
                      <span className="font-mono text-foreground">{request.requestId}</span>
                    </td>
                    <td className="px-4 py-3 text-foreground text-xs">{request.raisedTime}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status="default">{request.requestType}</StatusBadge>
                    </td>
                    <td className="px-4 py-3 text-foreground">{request.raisedBy}</td>
                    <td className="px-4 py-3 text-foreground">{request.assignedTo}</td>
                    <td className="px-4 py-3">
                      <StatusBadge status={getStatusType(request.status)}>{request.status}</StatusBadge>
                    </td>

                    {/* Refund Source Account column - visible only to Admin/Finance */}
                    {canViewRefundAccount && (
                      <td className="px-4 py-3">
                        {showRefundAccount && request.refundSourceAccount ? (
                          <div className="flex items-center gap-1">
                            <span className="font-mono text-xs text-foreground">
                              {isAccountVisible ? request.refundSourceAccount : maskAccount(request.refundSourceAccount)}
                            </span>
                            <button
                              onClick={() => toggleAccountVisibility(request.requestId)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              title={isAccountVisible ? 'Hide account' : 'Show account'}
                            >
                              {isAccountVisible ? (
                                <EyeOff className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <Eye className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                            <button
                              onClick={() => copyAccount(request.requestId, request.refundSourceAccount!)}
                              className="p-1 hover:bg-muted rounded transition-colors"
                              title="Copy account"
                            >
                              {copiedAccount === request.requestId ? (
                                <Check className="h-3.5 w-3.5 text-green-500" />
                              ) : (
                                <Copy className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                          </div>
                        ) : (
                          <span className="text-muted-foreground text-xs">NA</span>
                        )}
                      </td>
                    )}

                    {/* Remarks with expandable history */}
                    <td className="px-4 py-3">
                      <div className="max-w-56">
                        <div className="flex items-start gap-1">
                          <div className="flex-1">
                            <p className="text-xs text-foreground line-clamp-2">{latestRemark?.text || 'No remarks'}</p>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {latestRemark?.userName} - {latestRemark?.timestamp}
                            </p>
                          </div>
                          {request.remarks.length > 1 && (
                            <button
                              onClick={() => toggleRemarks(request.requestId)}
                              className="p-1 hover:bg-muted rounded transition-colors flex-shrink-0"
                              title={isExpanded ? 'Hide history' : 'Show history'}
                            >
                              {isExpanded ? (
                                <ChevronUp className="h-3.5 w-3.5 text-muted-foreground" />
                              ) : (
                                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                              )}
                            </button>
                          )}
                        </div>
                        {isExpanded && request.remarks.length > 1 && (
                          <div className="mt-2 space-y-2 border-t border-border pt-2">
                            {request.remarks.slice(0, -1).reverse().map((remarkItem, idx) => (
                              <div key={idx} className="text-xs">
                                <p className="text-foreground">{remarkItem.text}</p>
                                <p className="text-muted-foreground">{remarkItem.userName} - {remarkItem.timestamp}</p>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Action menu - vertical three dots with dropdown */}
                    <td className="px-4 py-3">
                      {actionsWithState.length > 0 ? (
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <button
                              className="p-1.5 rounded hover:bg-muted transition-colors"
                              aria-label="More actions"
                            >
                              <MoreVertical className="h-4 w-4 text-muted-foreground" />
                            </button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-72">
                            <DropdownMenuLabel className="text-xs text-muted-foreground">
                              Actions for {request.requestType}
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {actionsWithState.map(({ action, enabled }) => (
                              <DropdownMenuItem
                                key={action.id}
                                disabled={!enabled}
                                onClick={() => enabled && openActionModal(request, action)}
                                className="text-sm"
                              >
                                {action.label}
                                {!enabled && (
                                  <span className="ml-auto text-xs text-muted-foreground">
                                    ({action.validRoles.join('/')})
                                  </span>
                                )}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      ) : (
                        <span className="text-muted-foreground text-xs">-</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex items-center justify-between px-4 py-3 rounded-lg border border-border bg-card text-sm">
        <div className="text-muted-foreground">
          Showing {paginatedRequests.length} of {sortedRequests.length} tasks
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
            {currentPage} of {totalPages || 1}
          </span>
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages || totalPages === 0}
            className="p-1 rounded hover:bg-muted disabled:opacity-50 transition-colors"
            aria-label="Next page"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.request && actionModal.action && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{actionModal.action.label}</h3>
              <button
                onClick={closeActionModal}
                className="p-1 hover:bg-muted rounded transition-colors"
              >
                <X className="h-5 w-5 text-muted-foreground" />
              </button>
            </div>
            <div className="p-4 space-y-4">
              <div className="text-sm text-muted-foreground">
                Request: <span className="text-foreground font-mono">{actionModal.request.requestId}</span>
              </div>

              {actionModal.action.requiresRemark && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Remark <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={actionFormData.remark}
                    onChange={(e) => setActionFormData({ ...actionFormData, remark: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                    rows={3}
                    placeholder="Enter remark..."
                  />
                </div>
              )}

              {actionModal.action.requiresAccount && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Refund Source Account <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={actionFormData.refundSourceAccount}
                    onChange={(e) => setActionFormData({ ...actionFormData, refundSourceAccount: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter account number..."
                  />
                </div>
              )}

              {actionModal.action.requiresUTR && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    UTR Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={actionFormData.utrNumber}
                    onChange={(e) => setActionFormData({ ...actionFormData, utrNumber: e.target.value })}
                    className="w-full px-3 py-2 rounded-md border border-border bg-background text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="Enter UTR number..."
                  />
                </div>
              )}
            </div>
            <div className="flex justify-end gap-2 px-4 py-3 border-t border-border">
              <button
                onClick={closeActionModal}
                className="px-4 py-2 rounded-md border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                className="btn-primary"
              >
                Confirm
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
