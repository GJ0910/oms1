'use client';

import { useState, useMemo, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import { Search, Calendar, Download, ChevronLeft, ChevronRight, MoreHorizontal, ChevronDown, ChevronUp, Eye, EyeOff, Copy, Check, X } from 'lucide-react';
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
  // Refund-specific fields
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

// Default assignment rules
function getDefaultAssignment(type: RequestType): UserRole {
  switch (type) {
    case REQUEST_TYPES.REFUND:
      return 'Admin';
    case REQUEST_TYPES.REATTEMPT:
    case REQUEST_TYPES.UPDATE:
      return 'Ops';
    default:
      return 'Ops';
  }
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
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REFUND, '#FTL-250226-0001', 1),
    orderId: '#FTL-250226-0001',
    platformId: 'FY-2308',
    raisedTime: 'March 02, 2026; 16:45',
    requestType: REQUEST_TYPES.REFUND,
    raisedBy: 'Admin',
    assignedTo: 'Finance',
    status: REFUND_STATUSES.PROCESSED,
    remarks: [
      { text: 'Refund completed successfully', timestamp: 'March 02, 2026 17:00', userName: 'Finance', role: 'Finance' },
    ],
    customerName: 'Sneha Kapoor',
    customerEmail: 'sneha.kapoor@example.com',
    customerPhone: '9876543217',
    refundSourceAccount: '5678901234567890',
    utrNumber: 'UTR123456789',
    refundedOn: 'March 02, 2026 17:00',
    processedBy: 'Finance',
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
    remarks: [
      { text: 'Refund deferred - customer ineligible', timestamp: 'March 01, 2026 12:00', userName: 'Admin', role: 'Admin' },
    ],
    customerName: 'Vikram Mehta',
    customerEmail: 'vikram.mehta@example.com',
    customerPhone: '9876543218',
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
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.REATTEMPT, '#FTY-280226-0002', 1),
    orderId: '#FTY-280226-0002',
    platformId: 'FY-2305',
    raisedTime: 'March 04, 2026; 10:00',
    requestType: REQUEST_TYPES.REATTEMPT,
    raisedBy: 'Ops',
    assignedTo: 'Ops',
    status: REATTEMPT_STATUSES.INITIATED,
    remarks: [
      { text: 'Reattempt scheduled for March 06', timestamp: 'March 04, 2026 10:30', userName: 'Ops', role: 'Ops' },
    ],
    customerName: 'Amit Patel',
    customerEmail: 'amit.patel@example.com',
    customerPhone: '9876543214',
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
  {
    requestId: generateRequestIdNew(REQUEST_TYPES.UPDATE, '#FTL-230226-0001', 1),
    orderId: '#FTL-230226-0001',
    platformId: 'FY-2310',
    raisedTime: 'March 03, 2026; 14:30',
    requestType: REQUEST_TYPES.UPDATE,
    raisedBy: 'Admin',
    assignedTo: 'Ops',
    status: UPDATE_STATUSES.INITIATED,
    remarks: [
      { text: 'Address update sent to courier', timestamp: 'March 03, 2026 15:00', userName: 'Ops', role: 'Ops' },
    ],
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
      // Assign based on status for refunds
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

    // Add refund-specific fields for processed refunds
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

// Workflow: Get available actions based on request type, status, and user role
function getAvailableActions(
  requestType: RequestType,
  status: RequestStatus,
  assignedTo: UserRole,
  currentUserRole: UserRole
): { action: string; label: string; requiresRemark?: boolean; requiresUTR?: boolean; requiresAccount?: boolean }[] {
  const actions: { action: string; label: string; requiresRemark?: boolean; requiresUTR?: boolean; requiresAccount?: boolean }[] = [];

  // User must be assigned to take action (except CS can always add remarks when assigned)
  const isAssigned = assignedTo === currentUserRole;

  if (requestType === REQUEST_TYPES.REATTEMPT) {
    // Reattempt workflow: Pending -> Initiated (Ops only)
    if (status === REATTEMPT_STATUSES.PENDING && currentUserRole === 'Ops' && isAssigned) {
      actions.push({ action: 'initiate', label: 'Mark Initiated' });
    }
  } else if (requestType === REQUEST_TYPES.UPDATE) {
    // Update workflow: Pending -> Initiated (Ops only)
    if (status === UPDATE_STATUSES.PENDING && currentUserRole === 'Ops' && isAssigned) {
      actions.push({ action: 'initiate', label: 'Mark Initiated' });
    }
  } else if (requestType === REQUEST_TYPES.REFUND) {
    // Refund workflow
    if (status === REFUND_STATUSES.PENDING && currentUserRole === 'Admin' && isAssigned) {
      actions.push({ action: 'review', label: 'Send to Review', requiresRemark: true });
      actions.push({ action: 'accept', label: 'Accept' });
      actions.push({ action: 'defer', label: 'Defer' });
    } else if (status === REFUND_STATUSES.REVIEW && currentUserRole === 'CS' && isAssigned) {
      // CS can only add remark, which moves it back to Admin
      actions.push({ action: 'add_remark_cs_review', label: 'Add Remark & Submit', requiresRemark: true });
    } else if (status === REFUND_STATUSES.APPROVAL_PENDING && currentUserRole === 'Admin' && isAssigned) {
      actions.push({ action: 'review', label: 'Send to Review', requiresRemark: true });
      actions.push({ action: 'accept', label: 'Accept' });
      actions.push({ action: 'defer', label: 'Defer' });
    } else if (status === REFUND_STATUSES.ACCEPTED && currentUserRole === 'Finance' && isAssigned) {
      actions.push({ action: 'finance_review', label: 'Send to Review', requiresRemark: true });
      actions.push({ action: 'process', label: 'Mark Processed', requiresUTR: true, requiresAccount: true });
    } else if (status === REFUND_STATUSES.PROCESSING_PENDING && currentUserRole === 'CS' && isAssigned) {
      // CS can only add remark, which moves it back to Finance
      actions.push({ action: 'add_remark_cs_processing', label: 'Add Remark & Submit', requiresRemark: true });
    } else if (status === REFUND_STATUSES.PROCESSING_PENDING && currentUserRole === 'Finance' && isAssigned) {
      actions.push({ action: 'finance_review', label: 'Send to Review', requiresRemark: true });
      actions.push({ action: 'process', label: 'Mark Processed', requiresUTR: true, requiresAccount: true });
    }
  }

  // Add generic "Add Remark" if assigned and has actions
  if (isAssigned && actions.length > 0 && !actions.some(a => a.requiresRemark)) {
    actions.push({ action: 'add_remark', label: 'Add Remark', requiresRemark: true });
  }

  return actions;
}

interface RequestListingPageProps {
  showOnlyOpen?: boolean;
  showAssignedToCurrentUserOnly?: boolean;
}

export function RequestListingPage({ showOnlyOpen = false, showAssignedToCurrentUserOnly = false }: RequestListingPageProps) {
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
    action: string;
    label: string;
    requiresRemark: boolean;
    requiresUTR: boolean;
    requiresAccount: boolean;
  }>({
    isOpen: false,
    request: null,
    action: '',
    label: '',
    requiresRemark: false,
    requiresUTR: false,
    requiresAccount: false,
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

  // Filter requests based on open/all and search
  const filteredRequests = useMemo(() => {
    let filtered = requests;

    if (showOnlyOpen) {
      filtered = filtered.filter((request) => isRequestOpen(request.requestType, request.status));
    }

    if (showAssignedToCurrentUserOnly && currentUser) {
      filtered = filtered.filter((request) => request.assignedTo === currentUser.role);
    }

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
  }, [requests, showOnlyOpen, showAssignedToCurrentUserOnly, currentUser, activeSearch]);

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

  const openActionModal = (
    request: RequestData,
    action: string,
    label: string,
    requiresRemark: boolean = false,
    requiresUTR: boolean = false,
    requiresAccount: boolean = false
  ) => {
    setActionModal({
      isOpen: true,
      request,
      action,
      label,
      requiresRemark,
      requiresUTR,
      requiresAccount,
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
      action: '',
      label: '',
      requiresRemark: false,
      requiresUTR: false,
      requiresAccount: false,
    });
    setActionFormData({ remark: '', utrNumber: '', refundSourceAccount: '' });
  };

  const handleActionSubmit = () => {
    if (!actionModal.request || !currentUser) return;

    const { request, action, requiresRemark, requiresUTR, requiresAccount } = actionModal;
    const { remark, utrNumber, refundSourceAccount } = actionFormData;

    // Validate required fields
    if (requiresRemark && !remark.trim()) {
      alert('Remark is required');
      return;
    }
    if (requiresUTR && !utrNumber.trim()) {
      alert('UTR number is required');
      return;
    }
    if (requiresAccount && !refundSourceAccount.trim()) {
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
          text: remark.trim() || `Status changed to ${getNewStatus(action)}`,
          timestamp,
          userName: currentUser.name,
          role: currentUser.role,
        };

        let newStatus = r.status;
        let newAssignedTo = r.assignedTo;
        let updates: Partial<RequestData> = {};

        switch (action) {
          case 'initiate':
            newStatus = r.requestType === REQUEST_TYPES.REATTEMPT ? REATTEMPT_STATUSES.INITIATED : UPDATE_STATUSES.INITIATED;
            break;
          case 'review':
            newStatus = REFUND_STATUSES.REVIEW;
            newAssignedTo = 'CS';
            break;
          case 'accept':
            newStatus = REFUND_STATUSES.ACCEPTED;
            newAssignedTo = 'Finance';
            break;
          case 'defer':
            newStatus = REFUND_STATUSES.DEFERRED;
            break;
          case 'add_remark_cs_review':
            newStatus = REFUND_STATUSES.APPROVAL_PENDING;
            newAssignedTo = 'Admin';
            break;
          case 'finance_review':
            newStatus = REFUND_STATUSES.PROCESSING_PENDING;
            newAssignedTo = 'CS';
            break;
          case 'add_remark_cs_processing':
            // Status remains PROCESSING_PENDING, assigned back to Finance
            newAssignedTo = 'Finance';
            break;
          case 'process':
            newStatus = REFUND_STATUSES.PROCESSED;
            updates = {
              utrNumber,
              refundSourceAccount,
              refundedOn: timestamp,
              processedBy: currentUser.name,
            };
            break;
          case 'add_remark':
            // Just add remark, no status change
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

  const getNewStatus = (action: string): string => {
    switch (action) {
      case 'initiate': return 'Initiated';
      case 'review': return 'Review';
      case 'accept': return 'Accepted';
      case 'defer': return 'Deferred';
      case 'add_remark_cs_review': return 'Approval Pending';
      case 'finance_review': return 'Processing Pending';
      case 'process': return 'Processed';
      default: return '';
    }
  };

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 items-start sm:items-center bg-card rounded-lg p-4 border border-border">
        <button
          onClick={handleExport}
          className="btn-primary flex items-center gap-2 whitespace-nowrap"
        >
          <Download className="h-4 w-4" />
          Export {sortedRequests.length} Requests
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
            {paginatedRequests.map((request, index) => {
              const availableActions = currentUser
                ? getAvailableActions(request.requestType, request.status, request.assignedTo, currentUser.role)
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
                          {request.remarks.slice(0, -1).reverse().map((remark, idx) => (
                            <div key={idx} className="text-xs">
                              <p className="text-foreground">{remark.text}</p>
                              <p className="text-muted-foreground">{remark.userName} - {remark.timestamp}</p>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </td>

                  {/* Action menu */}
                  <td className="px-4 py-3">
                    {availableActions.length > 0 ? (
                      <div className="relative group">
                        <button
                          className="p-1.5 rounded hover:bg-muted transition-colors"
                          aria-label="More actions"
                        >
                          <MoreHorizontal className="h-4 w-4 text-muted-foreground" />
                        </button>
                        <div className="absolute right-0 top-full mt-1 w-48 bg-card border border-border rounded-md shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                          {availableActions.map((actionItem) => (
                            <button
                              key={actionItem.action}
                              onClick={() =>
                                openActionModal(
                                  request,
                                  actionItem.action,
                                  actionItem.label,
                                  actionItem.requiresRemark,
                                  actionItem.requiresUTR,
                                  actionItem.requiresAccount
                                )
                              }
                              className="w-full px-3 py-2 text-left text-sm text-foreground hover:bg-muted transition-colors first:rounded-t-md last:rounded-b-md"
                            >
                              {actionItem.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      <span className="text-muted-foreground text-xs">-</span>
                    )}
                  </td>
                </tr>
              );
            })}
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

      {/* Action Modal */}
      {actionModal.isOpen && actionModal.request && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card border border-border rounded-lg shadow-xl w-full max-w-md mx-4">
            <div className="flex items-center justify-between px-4 py-3 border-b border-border">
              <h3 className="text-lg font-semibold text-foreground">{actionModal.label}</h3>
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

              {(actionModal.requiresRemark || actionModal.action === 'add_remark') && (
                <div>
                  <label className="block text-sm font-medium text-foreground mb-1">
                    Remark {actionModal.requiresRemark && <span className="text-red-500">*</span>}
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

              {actionModal.requiresAccount && (
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

              {actionModal.requiresUTR && (
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
            <div className="flex items-center justify-end gap-2 px-4 py-3 border-t border-border">
              <button
                onClick={closeActionModal}
                className="px-4 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleActionSubmit}
                className="btn-primary"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
