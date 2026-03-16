"use client";

import { useState, useMemo } from "react";
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarIcon, Package, CheckCircle2, DollarSign, CreditCard, Banknote, ShoppingBag, Database, Copy, Settings, Info, XCircle, Truck, RotateCcw, AlertTriangle, RefreshCw, X } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Dashboard tabs
type DashboardTab = 'orders' | 'logistics';

// Filter types for drill-down
type OrdersFilter = 'total' | 'delivered' | 'totalRevenue' | 'netRevenue' | 'prepaid' | 'cod' | 'shopify' | 'medusa' | 'cloneManual' | 'cloneSystem' | null;
type LogisticsFilter = 'totalOrders' | 'ordersDelivered' | 'totalReturns' | 'returnsDelivered' | 'totalCancellations' | 'totalReplacements' | 'ndrOrders' | 'cancellationReplacement' | 'rtoReplacement' | 'deliveredReplacement' | null;

// Mock data for the line chart
const generateMockChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      totalOrders: Math.floor(Math.random() * 150) + 80,
      deliveredOrders: Math.floor(Math.random() * 100) + 50,
      totalRevenue: Math.floor(Math.random() * 50000) + 20000,
      netRevenue: Math.floor(Math.random() * 45000) + 18000,
      prepaidOrders: Math.floor(Math.random() * 80) + 40,
      codOrders: Math.floor(Math.random() * 70) + 30,
      shopifyOrders: Math.floor(Math.random() * 90) + 50,
      cloneOrders: Math.floor(Math.random() * 30) + 10,
      // Logistics metrics
      ordersDelivered: Math.floor(Math.random() * 100) + 50,
      totalReturns: Math.floor(Math.random() * 30) + 10,
      returnsDelivered: Math.floor(Math.random() * 20) + 5,
      totalCancellations: Math.floor(Math.random() * 25) + 8,
      totalReplacements: Math.floor(Math.random() * 20) + 5,
      ndrOrders: Math.floor(Math.random() * 40) + 15,
    });
  }
  return data;
};

const chartData = generateMockChartData();

const lineChartConfig: ChartConfig = {
  totalOrders: { label: 'Total Orders', color: 'var(--chart-1)' },
  deliveredOrders: { label: 'Delivered Orders', color: 'var(--chart-3)' },
  totalRevenue: { label: 'Total Revenue', color: 'var(--chart-2)' },
  netRevenue: { label: 'Net Revenue', color: 'var(--chart-4)' },
  prepaidOrders: { label: 'Prepaid Orders', color: 'var(--chart-2)' },
  codOrders: { label: 'COD Orders', color: 'var(--chart-4)' },
  shopifyOrders: { label: 'Shopify Orders', color: 'var(--chart-1)' },
  cloneOrders: { label: 'Clone Orders', color: 'var(--chart-3)' },
  ordersDelivered: { label: 'Orders Delivered', color: 'var(--chart-3)' },
  totalReturns: { label: 'Total Returns', color: 'var(--chart-2)' },
  returnsDelivered: { label: 'Returns Delivered', color: 'var(--chart-4)' },
  totalCancellations: { label: 'Total Cancellations', color: 'var(--chart-1)' },
  totalReplacements: { label: 'Total Replacements', color: 'var(--chart-2)' },
  ndrOrders: { label: 'NDR Orders', color: 'var(--chart-4)' },
};

type MetricOption = {
  value: string;
  label: string;
  dataKey: keyof typeof chartData[0];
};

const ordersMetricOptions: MetricOption[] = [
  { value: 'total', label: 'Total Orders', dataKey: 'totalOrders' },
  { value: 'delivered', label: 'Delivered Orders', dataKey: 'deliveredOrders' },
  { value: 'totalRevenue', label: 'Total Revenue', dataKey: 'totalRevenue' },
  { value: 'netRevenue', label: 'Net Revenue', dataKey: 'netRevenue' },
  { value: 'prepaid', label: 'Prepaid Orders', dataKey: 'prepaidOrders' },
  { value: 'cod', label: 'COD Orders', dataKey: 'codOrders' },
  { value: 'shopify', label: 'Shopify Orders', dataKey: 'shopifyOrders' },
  { value: 'clone', label: 'Clone Orders', dataKey: 'cloneOrders' },
];

