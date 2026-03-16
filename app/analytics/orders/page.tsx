"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarIcon, Package, CheckCircle2, IndianRupee, CreditCard, Banknote, ShoppingBag, Database, Copy, Settings, Info, XCircle, Truck, RotateCcw, AlertTriangle, RefreshCw, Clock, FileText } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';
import { cn } from '@/lib/utils';

// Dashboard tabs
type DashboardTab = 'orders' | 'logistics' | 'finance';

// INR Currency formatter
const formatINR = (value: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(value);
};

// Mock data for the line chart
const generateMockChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      totalOrders: Math.floor(Math.random() * 150) + 80,
      deliveredOrders: Math.floor(Math.random() * 100) + 50,
      totalRevenue: Math.floor(Math.random() * 500000) + 200000,
      netRevenue: Math.floor(Math.random() * 450000) + 180000,
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
      // Finance metrics
      refundRequests: Math.floor(Math.random() * 50) + 20,
      refundValueRequested: Math.floor(Math.random() * 100000) + 50000,
      pendingRefundRequests: Math.floor(Math.random() * 30) + 10,
      refundsProcessed: Math.floor(Math.random() * 40) + 15,
      refundValueProcessed: Math.floor(Math.random() * 80000) + 40000,
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
  refundRequests: { label: 'Refund Requests', color: 'var(--chart-1)' },
  refundValueRequested: { label: 'Refund Value Requested', color: 'var(--chart-2)' },
  pendingRefundRequests: { label: 'Pending Refund Requests', color: 'var(--chart-3)' },
  refundsProcessed: { label: 'Refunds Processed', color: 'var(--chart-4)' },
  refundValueProcessed: { label: 'Refund Value Processed', color: 'var(--chart-1)' },
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

const financeMetricOptions: MetricOption[] = [
  { value: 'refundRequests', label: 'Refund Requests', dataKey: 'refundRequests' },
  { value: 'refundValueRequested', label: 'Refund Value Requested', dataKey: 'refundValueRequested' },
  { value: 'pendingRefundRequests', label: 'Pending Refund Requests', dataKey: 'pendingRefundRequests' },
  { value: 'refundsProcessed', label: 'Refunds Processed', dataKey: 'refundsProcessed' },
  { value: 'refundValueProcessed', label: 'Refund Value Processed', dataKey: 'refundValueProcessed' },
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
  // Finance tooltips
  'Refund Requests': 'Total number of refund requests received',
  'Refund Value Requested': 'Total monetary value of refund requests',
  'Pending Refund Requests': 'Refund requests awaiting processing',
  'Refunds Processed': 'Number of refunds successfully processed',
  'Refund Value Processed': 'Total monetary value of processed refunds',
};

// Filter query params mapping for navigation
const filterQueryParams: Record<string, string> = {
  // Orders filters
  total: 'status=all',
  delivered: 'status=Delivered',
  totalRevenue: 'status=all',
  netRevenue: 'status=all',
  prepaid: 'paymentMethod=Prepaid',
  cod: 'paymentMethod=COD',
  shopify: 'orderType=Shopify',
  medusa: 'orderType=Medusa',
  cloneManual: 'orderType=Clone%20(Manual)',
  cloneSystem: 'orderType=Clone%20(System)',
  // Logistics filters
  totalOrders: 'status=all',
  ordersDelivered: 'status=Delivered',
  totalReturns: 'status=Returned',
  returnsDelivered: 'status=Returns%20Delivered',
  totalCancellations: 'status=Cancelled',
  totalReplacements: 'status=Replacement',
  ndrOrders: 'status=NDR',
  cancellationReplacement: 'status=Cancellation%20-%20Replacement%20Created',
  rtoReplacement: 'status=RTO%20-%20Replacement%20Created',
  deliveredReplacement: 'status=Delivered%20-%20Replacement%20Created',
  // Finance filters
  refundRequests: 'refundStatus=Requested',
  refundValueRequested: 'refundStatus=Requested',
  pendingRefundRequests: 'refundStatus=Pending',
  refundsProcessed: 'refundStatus=Processed',
  refundValueProcessed: 'refundStatus=Processed',
};

