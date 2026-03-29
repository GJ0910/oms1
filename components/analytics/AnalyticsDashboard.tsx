'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { ChartContainer, ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Popover, PopoverTrigger, PopoverContent } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Calendar as DateRangeCalendar } from '@/components/ui/calendar';
import { Calendar as CalendarIcon, Info } from 'lucide-react';

// Mock chart data
const chartDataOrders = [
  { date: 'Feb 16', value: 150 },
  { date: 'Feb 17', value: 170 },
  { date: 'Feb 18', value: 145 },
  { date: 'Feb 19', value: 180 },
  { date: 'Feb 20', value: 165 },
  { date: 'Feb 21', value: 190 },
  { date: 'Feb 22', value: 175 },
  { date: 'Feb 23', value: 195 },
  { date: 'Feb 24', value: 185 },
  { date: 'Feb 25', value: 210 },
  { date: 'Feb 26', value: 200 },
  { date: 'Feb 27', value: 190 },
  { date: 'Feb 28', value: 215 },
  { date: 'Feb 29', value: 220 },
  { date: 'Mar 01', value: 205 },
  { date: 'Mar 02', value: 190 },
  { date: 'Mar 03', value: 195 },
];

const chartDataLogistics = [
  { date: 'Feb 16', value: 120 },
  { date: 'Feb 17', value: 135 },
  { date: 'Feb 18', value: 115 },
  { date: 'Feb 19', value: 155 },
  { date: 'Feb 20', value: 140 },
  { date: 'Feb 21', value: 165 },
  { date: 'Feb 22', value: 150 },
  { date: 'Feb 23', value: 170 },
  { date: 'Feb 24', value: 160 },
  { date: 'Feb 25', value: 185 },
  { date: 'Feb 26', value: 175 },
  { date: 'Feb 27', value: 165 },
  { date: 'Feb 28', value: 190 },
  { date: 'Feb 29', value: 195 },
  { date: 'Mar 01', value: 180 },
  { date: 'Mar 02', value: 165 },
  { date: 'Mar 03', value: 170 },
];

const chartDataFinance = [
  { date: 'Feb 16', value: 45 },
  { date: 'Feb 17', value: 52 },
  { date: 'Feb 18', value: 38 },
  { date: 'Feb 19', value: 61 },
  { date: 'Feb 20', value: 55 },
  { date: 'Feb 21', value: 72 },
  { date: 'Feb 22', value: 65 },
  { date: 'Feb 23', value: 80 },
  { date: 'Feb 24', value: 70 },
  { date: 'Feb 25', value: 89 },
  { date: 'Feb 26', value: 78 },
  { date: 'Feb 27', value: 68 },
  { date: 'Feb 28', value: 92 },
  { date: 'Feb 29', value: 98 },
  { date: 'Mar 01', value: 85 },
  { date: 'Mar 02', value: 72 },
  { date: 'Mar 03', value: 76 },
];

// Chart configs
const chartConfigOrders: ChartConfig = {
  value: {
    label: 'Total Orders',
    color: '#3b82f6',
  },
};

const chartConfigLogistics: ChartConfig = {
  value: {
    label: 'Orders Delivered',
    color: '#10b981',
  },
};

const chartConfigFinance: ChartConfig = {
  value: {
    label: 'Refund Requests',
    color: '#ef4444',
  },
};

// Format helpers
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 0,
  }).format(value);
};

const formatNumber = (value: number) => {
  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value);
};

// Mock orders used for dashboard metrics filtering
interface AnalyticsOrder {
  id: string;
  createdAt: string; // ISO date string
  orderStatus: string;
  paymentMethod: 'Prepaid' | 'COD' | 'Partial COD';
  source: 'Shopify' | 'Medusa' | 'Clone (Manual)' | 'Clone (System)';
  orderTotal: number;
  refundStatus?: 'Requested' | 'Processed' | 'Pending' | 'NA';
}