const logisticsMetricOptions: MetricOption[] = [
  { value: 'ordersDelivered', label: 'Orders Delivered', dataKey: 'ordersDelivered' },
  { value: 'totalReturns', label: 'Total Returns', dataKey: 'totalReturns' },
  { value: 'returnsDelivered', label: 'Returns Delivered', dataKey: 'returnsDelivered' },
  { value: 'totalCancellations', label: 'Total Cancellations', dataKey: 'totalCancellations' },
  { value: 'totalReplacements', label: 'Total Replacements', dataKey: 'totalReplacements' },
  { value: 'ndrOrders', label: 'NDR Orders', dataKey: 'ndrOrders' },
];

// Tooltip definitions for metric cards
const metricTooltips: Record<string, string> = {
  'Total Orders': 'Total number of orders created in the selected date range',
  'Delivered Orders': 'Orders marked as delivered in the selected date range',
  'Total Revenue': 'Gross order value before cancellations/refunds',
  'Net Revenue': 'Revenue after cancellations/refunds adjustments',
  'Prepaid Orders': 'Orders placed using prepaid payment method',
  'COD Orders': 'Orders placed using cash on delivery',
  'Prepaid %': 'Percentage of total orders that are prepaid',
  'COD %': 'Percentage of total orders that are COD',
  'Shopify Orders': 'Orders originating from Shopify',
  'Medusa Orders': 'Orders originating from Medusa',
  'Clone (Manual)': 'Orders created manually as clone orders',
  'Clone (System)': 'Orders created automatically as system clone orders',
  // Logistics tooltips
  'Orders Delivered': 'Total orders successfully delivered to customers',
  'Total Returns': 'Total orders returned by customers',
  'Returns Delivered': 'Returned orders successfully received at warehouse',
  'Total Cancellations': 'Total orders cancelled before delivery',
  'Total Replacements': 'Total replacement orders created',
  'NDR Orders': 'Orders with Non-Delivery Report status',
  'Cancellation Replacement': 'Replacement orders created for cancelled orders',
  'RTO Replacement': 'Replacement orders created for RTO (Return to Origin)',
  'Delivered Replacement': 'Replacement orders for delivered items',
};

// Filter labels mapping
const filterLabels: Record<string, string> = {
  total: 'Total Orders',
  delivered: 'Delivered Orders',
  totalRevenue: 'Total Revenue Orders',
  netRevenue: 'Net Revenue Orders',
  prepaid: 'Prepaid Orders',
  cod: 'COD Orders',
  shopify: 'Shopify Orders',
  medusa: 'Medusa Orders',
  cloneManual: 'Clone (Manual) Orders',
  cloneSystem: 'Clone (System) Orders',
  totalOrders: 'All Orders',
  ordersDelivered: 'Delivered Orders',
  totalReturns: 'Returned Orders',
  returnsDelivered: 'Returns Delivered',
  totalCancellations: 'Cancelled Orders',
  totalReplacements: 'Replacement Orders',
  ndrOrders: 'NDR Orders',
  cancellationReplacement: 'Cancellation - Replacement Created',
  rtoReplacement: 'RTO - Replacement Created',
  deliveredReplacement: 'Delivered - Replacement Created',
};

