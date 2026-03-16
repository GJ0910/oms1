'use client';

import { useState } from 'react';
import { AppLayout } from '@/components/layout/AppLayout';
import { CalendarIcon, TrendingUp, TrendingDown, Package, CheckCircle2, XCircle, Clock, CreditCard, Banknote, ShoppingBag, Database, Copy, Settings } from 'lucide-react';
import { useAuthGuard } from '@/hooks/use-auth-guard';
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ChartContainer, ChartTooltip, ChartTooltipContent, ChartLegend, ChartLegendContent, type ChartConfig } from '@/components/ui/chart';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';
import type { DateRange } from 'react-day-picker';

// Mock data for the line chart
const generateMockChartData = () => {
  const data = [];
  for (let i = 29; i >= 0; i--) {
    const date = subDays(new Date(), i);
    data.push({
      date: format(date, 'MMM dd'),
      totalOrders: Math.floor(Math.random() * 150) + 80,
      deliveredOrders: Math.floor(Math.random() * 100) + 50,
      cancelledOrders: Math.floor(Math.random() * 20) + 5,
      prepaidOrders: Math.floor(Math.random() * 80) + 40,
      codOrders: Math.floor(Math.random() * 70) + 30,
      shopifyOrders: Math.floor(Math.random() * 90) + 50,
      cloneOrders: Math.floor(Math.random() * 30) + 10,
    });
  }
  return data;
};

const chartData = generateMockChartData();

// Mock data for donut chart
const orderSourceData = [
  { name: 'Shopify', value: 2456, fill: 'var(--color-chart-1)' },
  { name: 'Medusa', value: 842, fill: 'var(--color-chart-2)' },
  { name: 'Clone Manual', value: 234, fill: 'var(--color-chart-3)' },
  { name: 'Clone System', value: 156, fill: 'var(--color-chart-4)' },
];

const lineChartConfig: ChartConfig = {
  totalOrders: { label: 'Total Orders', color: 'var(--chart-1)' },
  deliveredOrders: { label: 'Delivered Orders', color: 'var(--chart-3)' },
  cancelledOrders: { label: 'Cancelled Orders', color: 'var(--chart-5)' },
  prepaidOrders: { label: 'Prepaid Orders', color: 'var(--chart-2)' },
  codOrders: { label: 'COD Orders', color: 'var(--chart-4)' },
  shopifyOrders: { label: 'Shopify Orders', color: 'var(--chart-1)' },
  cloneOrders: { label: 'Clone Orders', color: 'var(--chart-3)' },
};

const donutChartConfig: ChartConfig = {
  shopify: { label: 'Shopify', color: 'var(--chart-1)' },
  medusa: { label: 'Medusa', color: 'var(--chart-2)' },
  cloneManual: { label: 'Clone Manual', color: 'var(--chart-3)' },
  cloneSystem: { label: 'Clone System', color: 'var(--chart-4)' },
};

type MetricOption = {
  value: string;
  label: string;
  dataKey: keyof typeof chartData[0];
};

const metricOptions: MetricOption[] = [
  { value: 'total', label: 'Total Orders', dataKey: 'totalOrders' },
  { value: 'delivered', label: 'Delivered Orders', dataKey: 'deliveredOrders' },
  { value: 'cancelled', label: 'Cancelled Orders', dataKey: 'cancelledOrders' },
  { value: 'prepaid', label: 'Prepaid Orders', dataKey: 'prepaidOrders' },
  { value: 'cod', label: 'COD Orders', dataKey: 'codOrders' },
  { value: 'shopify', label: 'Shopify Orders', dataKey: 'shopifyOrders' },
  { value: 'clone', label: 'Clone Orders', dataKey: 'cloneOrders' },
];