const MOCK_ORDERS: AnalyticsOrder[] = [
  {
    id: 'ORD-001',
    createdAt: '2026-03-03T10:00:00Z',
    orderStatus: 'Delivered',
    paymentMethod: 'Prepaid',
    source: 'Shopify',
    orderTotal: 5499,
    refundStatus: 'NA',
  },
  {
    id: 'ORD-002',
    createdAt: '2026-03-02T12:00:00Z',
    orderStatus: 'Cancelled',
    paymentMethod: 'COD',
    source: 'Medusa',
    orderTotal: 2499,
    refundStatus: 'Requested',
  },
  {
    id: 'ORD-003',
    createdAt: '2026-02-28T08:30:00Z',
    orderStatus: 'Delivered',
    paymentMethod: 'Partial COD',
    source: 'Clone (Manual)',
    orderTotal: 3999,
    refundStatus: 'Processed',
  },
  {
    id: 'ORD-004',
    createdAt: '2026-02-26T14:15:00Z',
    orderStatus: 'Delivered',
    paymentMethod: 'Prepaid',
    source: 'Clone (System)',
    orderTotal: 6999,
    refundStatus: 'NA',
  },
  {
    id: 'ORD-005',
    createdAt: '2026-02-25T09:45:00Z',
    orderStatus: 'RTO - NDR',
    paymentMethod: 'COD',
    source: 'Shopify',
    orderTotal: 1999,
    refundStatus: 'Pending',
  },
];

// Centralized metric navigation mapping
const METRIC_NAV_MAP: Record<string, { route: string; filters: Record<string, any> }> = {
  // Orders tab
  total_orders: { route: '/analytics/listing', filters: {} },
  delivered_orders: { route: '/analytics/listing', filters: { status: 'delivered' } },
  total_revenue: { route: '/analytics/listing', filters: {} },
  net_revenue: { route: '/analytics/listing', filters: {} },
  prepaid_orders: { route: '/analytics/listing', filters: { paymentType: 'prepaid' } },
  cod_orders: { route: '/analytics/listing', filters: { paymentType: 'cod' } },
  partial_cod_orders: { route: '/analytics/listing', filters: { paymentType: 'partial_cod' } },
  prepaid_percentage: { route: '/analytics/listing', filters: { paymentType: 'prepaid' } },
  cod_percentage: { route: '/analytics/listing', filters: { paymentType: 'cod' } },
  partial_cod_percentage: { route: '/analytics/listing', filters: { paymentType: 'partial_cod' } },
  shopify_orders: { route: '/analytics/listing', filters: { source: 'Shopify' } },
  medusa_orders: { route: '/analytics/listing', filters: { source: 'Medusa' } },
  clone_manual: { route: '/analytics/listing', filters: { source: 'Clone (Manual)' } },
  clone_system: { route: '/analytics/listing', filters: { source: 'Clone (System)' } },
  // Logistics tab
  total_orders_logistics: { route: '/analytics/listing', filters: {} },
  delivered_orders_logistics: { route: '/analytics/listing', filters: { status: 'Delivered' } },
  total_returns: { route: '/analytics/listing', filters: { returnStatus: 'all' } },
  returns_delivered: { route: '/analytics/listing', filters: { returnStatus: 'delivered' } },
  total_cancellations: { route: '/analytics/listing', filters: { status: 'Cancelled' } },
  total_replacements: { route: '/analytics/listing', filters: { replacementType: 'all' } },
  ndr_orders: { route: '/analytics/listing', filters: { status: 'RTO - NDR' } },
  cancellation_replacement: { route: '/analytics/listing', filters: { replacementType: 'cancellation' } },
  rto_replacement: { route: '/analytics/listing', filters: { replacementType: 'rto' } },
  delivered_replacement: { route: '/analytics/listing', filters: { replacementType: 'delivered' } },
  // Finance tab - all route to analytics listing with refundStatus
  refund_requests: { route: '/analytics/listing', filters: { refundStatus: 'all' } },
  refund_value_requested: { route: '/analytics/listing', filters: { refundStatus: 'requested' } },
  pending_refund_requests: { route: '/analytics/listing', filters: { refundStatus: 'pending' } },
  refunds_processed: { route: '/analytics/listing', filters: { refundStatus: 'processed' } },
  refund_value_processed: { route: '/analytics/listing', filters: { refundStatus: 'processed' } },
};

// Metric Card Component
interface MetricCardProps {
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  onClick?: () => void;
}