// Mock orders data for listing
const mockOrdersData = [
  { id: 'ORD-001', customer: 'John Smith', status: 'Delivered', date: '2024-01-15', value: 125.99, channel: 'Shopify', paymentMethod: 'Prepaid' },
  { id: 'ORD-002', customer: 'Jane Doe', status: 'Pending', date: '2024-01-15', value: 89.50, channel: 'Medusa', paymentMethod: 'COD' },
  { id: 'ORD-003', customer: 'Bob Wilson', status: 'Delivered', date: '2024-01-14', value: 234.00, channel: 'Shopify', paymentMethod: 'Prepaid' },
  { id: 'ORD-004', customer: 'Alice Brown', status: 'Cancelled', date: '2024-01-14', value: 67.25, channel: 'Clone (Manual)', paymentMethod: 'COD' },
  { id: 'ORD-005', customer: 'Charlie Davis', status: 'Delivered', date: '2024-01-13', value: 445.00, channel: 'Shopify', paymentMethod: 'Prepaid' },
  { id: 'ORD-006', customer: 'Eva Martinez', status: 'NDR', date: '2024-01-13', value: 156.75, channel: 'Medusa', paymentMethod: 'COD' },
  { id: 'ORD-007', customer: 'Frank Lee', status: 'RTO - Replacement Created', date: '2024-01-12', value: 299.99, channel: 'Shopify', paymentMethod: 'Prepaid' },
  { id: 'ORD-008', customer: 'Grace Kim', status: 'Returned', date: '2024-01-12', value: 178.50, channel: 'Clone (System)', paymentMethod: 'Prepaid' },
  { id: 'ORD-009', customer: 'Henry Chen', status: 'Delivered', date: '2024-01-11', value: 512.00, channel: 'Shopify', paymentMethod: 'COD' },
  { id: 'ORD-010', customer: 'Ivy Patel', status: 'Cancellation - Replacement Created', date: '2024-01-11', value: 89.99, channel: 'Medusa', paymentMethod: 'Prepaid' },
  { id: 'ORD-011', customer: 'Jack Thompson', status: 'Delivered - Replacement Created', date: '2024-01-10', value: 267.00, channel: 'Shopify', paymentMethod: 'COD' },
  { id: 'ORD-012', customer: 'Kate Wilson', status: 'Returns Delivered', date: '2024-01-10', value: 145.50, channel: 'Medusa', paymentMethod: 'Prepaid' },
];

// Mock metrics data
const metricsData = {
  coreOrderVolume: {
    totalOrders: { value: 3688 },
    deliveredOrders: { value: 2890 },
    totalRevenue: { value: 892450 },
    netRevenue: { value: 845320 },
  },
  paymentMix: {
    prepaidOrders: { value: 2156 },
    codOrders: { value: 1532 },
    prepaidPercent: { value: 58.5 },
    codPercent: { value: 41.5 },
  },
  orderSource: {
    shopifyOrders: { value: 2456 },
    medusaOrders: { value: 842 },
    cloneManual: { value: 234 },
    cloneSystem: { value: 156 },
  },
};

// Logistics metrics data
const logisticsMetricsData = {
  main: {
    totalOrders: { value: 3688 },
    ordersDelivered: { value: 2890 },
    totalReturns: { value: 245 },
    returnsDelivered: { value: 198 },
    totalCancellations: { value: 312 },
    totalReplacements: { value: 156 },
    ndrOrders: { value: 423 },
  },
  replacementSplit: {
    cancellationReplacement: { value: 78 },
    rtoReplacement: { value: 45 },
    deliveredReplacement: { value: 33 },
  },
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
  prefix?: string;
  isActive?: boolean;
  onClick?: () => void;
}

