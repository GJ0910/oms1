"use client";

import { useState } from "react";
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarIcon, Package, CheckCircle2, DollarSign, CreditCard, Banknote, ShoppingBag, Database, Copy, Settings, Info } from 'lucide-react';
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
};

type MetricOption = {
  value: string;
  label: string;
  dataKey: keyof typeof chartData[0];
};

const metricOptions: MetricOption[] = [
  { value: 'total', label: 'Total Orders', dataKey: 'totalOrders' },
  { value: 'delivered', label: 'Delivered Orders', dataKey: 'deliveredOrders' },
  { value: 'totalRevenue', label: 'Total Revenue', dataKey: 'totalRevenue' },
  { value: 'netRevenue', label: 'Net Revenue', dataKey: 'netRevenue' },
  { value: 'prepaid', label: 'Prepaid Orders', dataKey: 'prepaidOrders' },
  { value: 'cod', label: 'COD Orders', dataKey: 'codOrders' },
  { value: 'shopify', label: 'Shopify Orders', dataKey: 'shopifyOrders' },
  { value: 'clone', label: 'Clone Orders', dataKey: 'cloneOrders' },
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
};

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

interface MetricCardProps {
  title: string;
  value: string | number;
  icon: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

function MetricCard({ title, value, icon, suffix = '', prefix = '' }: MetricCardProps) {
  const tooltipText = metricTooltips[title] || '';
  
  return (
    <Card className="py-3">
      <CardContent className="px-4 py-0">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <p className="text-sm text-muted-foreground truncate">{title}</p>
              <Tooltip>
                <TooltipTrigger asChild>
                  <button className="text-muted-foreground/60 hover:text-muted-foreground transition-colors">
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
          <div className="h-9 w-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            {icon}
          </div>
        </div>
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
  const [selectedMetric, setSelectedMetric] = useState<string>('total');
  const [activeTab, setActiveTab] = useState<DashboardTab>('orders');

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const currentMetric = metricOptions.find(m => m.value === selectedMetric) || metricOptions[0];

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
        {activeTab === 'orders' ? (
          <>
            {/* Line Chart */}
            <Card>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-base font-semibold">Order Trends</CardTitle>
                <Select value={selectedMetric} onValueChange={setSelectedMetric}>
                  <SelectTrigger className="w-[160px] h-8 text-sm">
                    <SelectValue placeholder="Select metric" />
                  </SelectTrigger>
                  <SelectContent>
                    {metricOptions.map((option) => (
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
                      dataKey={currentMetric.dataKey}
                      stroke="var(--color-chart-1)"
                      strokeWidth={2}
                      dot={false}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  </LineChart>
                </ChartContainer>
              </CardContent>
            </Card>

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
                  />
                  <MetricCard
                    title="Delivered Orders"
                    value={metricsData.coreOrderVolume.deliveredOrders.value}
                    icon={<CheckCircle2 className="h-4 w-4 text-green-600" />}
                  />
                  <MetricCard
                    title="Total Revenue"
                    value={metricsData.coreOrderVolume.totalRevenue.value}
                    icon={<DollarSign className="h-4 w-4 text-primary" />}
                    prefix="$"
                  />
                  <MetricCard
                    title="Net Revenue"
                    value={metricsData.coreOrderVolume.netRevenue.value}
                    icon={<DollarSign className="h-4 w-4 text-green-600" />}
                    prefix="$"
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
                  />
                  <MetricCard
                    title="COD Orders"
                    value={metricsData.paymentMix.codOrders.value}
                    icon={<Banknote className="h-4 w-4 text-green-600" />}
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
                  />
                  <MetricCard
                    title="Medusa Orders"
                    value={metricsData.orderSource.medusaOrders.value}
                    icon={<Database className="h-4 w-4 text-purple-600" />}
                  />
                  <MetricCard
                    title="Clone (Manual)"
                    value={metricsData.orderSource.cloneManual.value}
                    icon={<Copy className="h-4 w-4 text-amber-600" />}
                  />
                  <MetricCard
                    title="Clone (System)"
                    value={metricsData.orderSource.cloneSystem.value}
                    icon={<Settings className="h-4 w-4 text-muted-foreground" />}
                  />
                </div>
              </div>
            </div>
          </>
        ) : activeTab === 'logistics' ? (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <Package className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Logistics Analytics</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Logistics analytics dashboard coming soon. Track shipment performance, delivery times, and carrier metrics.
              </p>
            </CardContent>
          </Card>
        ) : (
          <Card className="py-16">
            <CardContent className="flex flex-col items-center justify-center text-center">
              <div className="h-12 w-12 rounded-full bg-muted flex items-center justify-center mb-4">
                <DollarSign className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Finance Analytics</h3>
              <p className="text-sm text-muted-foreground max-w-md">
                Finance analytics dashboard coming soon. Track revenue, costs, margins, and financial performance.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </AppLayout>
  );
}