// Mock metrics data
const metricsData = {
  coreOrderVolume: {
    totalOrders: { value: 3688, change: 12.5, trend: 'up' as const },
    deliveredOrders: { value: 2890, change: 8.3, trend: 'up' as const },
    cancelledOrders: { value: 234, change: -5.2, trend: 'down' as const },
    ordersInProgress: { value: 564, change: 3.1, trend: 'up' as const },
  },
  paymentMix: {
    prepaidOrders: { value: 2156, change: 15.2, trend: 'up' as const },
    codOrders: { value: 1532, change: 4.8, trend: 'up' as const },
    prepaidPercent: { value: 58.5, change: 2.3, trend: 'up' as const },
    codPercent: { value: 41.5, change: -2.3, trend: 'down' as const },
  },
  orderSource: {
    shopifyOrders: { value: 2456, change: 10.2, trend: 'up' as const },
    medusaOrders: { value: 842, change: 22.5, trend: 'up' as const },
    cloneManual: { value: 234, change: -3.1, trend: 'down' as const },
    cloneSystem: { value: 156, change: 5.8, trend: 'up' as const },
  },
};

interface MetricCardProps {
  title: string;
  value: string | number;
  change: number;
  trend: 'up' | 'down';
  icon: React.ReactNode;
  suffix?: string;
}