function MetricCard({ title, value, icon, suffix = '', prefix = '', isActive = false, onClick }: MetricCardProps) {
  const tooltipText = metricTooltips[title] || '';
  
  return (
    <Card 
      className={cn(
        "py-3 transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:border-primary/30",
        isActive && "ring-2 ring-primary border-primary shadow-md"
      )}
      onClick={onClick}
    >
      <CardContent className="px-4 py-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground truncate">{title}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button 
                    className="text-muted-foreground/60 hover:text-muted-foreground transition-colors"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <Info className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent side="top" className="max-w-[200px]">
                  <p>{tooltipText}</p>
                </TooltipContent>
              </Tooltip>
            </div>
            <p className="text-xl font-semibold text-foreground mt-1">
              {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
          </div>
          <div className={cn(
            "h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors",
            isActive ? "bg-primary text-primary-foreground" : "bg-primary/10"
          )}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

interface OrdersListingProps {
  filter: string;
  onClearFilter: () => void;
}

function OrdersListing({ filter, onClearFilter }: OrdersListingProps) {
  const filteredOrders = useMemo(() => {
    // Filter logic based on filter type
    return mockOrdersData.filter(order => {
      switch (filter) {
        case 'delivered':
        case 'ordersDelivered':
          return order.status === 'Delivered';
        case 'totalRevenue':
        case 'netRevenue':
        case 'total':
        case 'totalOrders':
          return true;
        case 'prepaid':
          return order.paymentMethod === 'Prepaid';
        case 'cod':
          return order.paymentMethod === 'COD';
        case 'shopify':
          return order.channel === 'Shopify';
        case 'medusa':
          return order.channel === 'Medusa';
        case 'cloneManual':
          return order.channel === 'Clone (Manual)';
        case 'cloneSystem':
          return order.channel === 'Clone (System)';
        case 'totalReturns':
          return order.status === 'Returned';
        case 'returnsDelivered':
          return order.status === 'Returns Delivered';
        case 'totalCancellations':
          return order.status === 'Cancelled';
        case 'totalReplacements':
          return order.status.includes('Replacement');
        case 'ndrOrders':
          return order.status === 'NDR';
        case 'cancellationReplacement':
          return order.status === 'Cancellation - Replacement Created';
        case 'rtoReplacement':
          return order.status === 'RTO - Replacement Created';
        case 'deliveredReplacement':
          return order.status === 'Delivered - Replacement Created';
        default:
          return true;
      }
    });
  }, [filter]);

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CardTitle className="text-base font-semibold">Filtered Orders</CardTitle>
            <div className="flex items-center gap-2 px-3 py-1 bg-primary/10 rounded-full">
              <span className="text-sm font-medium text-primary">
                Filtered by: {filterLabels[filter] || filter}
              </span>
              <button
                onClick={onClearFilter}
                className="text-primary hover:text-primary/80 transition-colors"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onClearFilter}>
            Clear Filter
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order ID</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Order Value</TableHead>
              <TableHead>Channel</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.map((order) => (
              <TableRow key={order.id}>
                <TableCell className="font-medium">{order.id}</TableCell>
                <TableCell>{order.customer}</TableCell>
                <TableCell>
                  <span className={cn(
                    "px-2 py-1 rounded-full text-xs font-medium",
                    order.status === 'Delivered' && "bg-green-100 text-green-700",
                    order.status === 'Pending' && "bg-yellow-100 text-yellow-700",
                    order.status === 'Cancelled' && "bg-red-100 text-red-700",
                    order.status === 'NDR' && "bg-orange-100 text-orange-700",
                    order.status === 'Returned' && "bg-purple-100 text-purple-700",
                    order.status.includes('Replacement') && "bg-blue-100 text-blue-700",
                    order.status === 'Returns Delivered' && "bg-teal-100 text-teal-700"
                  )}>
                    {order.status}
                  </span>
                </TableCell>
                <TableCell>{order.date}</TableCell>
                <TableCell>${order.value.toFixed(2)}</TableCell>
                <TableCell>{order.channel}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {filteredOrders.length === 0 && (
          <div className="py-8 text-center text-muted-foreground">
            No orders found for this filter.
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function OrderAnalyticsPage() {
  const { isLoading } = useAuthGuard();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [ordersSelectedMetric, setOrdersSelectedMetric] = useState<string>('total');
  const [logisticsSelectedMetric, setLogisticsSelectedMetric] = useState<string>('ordersDelivered');
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');
  const [ordersFilter, setOrdersFilter] = useState<OrdersFilter>(null);
  const [logisticsFilter, setLogisticsFilter] = useState<LogisticsFilter>(null);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const currentOrdersMetric = ordersMetricOptions.find(m => m.value === ordersSelectedMetric) || ordersMetricOptions[0];
  const currentLogisticsMetric = logisticsMetricOptions.find(m => m.value === logisticsSelectedMetric) || logisticsMetricOptions[0];

  const handleOrdersCardClick = (filter: OrdersFilter) => {
    setOrdersFilter(ordersFilter === filter ? null : filter);
  };

  const handleLogisticsCardClick = (filter: LogisticsFilter) => {
    setLogisticsFilter(logisticsFilter === filter ? null : filter);
  };

  return (
    <AppLayout
      headerTitle="Order Analytics"
      breadcrumbs={[{ label: 'Analytics', href: '/analytics' }, { label: 'Order Analytics' }]}
    >
      <div className="space-y-5">
        {/* Top Bar: Dashboard Tabs and Date Range */}
        <div className="flex items-center justify-between gap-4">
          {/* Dashboard Switch Tabs */}
          <div className="flex items-center gap-1 p-1 bg-muted rounded-lg">
            <button
              onClick={() => { setActiveTab('orders'); setLogisticsFilter(null); }}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeTab === 'orders'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Orders
            </button>
            <button
              onClick={() => { setActiveTab('logistics'); setOrdersFilter(null); }}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeTab === 'logistics'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Logistics
            </button>
          </div>

          {/* Date Range Selector */}
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[260px] justify-start text-left font-normal">
                <CalendarIcon className="mr-2 h-4 w-4" />
                {dateRange?.from ? (
                  dateRange.to ? (
                    <>
                      {format(dateRange.from, 'LLL dd, y')} - {format(dateRange.to, 'LLL dd, y')}
                    </>
                  ) : (
                    format(dateRange.from, 'LLL dd, y')
                  )
                ) : (
                  <span>Pick a date range</span>
                )}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </PopoverContent>
          </Popover>
        </div>

        {/* Dashboard Content */}
        {activeTab === 'orders' ? (
          <>
            {/* Line Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Order Trends</CardTitle>
                <Select value={ordersSelectedMetric} onValueChange={setOrdersSelectedMetric}>
                  <SelectTrigger className="w-[160px] h-8 text-sm">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {ordersMetricOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey={currentOrdersMetric.dataKey}
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground">Click any metric card to view filtered orders</p>

            {/* Metric Cards Section */}
            <div className="space-y-5">
              {/* Core Order Volume */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Core Order Volume</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Total Orders"
                    value={metricsData.coreOrderVolume.totalOrders.value}
                    icon={<Package className={cn("h-4 w-4", ordersFilter === 'total' ? "text-primary-foreground" : "text-primary")} />}
                    isActive={ordersFilter === 'total'}
                    onClick={() => handleOrdersCardClick('total')}
                  />
                  <MetricCard
                    title="Delivered Orders"
                    value={metricsData.coreOrderVolume.deliveredOrders.value}
                    icon={<CheckCircle2 className={cn("h-4 w-4", ordersFilter === 'delivered' ? "text-primary-foreground" : "text-green-600")} />}
                    isActive={ordersFilter === 'delivered'}
                    onClick={() => handleOrdersCardClick('delivered')}
                  />
                  <MetricCard
                    title="Total Revenue"
                    value={metricsData.coreOrderVolume.totalRevenue.value}
                    icon={<DollarSign className={cn("h-4 w-4", ordersFilter === 'totalRevenue' ? "text-primary-foreground" : "text-primary")} />}
                    prefix="$"
                    isActive={ordersFilter === 'totalRevenue'}
                    onClick={() => handleOrdersCardClick('totalRevenue')}
                  />
                  <MetricCard
                    title="Net Revenue"
                    value={metricsData.coreOrderVolume.netRevenue.value}
                    icon={<DollarSign className={cn("h-4 w-4", ordersFilter === 'netRevenue' ? "text-primary-foreground" : "text-green-600")} />}
                    prefix="$"
                    isActive={ordersFilter === 'netRevenue'}
                    onClick={() => handleOrdersCardClick('netRevenue')}
                  />
                </div>
              </div>

              {/* Payment Mix */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Payment Mix</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Prepaid Orders"
                    value={metricsData.paymentMix.prepaidOrders.value}
                    icon={<CreditCard className={cn("h-4 w-4", ordersFilter === 'prepaid' ? "text-primary-foreground" : "text-primary")} />}
                    isActive={ordersFilter === 'prepaid'}
                    onClick={() => handleOrdersCardClick('prepaid')}
                  />
                  <MetricCard
                    title="COD Orders"
                    value={metricsData.paymentMix.codOrders.value}
                    icon={<Banknote className={cn("h-4 w-4", ordersFilter === 'cod' ? "text-primary-foreground" : "text-green-600")} />}
                    isActive={ordersFilter === 'cod'}
                    onClick={() => handleOrdersCardClick('cod')}
                  />
                  <MetricCard
                    title="Prepaid %"
                    value={metricsData.paymentMix.prepaidPercent.value}
                    icon={<CreditCard className="h-4 w-4 text-primary" />}
                    suffix="%"
                  />
                  <MetricCard
                    title="COD %"
                    value={metricsData.paymentMix.codPercent.value}
                    icon={<Banknote className="h-4 w-4 text-green-600" />}
                    suffix="%"
                  />
                </div>
              </div>

              {/* Order Source / Type */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Order Source / Type</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Shopify Orders"
                    value={metricsData.orderSource.shopifyOrders.value}
                    icon={<ShoppingBag className={cn("h-4 w-4", ordersFilter === 'shopify' ? "text-primary-foreground" : "text-primary")} />}
                    isActive={ordersFilter === 'shopify'}
                    onClick={() => handleOrdersCardClick('shopify')}
                  />
                  <MetricCard
                    title="Medusa Orders"
                    value={metricsData.orderSource.medusaOrders.value}
                    icon={<Database className={cn("h-4 w-4", ordersFilter === 'medusa' ? "text-primary-foreground" : "text-purple-600")} />}
                    isActive={ordersFilter === 'medusa'}
                    onClick={() => handleOrdersCardClick('medusa')}
                  />
                  <MetricCard
                    title="Clone (Manual)"
                    value={metricsData.orderSource.cloneManual.value}
                    icon={<Copy className={cn("h-4 w-4", ordersFilter === 'cloneManual' ? "text-primary-foreground" : "text-amber-600")} />}
                    isActive={ordersFilter === 'cloneManual'}
                    onClick={() => handleOrdersCardClick('cloneManual')}
                  />
                  <MetricCard
                    title="Clone (System)"
                    value={metricsData.orderSource.cloneSystem.value}
                    icon={<Settings className={cn("h-4 w-4", ordersFilter === 'cloneSystem' ? "text-primary-foreground" : "text-muted-foreground")} />}
                    isActive={ordersFilter === 'cloneSystem'}
                    onClick={() => handleOrdersCardClick('cloneSystem')}
                  />
                </div>
              </div>
            </div>

            {/* Filtered Orders Listing */}
            {ordersFilter && (
              <OrdersListing 
                filter={ordersFilter} 
                onClearFilter={() => setOrdersFilter(null)} 
              />
            )}
          </>
        ) : (
          <>
            {/* Logistics Dashboard */}
            {/* Line Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Logistics Trends</CardTitle>
                <Select value={logisticsSelectedMetric} onValueChange={setLogisticsSelectedMetric}>
                  <SelectTrigger className="w-[180px] h-8 text-sm">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {logisticsMetricOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardHeader>
              <CardContent>
                <ChartContainer config={lineChartConfig} className="h-[300px] w-full">
                  <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis 
                      dataKey="date" 
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <YAxis 
                      tick={{ fontSize: 11 }}
                      tickLine={false}
                      axisLine={false}
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey={currentLogisticsMetric.dataKey}
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

            {/* Helper Text */}
            <p className="text-xs text-muted-foreground">Click any metric card to view filtered orders</p>

            {/* Logistics Metric Cards */}
            <div className="space-y-5">
              {/* Main Logistics Metrics */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Logistics Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Total Orders"
                    value={logisticsMetricsData.main.totalOrders.value}
                    icon={<Package className={cn("h-4 w-4", logisticsFilter === 'totalOrders' ? "text-primary-foreground" : "text-primary")} />}
                    isActive={logisticsFilter === 'totalOrders'}
                    onClick={() => handleLogisticsCardClick('totalOrders')}
                  />
                  <MetricCard
                    title="Orders Delivered"
                    value={logisticsMetricsData.main.ordersDelivered.value}
                    icon={<CheckCircle2 className={cn("h-4 w-4", logisticsFilter === 'ordersDelivered' ? "text-primary-foreground" : "text-green-600")} />}
                    isActive={logisticsFilter === 'ordersDelivered'}
                    onClick={() => handleLogisticsCardClick('ordersDelivered')}
                  />
                  <MetricCard
                    title="Total Returns"
                    value={logisticsMetricsData.main.totalReturns.value}
                    icon={<RotateCcw className={cn("h-4 w-4", logisticsFilter === 'totalReturns' ? "text-primary-foreground" : "text-purple-600")} />}
                    isActive={logisticsFilter === 'totalReturns'}
                    onClick={() => handleLogisticsCardClick('totalReturns')}
                  />
                  <MetricCard
                    title="Returns Delivered"
                    value={logisticsMetricsData.main.returnsDelivered.value}
                    icon={<Truck className={cn("h-4 w-4", logisticsFilter === 'returnsDelivered' ? "text-primary-foreground" : "text-teal-600")} />}
                    isActive={logisticsFilter === 'returnsDelivered'}
                    onClick={() => handleLogisticsCardClick('returnsDelivered')}
                  />
                </div>
              </div>

              {/* Cancellations, Replacements, NDR */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Exceptions</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <MetricCard
                    title="Total Cancellations"
                    value={logisticsMetricsData.main.totalCancellations.value}
                    icon={<XCircle className={cn("h-4 w-4", logisticsFilter === 'totalCancellations' ? "text-primary-foreground" : "text-red-600")} />}
                    isActive={logisticsFilter === 'totalCancellations'}
                    onClick={() => handleLogisticsCardClick('totalCancellations')}
                  />
                  <MetricCard
                    title="Total Replacements"
                    value={logisticsMetricsData.main.totalReplacements.value}
                    icon={<RefreshCw className={cn("h-4 w-4", logisticsFilter === 'totalReplacements' ? "text-primary-foreground" : "text-blue-600")} />}
                    isActive={logisticsFilter === 'totalReplacements'}
                    onClick={() => handleLogisticsCardClick('totalReplacements')}
                  />
                  <MetricCard
                    title="NDR Orders"
                    value={logisticsMetricsData.main.ndrOrders.value}
                    icon={<AlertTriangle className={cn("h-4 w-4", logisticsFilter === 'ndrOrders' ? "text-primary-foreground" : "text-orange-600")} />}
                    isActive={logisticsFilter === 'ndrOrders'}
                    onClick={() => handleLogisticsCardClick('ndrOrders')}
                  />
                </div>
              </div>

              {/* Replacement Split */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Replacement Split</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <MetricCard
                    title="Cancellation Replacement"
                    value={logisticsMetricsData.replacementSplit.cancellationReplacement.value}
                    icon={<XCircle className={cn("h-4 w-4", logisticsFilter === 'cancellationReplacement' ? "text-primary-foreground" : "text-red-500")} />}
                    isActive={logisticsFilter === 'cancellationReplacement'}
                    onClick={() => handleLogisticsCardClick('cancellationReplacement')}
                  />
                  <MetricCard
                    title="RTO Replacement"
                    value={logisticsMetricsData.replacementSplit.rtoReplacement.value}
                    icon={<RotateCcw className={cn("h-4 w-4", logisticsFilter === 'rtoReplacement' ? "text-primary-foreground" : "text-amber-500")} />}
                    isActive={logisticsFilter === 'rtoReplacement'}
                    onClick={() => handleLogisticsCardClick('rtoReplacement')}
                  />
                  <MetricCard
                    title="Delivered Replacement"
                    value={logisticsMetricsData.replacementSplit.deliveredReplacement.value}
                    icon={<CheckCircle2 className={cn("h-4 w-4", logisticsFilter === 'deliveredReplacement' ? "text-primary-foreground" : "text-green-500")} />}
                    isActive={logisticsFilter === 'deliveredReplacement'}
                    onClick={() => handleLogisticsCardClick('deliveredReplacement')}
                  />
                </div>
              </div>
            </div>

            {/* Filtered Orders Listing */}
            {logisticsFilter && (
              <OrdersListing 
                filter={logisticsFilter} 
                onClearFilter={() => setLogisticsFilter(null)} 
              />
            )}
          </>
        )}
      </div>
    </AppLayout>
  );
}