// Mock metrics data
const metricsData = {
  coreOrderVolume: {
    totalOrders: { value: 3688 },
    deliveredOrders: { value: 2890 },
    totalRevenue: { value: 8924500 },
    netRevenue: { value: 8453200 },
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

// Finance metrics data
const financeMetricsData = {
  refundRequests: { value: 156 },
  refundValueRequested: { value: 456780 },
  pendingRefundRequests: { value: 42 },
  refundsProcessed: { value: 114 },
  refundValueProcessed: { value: 378450 },
};

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
  prefix?: string;
  isCurrency?: boolean;
  onClick?: () => void;
}

function MetricCard({ title, value, icon, suffix = '', prefix = '', isCurrency = false, onClick }: MetricCardProps) {
  const tooltipText = metricTooltips[title] || '';
  
  const displayValue = isCurrency && typeof value === 'number' 
    ? formatINR(value) 
    : `${prefix}${typeof value === 'number' ? value.toLocaleString('en-IN') : value}${suffix}`;
  
  return (
    <Card 
      className={cn(
        "py-3 transition-all duration-200 cursor-pointer",
        "hover:shadow-md hover:border-primary/30"
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
              {displayValue}
            </p>
          </div>
          <div className="h-9 w-9 rounded-lg flex items-center justify-center flex-shrink-0 bg-primary/10">
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default function OrderAnalyticsPage() {
  const { isLoading } = useAuthGuard();
  const router = useRouter();
  const [dateRange, setDateRange] = useState<DateRange | undefined>({
    from: subDays(new Date(), 30),
    to: new Date(),
  });
  const [ordersSelectedMetric, setOrdersSelectedMetric] = useState<string>('total');
  const [logisticsSelectedMetric, setLogisticsSelectedMetric] = useState<string>('ordersDelivered');
  const [financeSelectedMetric, setFinanceSelectedMetric] = useState<string>('refundRequests');
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const currentOrdersMetric = ordersMetricOptions.find(m => m.value === ordersSelectedMetric) || ordersMetricOptions[0];
  const currentLogisticsMetric = logisticsMetricOptions.find(m => m.value === logisticsSelectedMetric) || logisticsMetricOptions[0];
  const currentFinanceMetric = financeMetricOptions.find(m => m.value === financeSelectedMetric) || financeMetricOptions[0];

  // Navigate to Order Listing with filter
  const handleCardClick = (filterKey: string) => {
    const queryParam = filterQueryParams[filterKey] || 'status=all';
    router.push(`/analytics/listing?${queryParam}`);
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
              onClick={() => setActiveTab('orders')}
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
              onClick={() => setActiveTab('logistics')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeTab === 'logistics'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Logistics
            </button>
            <button
              onClick={() => setActiveTab('finance')}
              className={cn(
                'px-4 py-1.5 text-sm font-medium rounded-md transition-colors',
                activeTab === 'finance'
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              Finance
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
        {activeTab === 'orders' && (
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
                      tickFormatter={(value) => 
                        currentOrdersMetric.dataKey.includes('Revenue') 
                          ? `₹${(value / 1000).toFixed(0)}k` 
                          : value
                      }
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
            <p className="text-xs text-muted-foreground">Click any metric card to view filtered orders in Order Listing</p>

            {/* Metric Cards Section */}
            <div className="space-y-5">
              {/* Core Order Volume */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Core Order Volume</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Total Orders"
                    value={metricsData.coreOrderVolume.totalOrders.value}
                    icon={<Package className="h-4 w-4 text-primary" />}
                    onClick={() => handleCardClick('total')}
                  />
                  <MetricCard
                    title="Delivered Orders"
                    value={metricsData.coreOrderVolume.deliveredOrders.value}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                    onClick={() => handleCardClick('delivered')}
                  />
                  <MetricCard
                    title="Total Revenue"
                    value={metricsData.coreOrderVolume.totalRevenue.value}
                    icon={<IndianRupee className="h-4 w-4 text-primary" />}
                    isCurrency
                    onClick={() => handleCardClick('totalRevenue')}
                  />
                  <MetricCard
                    title="Net Revenue"
                    value={metricsData.coreOrderVolume.netRevenue.value}
                    icon={<IndianRupee className="h-4 w-4 text-green-600" />}
                    isCurrency
                    onClick={() => handleCardClick('netRevenue')}
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
                    icon={<CreditCard className="h-4 w-4 text-primary" />}
                    onClick={() => handleCardClick('prepaid')}
                  />
                  <MetricCard
                    title="COD Orders"
                    value={metricsData.paymentMix.codOrders.value}
                    icon={<Banknote className="h-4 w-4 text-green-600" />}
                    onClick={() => handleCardClick('cod')}
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
                    icon={<ShoppingBag className="h-4 w-4 text-primary" />}
                    onClick={() => handleCardClick('shopify')}
                  />
                  <MetricCard
                    title="Medusa Orders"
                    value={metricsData.orderSource.medusaOrders.value}
                    icon={<Database className="h-4 w-4 text-purple-600" />}
                    onClick={() => handleCardClick('medusa')}
                  />
                  <MetricCard
                    title="Clone (Manual)"
                    value={metricsData.orderSource.cloneManual.value}
                    icon={<Copy className="h-4 w-4 text-amber-600" />}
                    onClick={() => handleCardClick('cloneManual')}
                  />
                  <MetricCard
                    title="Clone (System)"
                    value={metricsData.orderSource.cloneSystem.value}
                    icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                    onClick={() => handleCardClick('cloneSystem')}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'logistics' && (
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
            <p className="text-xs text-muted-foreground">Click any metric card to view filtered orders in Order Listing</p>

            {/* Logistics Metric Cards */}
            <div className="space-y-5">
              {/* Main Logistics Metrics */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Logistics Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  <MetricCard
                    title="Total Orders"
                    value={logisticsMetricsData.main.totalOrders.value}
                    icon={<Package className="h-4 w-4 text-primary" />}
                    onClick={() => handleCardClick('totalOrders')}
                  />
                  <MetricCard
                    title="Orders Delivered"
                    value={logisticsMetricsData.main.ordersDelivered.value}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                    onClick={() => handleCardClick('ordersDelivered')}
                  />
                  <MetricCard
                    title="Total Returns"
                    value={logisticsMetricsData.main.totalReturns.value}
                    icon={<RotateCcw className="h-4 w-4 text-purple-600" />}
                    onClick={() => handleCardClick('totalReturns')}
                  />
                  <MetricCard
                    title="Returns Delivered"
                    value={logisticsMetricsData.main.returnsDelivered.value}
                    icon={<Truck className="h-4 w-4 text-teal-600" />}
                    onClick={() => handleCardClick('returnsDelivered')}
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
                    icon={<XCircle className="h-4 w-4 text-red-600" />}
                    onClick={() => handleCardClick('totalCancellations')}
                  />
                  <MetricCard
                    title="Total Replacements"
                    value={logisticsMetricsData.main.totalReplacements.value}
                    icon={<RefreshCw className="h-4 w-4 text-blue-600" />}
                    onClick={() => handleCardClick('totalReplacements')}
                  />
                  <MetricCard
                    title="NDR Orders"
                    value={logisticsMetricsData.main.ndrOrders.value}
                    icon={<AlertTriangle className="h-4 w-4 text-orange-600" />}
                    onClick={() => handleCardClick('ndrOrders')}
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
                    icon={<XCircle className="h-4 w-4 text-red-500" />}
                    onClick={() => handleCardClick('cancellationReplacement')}
                  />
                  <MetricCard
                    title="RTO Replacement"
                    value={logisticsMetricsData.replacementSplit.rtoReplacement.value}
                    icon={<RotateCcw className="h-4 w-4 text-amber-500" />}
                    onClick={() => handleCardClick('rtoReplacement')}
                  />
                  <MetricCard
                    title="Delivered Replacement"
                    value={logisticsMetricsData.replacementSplit.deliveredReplacement.value}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-500" />}
                    onClick={() => handleCardClick('deliveredReplacement')}
                  />
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'finance' && (
          <>
            {/* Finance Dashboard */}
            {/* Line Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Finance Trends</CardTitle>
                <Select value={financeSelectedMetric} onValueChange={setFinanceSelectedMetric}>
                  <SelectTrigger className="w-[200px] h-8 text-sm">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {financeMetricOptions.map((option) => (
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
                      tickFormatter={(value) => 
                        currentFinanceMetric.dataKey.includes('Value') 
                          ? `₹${(value / 1000).toFixed(0)}k` 
                          : value
                      }
                    />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line
                      type="monotone"
                      dataKey={currentFinanceMetric.dataKey}
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
            <p className="text-xs text-muted-foreground">Click any metric card to view filtered orders in Order Listing</p>

            {/* Finance Metric Cards */}
            <div className="space-y-5">
              {/* Refund Metrics */}
              <div>
                <h3 className="text-sm font-semibold text-foreground mb-3">Refund Overview</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
                  <MetricCard
                    title="Refund Requests"
                    value={financeMetricsData.refundRequests.value}
                    icon={<FileText className="h-4 w-4 text-primary" />}
                    onClick={() => handleCardClick('refundRequests')}
                  />
                  <MetricCard
                    title="Refund Value Requested"
                    value={financeMetricsData.refundValueRequested.value}
                    icon={<IndianRupee className="h-4 w-4 text-primary" />}
                    isCurrency
                    onClick={() => handleCardClick('refundValueRequested')}
                  />
                  <MetricCard
                    title="Pending Refund Requests"
                    value={financeMetricsData.pendingRefundRequests.value}
                    icon={<Clock className="h-4 w-4 text-amber-600" />}
                    onClick={() => handleCardClick('pendingRefundRequests')}
                  />
                  <MetricCard
                    title="Refunds Processed"
                    value={financeMetricsData.refundsProcessed.value}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                    onClick={() => handleCardClick('refundsProcessed')}
                  />
                  <MetricCard
                    title="Refund Value Processed"
                    value={financeMetricsData.refundValueProcessed.value}
                    icon={<IndianRupee className="h-4 w-4 text-green-600" />}
                    isCurrency
                    onClick={() => handleCardClick('refundValueProcessed')}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </AppLayout>
  );
}