function MetricCard({ title, value, change, trend, icon, suffix = '' }: MetricCardProps) {
  const isPositive = trend === 'up';
  const changeColor = isPositive ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400';
  
  return (
    <Card className="py-4">
      <CardContent className="px-4 py-0">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm text-muted-foreground">{title}</p>
            <p className="text-2xl font-bold text-foreground mt-1">
              {typeof value === 'number' ? value.toLocaleString() : value}{suffix}
            </p>
            <div className={`flex items-center gap-1 mt-1 text-xs ${changeColor}`}>
              {isPositive ? (
                <TrendingUp className="h-3 w-3" />
              ) : (
                <TrendingDown className="h-3 w-3" />
              )}
              <span>{Math.abs(change)}% vs last period</span>
            </div>
          </div>
          <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
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

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Spinner className="h-8 w-8 text-primary" />
      </div>
    );
  }

  const currentMetric = metricOptions.find(m => m.value === selectedMetric) || metricOptions[0];
  const totalOrdersInSource = orderSourceData.reduce((acc, item) => acc + item.value, 0);

  return (
    <AppLayout
      headerTitle="Order Analytics"
      breadcrumbs={[{ label: 'Analytics', href: '/analytics' }, { label: 'Order Analytics' }]}
    >
      <div className="space-y-6">
        {/* Date Range Selector */}
        <div className="flex justify-end">
          <Popover>
            <PopoverTrigger asChild>
              <Button variant="outline" className="w-[280px] justify-start text-left font-normal">
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

        {/* Line Chart */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-lg font-semibold">Order Trends</CardTitle>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[180px]">
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
            <ChartContainer config={lineChartConfig} className="h-[350px] w-full">
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="date" 
                  tick={{ fontSize: 12 }}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
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
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Metric Cards Section */}
        <div className="space-y-6">
          {/* Core Order Volume */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Core Order Volume</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Total Orders"
                value={metricsData.coreOrderVolume.totalOrders.value}
                change={metricsData.coreOrderVolume.totalOrders.change}
                trend={metricsData.coreOrderVolume.totalOrders.trend}
                icon={<Package className="h-5 w-5 text-primary" />}
              />
              <MetricCard
                title="Delivered Orders"
                value={metricsData.coreOrderVolume.deliveredOrders.value}
                change={metricsData.coreOrderVolume.deliveredOrders.change}
                trend={metricsData.coreOrderVolume.deliveredOrders.trend}
                icon={<CheckCircle2 className="h-5 w-5 text-green-600" />}
              />
              <MetricCard
                title="Cancelled Orders"
                value={metricsData.coreOrderVolume.cancelledOrders.value}
                change={metricsData.coreOrderVolume.cancelledOrders.change}
                trend={metricsData.coreOrderVolume.cancelledOrders.trend}
                icon={<XCircle className="h-5 w-5 text-red-600" />}
              />
              <MetricCard
                title="Orders In Progress"
                value={metricsData.coreOrderVolume.ordersInProgress.value}
                change={metricsData.coreOrderVolume.ordersInProgress.change}
                trend={metricsData.coreOrderVolume.ordersInProgress.trend}
                icon={<Clock className="h-5 w-5 text-amber-600" />}
              />
            </div>
          </div>

          {/* Payment Mix */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Payment Mix</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Prepaid Orders"
                value={metricsData.paymentMix.prepaidOrders.value}
                change={metricsData.paymentMix.prepaidOrders.change}
                trend={metricsData.paymentMix.prepaidOrders.trend}
                icon={<CreditCard className="h-5 w-5 text-primary" />}
              />
              <MetricCard
                title="COD Orders"
                value={metricsData.paymentMix.codOrders.value}
                change={metricsData.paymentMix.codOrders.change}
                trend={metricsData.paymentMix.codOrders.trend}
                icon={<Banknote className="h-5 w-5 text-green-600" />}
              />
              <MetricCard
                title="Prepaid %"
                value={metricsData.paymentMix.prepaidPercent.value}
                change={metricsData.paymentMix.prepaidPercent.change}
                trend={metricsData.paymentMix.prepaidPercent.trend}
                icon={<CreditCard className="h-5 w-5 text-primary" />}
                suffix="%"
              />
              <MetricCard
                title="COD %"
                value={metricsData.paymentMix.codPercent.value}
                change={metricsData.paymentMix.codPercent.change}
                trend={metricsData.paymentMix.codPercent.trend}
                icon={<Banknote className="h-5 w-5 text-green-600" />}
                suffix="%"
              />
            </div>
          </div>

          {/* Order Source / Type */}
          <div>
            <h3 className="text-base font-semibold text-foreground mb-4">Order Source / Type</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard
                title="Shopify Orders"
                value={metricsData.orderSource.shopifyOrders.value}
                change={metricsData.orderSource.shopifyOrders.change}
                trend={metricsData.orderSource.shopifyOrders.trend}
                icon={<ShoppingBag className="h-5 w-5 text-primary" />}
              />
              <MetricCard
                title="Medusa Orders"
                value={metricsData.orderSource.medusaOrders.value}
                change={metricsData.orderSource.medusaOrders.change}
                trend={metricsData.orderSource.medusaOrders.trend}
                icon={<Database className="h-5 w-5 text-purple-600" />}
              />
              <MetricCard
                title="Clone (Manual)"
                value={metricsData.orderSource.cloneManual.value}
                change={metricsData.orderSource.cloneManual.change}
                trend={metricsData.orderSource.cloneManual.trend}
                icon={<Copy className="h-5 w-5 text-amber-600" />}
              />
              <MetricCard
                title="Clone (System)"
                value={metricsData.orderSource.cloneSystem.value}
                change={metricsData.orderSource.cloneSystem.change}
                trend={metricsData.orderSource.cloneSystem.trend}
                icon={<Settings className="h-5 w-5 text-muted-foreground" />}
              />
            </div>
          </div>
        </div>

        {/* Donut Chart - Order Source Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Order Source Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col lg:flex-row items-center gap-8">
              <ChartContainer config={donutChartConfig} className="h-[300px] w-full max-w-[300px]">
                <PieChart>
                  <ChartTooltip 
                    content={
                      <ChartTooltipContent 
                        formatter={(value, name) => (
                          <div className="flex items-center justify-between gap-4">
                            <span>{name}</span>
                            <span className="font-mono font-medium">{value.toLocaleString()}</span>
                          </div>
                        )}
                      />
                    } 
                  />
                  <Pie
                    data={orderSourceData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    strokeWidth={2}
                    stroke="var(--background)"
                  >
                    {orderSourceData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                </PieChart>
              </ChartContainer>
              <div className="flex-1 space-y-4">
                {orderSourceData.map((item, index) => {
                  const percentage = ((item.value / totalOrdersInSource) * 100).toFixed(1);
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div 
                          className="h-3 w-3 rounded-full" 
                          style={{ backgroundColor: item.fill }}
                        />
                        <span className="text-sm text-foreground">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-foreground">{item.value.toLocaleString()}</span>
                        <span className="text-sm text-muted-foreground w-12 text-right">{percentage}%</span>
                      </div>
                    </div>
                  );
                })}
                <div className="border-t border-border pt-4 flex items-center justify-between">
                  <span className="text-sm font-medium text-foreground">Total</span>
                  <span className="text-sm font-bold text-foreground">{totalOrdersInSource.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