function MetricCard({ label, value, icon, onClick }: MetricCardProps) {
  return (
    <div
      onClick={onClick}
      className={`bg-card border border-border/40 rounded-md p-3 flex items-start justify-between h-24 transition-all duration-200 ${
        onClick ? 'cursor-pointer hover:shadow-md hover:border-border/80 hover:scale-105' : ''
      }`}
    >
      <div className="flex-1 min-w-0">
        <p className="text-xs text-muted-foreground/80 font-medium mb-1.5">{label}</p>
        <p className="text-sm font-bold text-foreground">{value}</p>
      </div>
      {icon && <div className="ml-2 text-muted-foreground/40 flex-shrink-0">{icon}</div>}
    </div>
  );
}

// Section Component
interface SectionProps {
  title: string;
  cards: Array<Omit<MetricCardProps, 'onClick'> & { id: string; onClick?: () => void }>;
}

function MetricSection({ title, cards }: SectionProps) {
  return (
    <div className="space-y-2.5">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">{title}</h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {cards.map((card) => (
          <MetricCard 
            key={card.id} 
            label={card.label} 
            value={card.value} 
            icon={<Info className="h-3.5 w-3.5" />}
            onClick={card.onClick}
          />
        ))}
      </div>
    </div>
  );
}

export function AnalyticsDashboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');
  const [selectedMetric, setSelectedMetric] = useState('default');

  // Chart range state (applied + draft)
  const [chartAppliedRange, setChartAppliedRange] = useState<{ from: Date; to: Date }>({
    from: new Date("2026-02-15"),
    to: new Date("2026-03-17"),
  })

  const [chartDraftRange, setChartDraftRange] = useState<{ from: Date; to: Date }>({
    from: new Date("2026-02-15"),
    to: new Date("2026-03-17"),
  })
  const [chartPopoverOpen, setChartPopoverOpen] = useState(false)

  // Dashboard range state (applied + draft)
  const [dashboardAppliedRange, setDashboardAppliedRange] = useState<{ from: Date; to: Date }>({
    from: new Date("2026-02-15"),
    to: new Date("2026-03-17"),
  })

  const [dashboardDraftRange, setDashboardDraftRange] = useState<{ from: Date; to: Date }>({
    from: new Date("2026-02-15"),
    to: new Date("2026-03-17"),
  })
  const [dashboardPopoverOpen, setDashboardPopoverOpen] = useState(false)

  const formatRangeLabel = (from: Date, to: Date) => {
    const format = (d: Date) =>
      d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    return `${format(from)} - ${format(to)}`;
  };

  // Filter orders for dashboard metrics (uses applied range only)
  const filteredOrdersForMetrics = useMemo(() => {
    return MOCK_ORDERS.filter((order) => {
      const d = new Date(order.createdAt).getTime()
      return (
        d >= dashboardAppliedRange.from.getTime() &&
        d <= dashboardAppliedRange.to.getTime()
      )
    })
  }, [MOCK_ORDERS, dashboardAppliedRange])

  // Metric values derived from filtered orders
  const metricValues = useMemo(() => {
    const total = filteredOrdersForMetrics.length;
    const delivered = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('deliver'),
    ).length;

    const totalRevenue = filteredOrdersForMetrics.reduce((sum, order) => sum + order.orderTotal, 0);
    const netRevenue = totalRevenue * 0.95;

    const prepaid = filteredOrdersForMetrics.filter((order) => order.paymentMethod === 'Prepaid').length;
    const cod = filteredOrdersForMetrics.filter((order) => order.paymentMethod === 'COD').length;
    const partialCod = filteredOrdersForMetrics.filter((order) => order.paymentMethod === 'Partial COD').length;

    const shopify = filteredOrdersForMetrics.filter((order) => order.source === 'Shopify').length;
    const medusa = filteredOrdersForMetrics.filter((order) => order.source === 'Medusa').length;
    const cloneManual = filteredOrdersForMetrics.filter((order) => order.source === 'Clone (Manual)').length;
    const cloneSystem = filteredOrdersForMetrics.filter((order) => order.source === 'Clone (System)').length;

    const refundRequests = filteredOrdersForMetrics.filter((order) => order.refundStatus === 'Requested').length;
    const refundValueRequested = filteredOrdersForMetrics
      .filter((order) => order.refundStatus === 'Requested')
      .reduce((sum, order) => sum + order.orderTotal, 0);

    const pendingRefundRequests = filteredOrdersForMetrics.filter((order) => order.refundStatus === 'Pending').length;
    const refundsProcessed = filteredOrdersForMetrics.filter((order) => order.refundStatus === 'Processed').length;
    const refundValueProcessed = filteredOrdersForMetrics
      .filter((order) => order.refundStatus === 'Processed')
      .reduce((sum, order) => sum + order.orderTotal, 0);

    const cancellations = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('cancel'),
    ).length;

    const replacements = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('replacement'),
    ).length;

    const ndrOrders = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('ndr'),
    ).length;

    const cancellationReplacement = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('cancellation'),
    ).length;

    const rtoReplacement = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('rto'),
    ).length;

    const deliveredReplacement = filteredOrdersForMetrics.filter((order) =>
      order.orderStatus.toLowerCase().includes('delivered') &&
      order.orderStatus.toLowerCase().includes('replacement'),
    ).length;

    const getPercent = (value: number) =>
      total === 0 ? '0%' : `${((value / total) * 100).toFixed(1)}%`;

    return {
      total_orders: formatNumber(total),
      delivered_orders: formatNumber(delivered),
      total_revenue: formatCurrency(totalRevenue),
      net_revenue: formatCurrency(netRevenue),
      prepaid_orders: formatNumber(prepaid),
      cod_orders: formatNumber(cod),
      partial_cod_orders: formatNumber(partialCod),
      prepaid_percentage: getPercent(prepaid),
      cod_percentage: getPercent(cod),
      partial_cod_percentage: getPercent(partialCod),
      shopify_orders: formatNumber(shopify),
      medusa_orders: formatNumber(medusa),
      clone_manual: formatNumber(cloneManual),
      clone_system: formatNumber(cloneSystem),
      total_orders_logistics: formatNumber(total),
      delivered_orders_logistics: formatNumber(delivered),
      total_returns: formatNumber(refundRequests),
      returns_delivered: formatNumber(refundsProcessed),
      total_cancellations: formatNumber(cancellations),
      total_replacements: formatNumber(replacements),
      ndr_orders: formatNumber(ndrOrders),
      cancellation_replacement: formatNumber(cancellationReplacement),
      rto_replacement: formatNumber(rtoReplacement),
      delivered_replacement: formatNumber(deliveredReplacement),
      refund_requests: formatNumber(refundRequests),
      refund_value_requested: formatCurrency(refundValueRequested),
      pending_refund_requests: formatNumber(pendingRefundRequests),
      refunds_processed: formatNumber(refundsProcessed),
      refund_value_processed: formatCurrency(refundValueProcessed),
    };
  }, [filteredOrdersForMetrics]);

  // Filter chart data by chart applied range
  const filterChartDataByDate = (data: typeof chartDataOrders) => {
    const startDate = chartAppliedRange.from;
    const endDate = chartAppliedRange.to;

    return data.filter((item) => {
      // Parse date like "Feb 16" to proper Date
      const [month, day] = item.date.split(' ');
      const monthIndex = new Date(`${month} 1, 2026`).getMonth();
      const itemDate = new Date(2026, monthIndex, parseInt(day));
      return itemDate >= startDate && itemDate <= endDate;
    });
  };

  // Get chart data based on active tab and chart applied range
  const filteredChartData = useMemo(() => {
    const rawChartData = {
      orders: chartDataOrders,
      logistics: chartDataLogistics,
      finance: chartDataFinance,
    }[activeTab] || chartDataOrders;

    return rawChartData.filter((item) => {
      const [month, day] = item.date.split(' ');
      const monthIndex = new Date(`${month} 1, 2026`).getMonth();
      const d = new Date(2026, monthIndex, parseInt(day)).getTime()
      return (
        d >= chartAppliedRange.from.getTime() &&
        d <= chartAppliedRange.to.getTime()
      )
    })
  }, [activeTab, chartAppliedRange])

  // Get chart config and title
  const { chartConfig, chartTitle, metricOptions } = useMemo(() => {
    switch (activeTab) {
      case 'logistics':
        return {
          chartConfig: chartConfigLogistics,
          chartTitle: 'Logistics Trends',
          metricOptions: [
            { value: 'total_orders_logistics', label: 'Total Orders' },
            { value: 'delivered_orders_logistics', label: 'Orders Delivered' },
            { value: 'total_returns', label: 'Total Returns' },
            { value: 'returns_delivered', label: 'Returns Delivered' },
            { value: 'total_cancellations', label: 'Total Cancellations' },
            { value: 'total_replacements', label: 'Total Replacements' },
            { value: 'ndr_orders', label: 'NDR Orders' },
            { value: 'cancellation_replacement', label: 'Cancellation Replacement' },
            { value: 'rto_replacement', label: 'RTO Replacement' },
            { value: 'delivered_replacement', label: 'Delivered Replacement' },
          ],
        };
      case 'finance':
        return {
          chartConfig: chartConfigFinance,
          chartTitle: 'Finance Trends',
          metricOptions: [
            { value: 'refund_requests', label: 'Refund Requests' },
            { value: 'refund_value_requested', label: 'Refund Value Requested' },
            { value: 'pending_refund_requests', label: 'Pending Refund Requests' },
            { value: 'refunds_processed', label: 'Refunds Processed' },
            { value: 'refund_value_processed', label: 'Refund Value Processed' },
          ],
        };
      default:
        return {
          chartConfig: chartConfigOrders,
          chartTitle: 'Order Trends',
          metricOptions: [
            { value: 'total_orders', label: 'Total Orders' },
            { value: 'delivered_orders', label: 'Delivered Orders' },
            { value: 'total_revenue', label: 'Total Revenue' },
            { value: 'net_revenue', label: 'Net Revenue' },
            { value: 'prepaid_orders', label: 'Prepaid Orders' },
            { value: 'cod_orders', label: 'COD Orders' },
            { value: 'partial_cod_orders', label: 'Partial COD Orders' },
            { value: 'prepaid_percentage', label: 'Prepaid %' },
            { value: 'cod_percentage', label: 'COD %' },
            { value: 'partial_cod_percentage', label: 'Partial COD %' },
            { value: 'shopify_orders', label: 'Shopify Orders' },
            { value: 'medusa_orders', label: 'Medusa Orders' },
            { value: 'clone_manual', label: 'Clone (Manual)' },
            { value: 'clone_system', label: 'Clone (System)' },
          ],
        };
    }
  }, [activeTab]);

  // Create filter handlers for metric cards
  const createCardClickHandler = (cardId: string) => {
    return () => {
      const navConfig = METRIC_NAV_MAP[cardId];
      if (navConfig) {
        // Build URL with query params
        const queryParams = new URLSearchParams();
        Object.entries(navConfig.filters).forEach(([key, value]) => {
          if (value !== null && value !== undefined && value !== '') {
            queryParams.append(key, String(value));
          }
        });
        const query = queryParams.toString();
        const url = query ? `${navConfig.route}?${query}` : navConfig.route;
        router.push(url);
      }
    };
  };

  return (
    <div className="space-y-8">
      {/* Tab Switcher with Dashboard Date Range */}
      <div className="flex items-center justify-between gap-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-fit">
          <TabsList className="bg-transparent border-0 gap-2 p-0 h-auto w-fit justify-start">
            <TabsTrigger
              value="orders"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-colors"
            >
              Orders
            </TabsTrigger>
            <TabsTrigger
              value="logistics"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-colors"
            >
              Logistics
            </TabsTrigger>
            <TabsTrigger
              value="finance"
              className="rounded-md border border-border bg-card px-3 py-1.5 text-sm font-medium data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:border-primary transition-colors"
            >
              Finance
            </TabsTrigger>
          </TabsList>
        </Tabs>

        {/* Dashboard Date Range Selector */}
        <Popover
          open={dashboardPopoverOpen}
          onOpenChange={(open) => {
            setDashboardPopoverOpen(open);
            if (open) setDashboardDraftRange(dashboardAppliedRange);
          }}
        >
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2.5 rounded-md border border-border bg-card px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted/60 hover:border-border/80 transition-all duration-200 active:scale-95">
              <CalendarIcon className="h-4 w-4 text-primary/70" />
              <span className="text-foreground font-medium">{formatRangeLabel(dashboardAppliedRange.from, dashboardAppliedRange.to)}</span>
            </button>
          </PopoverTrigger>
            <PopoverContent className="w-auto" align="end" side="bottom">
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-sm font-semibold text-foreground">Select Date Range</h3>
                  <p className="text-xs text-muted-foreground">Choose start and end dates for dashboard metrics</p>
                </div>
                <DateRangeCalendar
                  mode="range"
                  numberOfMonths={2}
                  disabled={{ after: new Date() }}
                  selected={dashboardDraftRange}
                  onSelect={(range) => setDashboardDraftRange(range ?? dashboardDraftRange)}
                />
                <div className="flex justify-end gap-2 pt-2 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setDashboardDraftRange(dashboardAppliedRange);
                      setDashboardPopoverOpen(false);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    onClick={() => {
                      if (dashboardDraftRange.from && dashboardDraftRange.to) {
                        setDashboardAppliedRange(dashboardDraftRange);
                      }
                      setDashboardPopoverOpen(false);
                    }}
                  >
                    Apply
                  </Button>
                </div>
              </div>
            </PopoverContent>
        </Popover>
      </div>

      {/* Tab Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Orders Tab */}
        <TabsContent value="orders" className="space-y-6 mt-6">
          {/* Chart Section */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{chartTitle}</h3>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">Click any metric card to view filtered orders</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Popover
                    open={chartPopoverOpen}
                    onOpenChange={(open) => {
                      setChartPopoverOpen(open);
                      if (open) setChartDraftRange(chartAppliedRange);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted/60 hover:border-border/80 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <CalendarIcon className="h-4 w-4 text-primary/60" />
                        <span>{formatRangeLabel(chartAppliedRange.from, chartAppliedRange.to)}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto" side="top">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">Chart Date Range</h3>
                          <p className="text-xs text-muted-foreground">Adjust the date range for this chart</p>
                        </div>
                        <DateRangeCalendar
                          mode="range"
                          numberOfMonths={2}
                          disabled={{ after: new Date() }}
                          selected={chartDraftRange}
                          onSelect={(range) => setChartDraftRange(range ?? chartDraftRange)}
                        />
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setChartDraftRange(chartAppliedRange);
                              setChartPopoverOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (chartDraftRange.from && chartDraftRange.to) {
                                setChartAppliedRange(chartDraftRange);
                              }
                              setChartPopoverOpen(false);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {metricOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <ChartContainer config={chartConfig} className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Metric Cards - Orders Tab */}
          <MetricSection
            title="Core Order Volume"
            cards={[
              {
                id: 'total_orders',
                label: 'Total Orders',
                value: metricValues.total_orders,
                onClick: createCardClickHandler('total_orders'),
              },
              {
                id: 'delivered_orders',
                label: 'Delivered Orders',
                value: metricValues.delivered_orders,
                onClick: createCardClickHandler('delivered_orders'),
              },
              {
                id: 'total_revenue',
                label: 'Total Revenue',
                value: metricValues.total_revenue,
                onClick: createCardClickHandler('total_revenue'),
              },
              {
                id: 'net_revenue',
                label: 'Net Revenue',
                value: metricValues.net_revenue,
                onClick: createCardClickHandler('net_revenue'),
              },
            ]}
          />

          <MetricSection
            title="Payment Mix"
            cards={[
              {
                id: 'prepaid_orders',
                label: 'Prepaid Orders',
                value: metricValues.prepaid_orders,
                onClick: createCardClickHandler('prepaid_orders'),
              },
              {
                id: 'cod_orders',
                label: 'COD Orders',
                value: metricValues.cod_orders,
                onClick: createCardClickHandler('cod_orders'),
              },
              {
                id: 'partial_cod_orders',
                label: 'Partial COD Orders',
                value: metricValues.partial_cod_orders,
                onClick: createCardClickHandler('partial_cod_orders'),
              },
              {
                id: 'prepaid_percentage',
                label: 'Prepaid %',
                value: metricValues.prepaid_percentage,
                onClick: createCardClickHandler('prepaid_percentage'),
              },
              {
                id: 'cod_percentage',
                label: 'COD %',
                value: metricValues.cod_percentage,
                onClick: createCardClickHandler('cod_percentage'),
              },
              {
                id: 'partial_cod_percentage',
                label: 'Partial COD %',
                value: metricValues.partial_cod_percentage,
                onClick: createCardClickHandler('partial_cod_percentage'),
              },
            ]}
          />

          <MetricSection
            title="Order Source / Type"
            cards={[
              {
                id: 'shopify_orders',
                label: 'Shopify Orders',
                value: metricValues.shopify_orders,
                onClick: createCardClickHandler('shopify_orders'),
              },
              {
                id: 'medusa_orders',
                label: 'Medusa Orders',
                value: metricValues.medusa_orders,
                onClick: createCardClickHandler('medusa_orders'),
              },
              {
                id: 'clone_manual',
                label: 'Clone (Manual)',
                value: metricValues.clone_manual,
                onClick: createCardClickHandler('clone_manual'),
              },
              {
                id: 'clone_system',
                label: 'Clone (System)',
                value: metricValues.clone_system,
                onClick: createCardClickHandler('clone_system'),
              },
            ]}
          />
        </TabsContent>

        {/* Logistics Tab */}
        <TabsContent value="logistics" className="space-y-6 mt-6">
          {/* Chart Section */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{chartTitle}</h3>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">Click any metric card to view filtered orders</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Popover
                    open={chartPopoverOpen}
                    onOpenChange={(open) => {
                      setChartPopoverOpen(open);
                      if (open) setChartDraftRange(chartAppliedRange);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted/60 hover:border-border/80 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <CalendarIcon className="h-4 w-4 text-primary/60" />
                        <span>{formatRangeLabel(chartAppliedRange.from, chartAppliedRange.to)}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto" side="top">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">Chart Date Range</h3>
                          <p className="text-xs text-muted-foreground">Adjust the date range for this chart</p>
                        </div>
                        <DateRangeCalendar
                          mode="range"
                          numberOfMonths={2}
                          disabled={{ after: new Date() }}
                          selected={chartDraftRange}
                          onSelect={(range) => setChartDraftRange(range ?? chartDraftRange)}
                        />
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setChartDraftRange(chartAppliedRange);
                              setChartPopoverOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (chartDraftRange.from && chartDraftRange.to) {
                                setChartAppliedRange(chartDraftRange);
                              }
                              setChartPopoverOpen(false);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {metricOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <ChartContainer config={chartConfig} className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Metric Cards - Logistics Tab */}
          <MetricSection
            title="Logistics Overview"
            cards={[
              {
                id: 'total_orders_logistics',
                label: 'Total Orders',
                value: metricValues.total_orders_logistics,
                onClick: createCardClickHandler('total_orders_logistics'),
              },
              {
                id: 'delivered_orders_logistics',
                label: 'Orders Delivered',
                value: metricValues.delivered_orders_logistics,
                onClick: createCardClickHandler('delivered_orders_logistics'),
              },
              {
                id: 'total_returns',
                label: 'Total Returns',
                value: metricValues.total_returns,
                onClick: createCardClickHandler('total_returns'),
              },
              {
                id: 'returns_delivered',
                label: 'Returns Delivered',
                value: metricValues.returns_delivered,
                onClick: createCardClickHandler('returns_delivered'),
              },
            ]}
          />

          <MetricSection
            title="Exceptions"
            cards={[
              {
                id: 'total_cancellations',
                label: 'Total Cancellations',
                value: metricValues.total_cancellations,
                onClick: createCardClickHandler('total_cancellations'),
              },
              {
                id: 'total_replacements',
                label: 'Total Replacements',
                value: metricValues.total_replacements,
                onClick: createCardClickHandler('total_replacements'),
              },
              {
                id: 'ndr_orders',
                label: 'NDR Orders',
                value: metricValues.ndr_orders,
                onClick: createCardClickHandler('ndr_orders'),
              },
            ]}
          />

          <MetricSection
            title="Replacement Split"
            cards={[
              {
                id: 'cancellation_replacement',
                label: 'Cancellation Replacement',
                value: metricValues.cancellation_replacement,
                onClick: createCardClickHandler('cancellation_replacement'),
              },
              {
                id: 'rto_replacement',
                label: 'RTO Replacement',
                value: metricValues.rto_replacement,
                onClick: createCardClickHandler('rto_replacement'),
              },
              {
                id: 'delivered_replacement',
                label: 'Delivered Replacement',
                value: metricValues.delivered_replacement,
                onClick: createCardClickHandler('delivered_replacement'),
              },
            ]}
          />
        </TabsContent>

        {/* Finance Tab */}
        <TabsContent value="finance" className="space-y-6 mt-6">
          {/* Chart Section */}
          <div className="rounded-lg border border-border bg-card overflow-hidden">
            <div className="p-6 border-b border-border">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground">{chartTitle}</h3>
                  <p className="text-xs text-muted-foreground/70 mt-1.5">Click any metric card to view filtered requests</p>
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
                  <Popover
                    open={chartPopoverOpen}
                    onOpenChange={(open) => {
                      setChartPopoverOpen(open);
                      if (open) setChartDraftRange(chartAppliedRange);
                    }}
                  >
                    <PopoverTrigger asChild>
                      <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md border border-border bg-background text-foreground text-sm font-medium hover:bg-muted/60 hover:border-border/80 transition-all duration-200 active:scale-95 focus:outline-none focus:ring-2 focus:ring-primary/50">
                        <CalendarIcon className="h-4 w-4 text-primary/60" />
                        <span>{formatRangeLabel(chartAppliedRange.from, chartAppliedRange.to)}</span>
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto" side="top">
                      <div className="space-y-4">
                        <div className="space-y-1">
                          <h3 className="text-sm font-semibold text-foreground">Chart Date Range</h3>
                          <p className="text-xs text-muted-foreground">Adjust the date range for this chart</p>
                        </div>
                        <DateRangeCalendar
                          mode="range"
                          numberOfMonths={2}
                          disabled={{ after: new Date() }}
                          selected={chartDraftRange}
                          onSelect={(range) => setChartDraftRange(range ?? chartDraftRange)}
                        />
                        <div className="flex justify-end gap-2 pt-2 border-t border-border">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setChartDraftRange(chartAppliedRange);
                              setChartPopoverOpen(false);
                            }}
                          >
                            Cancel
                          </Button>
                          <Button
                            size="sm"
                            onClick={() => {
                              if (chartDraftRange.from && chartDraftRange.to) {
                                setChartAppliedRange(chartDraftRange);
                              }
                              setChartPopoverOpen(false);
                            }}
                          >
                            Apply
                          </Button>
                        </div>
                      </div>
                    </PopoverContent>
                  </Popover>
                  <select
                    value={selectedMetric}
                    onChange={(e) => setSelectedMetric(e.target.value)}
                    className="px-3 py-1.5 rounded border border-border bg-background text-foreground text-xs focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  >
                    {metricOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div className="p-6">
              <ChartContainer config={chartConfig} className="h-96 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={filteredChartData} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                    <XAxis dataKey="date" stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <YAxis stroke="var(--color-muted-foreground)" style={{ fontSize: '0.75rem' }} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'var(--color-card)',
                        border: '1px solid var(--color-border)',
                        borderRadius: '0.5rem',
                      }}
                    />
                    <Line type="monotone" dataKey="value" stroke="var(--color-value)" dot={false} strokeWidth={2} />
                  </LineChart>
                </ResponsiveContainer>
              </ChartContainer>
            </div>
          </div>

          {/* Metric Cards - Finance Tab */}
          <div className="space-y-2.5">
            <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wide">Refund Overview</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
              <MetricCard
                label="Refund Requests"
                value={metricValues.refund_requests}
                icon={<Info className="h-3.5 w-3.5" />}
                onClick={createCardClickHandler('refund_requests')}
              />
              <MetricCard
                label="Refund Value Requested"
                value={metricValues.refund_value_requested}
                icon={<Info className="h-3.5 w-3.5" />}
                onClick={createCardClickHandler('refund_value_requested')}
              />
              <MetricCard
                label="Pending Refund Requests"
                value={metricValues.pending_refund_requests}
                icon={<Info className="h-3.5 w-3.5" />}
                onClick={createCardClickHandler('pending_refund_requests')}
              />
              <MetricCard
                label="Refunds Processed"
                value={metricValues.refunds_processed}
                icon={<Info className="h-3.5 w-3.5" />}
                onClick={createCardClickHandler('refunds_processed')}
              />
              <MetricCard
                label="Refund Value Processed"
                value={metricValues.refund_value_processed}
                icon={<Info className="h-3.5 w-3.5" />}
                onClick={createCardClickHandler('refund_value_processed')}
              />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
