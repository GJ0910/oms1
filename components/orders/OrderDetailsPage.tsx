'use client';

import { useState } from 'react';
import { Package, Truck, CheckCircle2, Clock } from 'lucide-react';
import { OrderOverviewCard } from './OrderOverviewCard';
import { CustomerDetailsCard } from './CustomerDetailsCard';
import { OrderFinancialsCard } from './OrderFinancialsCard';
import { ShippingDetailsCard } from './ShippingDetailsCard';
import { CloneDetailsCard } from './CloneDetailsCard';
import { DeliveryPaymentCard } from './DeliveryPaymentCard';
import { OrderTimelineCard } from './OrderTimelineCard';
import { RefundDetailsCard } from './RefundDetailsCard';
import { LogsRemarksCard } from './LogsRemarksCard';

interface OrderDetailsPageProps {
  orderId: string;
}

// Mock data for demo
const mockOrderData = {
  brand: 'Fitty',
  orderId: '#FT1230251-001',
  shopifyId: '#SH9876543210',
  orderType: 'Standard',
  orderStatus: 'delivered' as const,
  refundStatus: 'none' as const,
  paymentMethod: 'Credit Card (Visa)',

  // Customer
  customerName: 'Raj Kumar',
  customerEmail: 'rajkumar1990@example.com',
  customerPhone: '9876543210',

  // Logistics & Financials
  awb: 'AWB123456789',
  courierPartner: 'DHL Express',
  invoiceSummaryINR: 2485.50,
  products: [
    {
      id: 'prod-1',
      name: 'Fitty Pro Fitness Plan',
      quantity: 1,
      priceINR: 2500.0,
      discountINR: 14.5,
      finalPriceINR: 2485.5,
    },
    {
      id: 'prod-2',
      name: 'Fitty Premium Coaching',
      quantity: 0,
      priceINR: 0,
      discountINR: 0,
      finalPriceINR: 0,
    },
  ],

  // Shipping
  address: '123 Main Street, Apartment 4B',
  city: 'Bangalore',
  state: 'Karnataka',
  country: 'India',
  pincode: '560001',

  // Clone
  hasClone: true,
  cloneOrderId: '#FT1230251-002',
  cloneStatus: 'processing' as const,
  cloneReason: 'Customer requested plan upgrade',

  // Delivery & Payment
  deliveryDate: '2024-03-02',
  deliveryTime: '2:30 PM',
  paymentStatus: 'completed' as const,
  paymentDateTime: '2024-02-28 10:15 AM',

  // Timeline events
  timelineEvents: [
    {
      id: 'placed-1',
      title: 'Order Placed',
      timestamp: '2024-02-26 9:30 AM',
      description: 'Customer placed order through website',
    },
    {
      id: 'shipped-1',
      title: 'Order Shipped',
      timestamp: '2024-02-28 11:00 AM',
      description: 'Package picked up by DHL Express',
    },
    {
      id: 'delivered-1',
      title: 'Order Delivered',
      timestamp: '2024-03-02 2:30 PM',
      description: 'Delivered to customer address',
    },
  ],

  // Refund (only shown if applicable)
  showRefund: true,
  refundUTR: 'UTR20240305001',
  refundProcessedDateTime: '2024-03-05 3:45 PM',

  // Logs
  logs: [
    {
      id: 'log-1',
      title: 'Order Confirmed',
      source: 'System',
      timestamp: '2024-02-26 9:35 AM',
      description: 'Order confirmation sent to customer',
    },
    {
      id: 'log-2',
      title: 'Payment Received',
      source: 'Payment Gateway',
      timestamp: '2024-02-28 10:15 AM',
      description: 'Payment processed successfully',
    },
    {
      id: 'log-3',
      title: 'Admin Note',
      source: 'Admin (John Doe)',
      timestamp: '2024-03-01 2:00 PM',
      description: 'Customer called regarding delivery schedule',
    },
  ],
};

export function OrderDetailsPage({ orderId }: OrderDetailsPageProps) {
  const [logs, setLogs] = useState(mockOrderData.logs);

  const handleAddRemark = (remark: string) => {
    const now = new Date();
    const timestamp = now.toLocaleString('en-IN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });

    const newLog = {
      id: `log-${logs.length + 1}`,
      title: 'Admin Remark',
      source: 'Admin (Current User)',
      timestamp,
      description: remark,
    };

    setLogs([...logs, newLog]);
  };

  return (
    <div className="space-y-6">
      {/* Order Overview */}
      <OrderOverviewCard
        brand={mockOrderData.brand}
        orderId={mockOrderData.orderId}
        shopifyId={mockOrderData.shopifyId}
        orderType={mockOrderData.orderType}
        orderStatus={mockOrderData.orderStatus}
        refundStatus={mockOrderData.refundStatus}
        paymentMethod={mockOrderData.paymentMethod}
      />

      {/* Customer Details */}
      <CustomerDetailsCard
        name={mockOrderData.customerName}
        email={mockOrderData.customerEmail}
        phone={mockOrderData.customerPhone}
      />

      {/* Order Financials & Logistics */}
      <OrderFinancialsCard
        awb={mockOrderData.awb}
        courierPartner={mockOrderData.courierPartner}
        invoiceSummaryINR={mockOrderData.invoiceSummaryINR}
        products={mockOrderData.products}
      />

      {/* Shipping Details */}
      <ShippingDetailsCard
        address={mockOrderData.address}
        city={mockOrderData.city}
        state={mockOrderData.state}
        country={mockOrderData.country}
        pincode={mockOrderData.pincode}
      />

      {/* Clone Details */}
      <CloneDetailsCard
        hasClone={mockOrderData.hasClone}
        cloneOrderId={mockOrderData.cloneOrderId}
        cloneStatus={mockOrderData.cloneStatus}
        cloneReason={mockOrderData.cloneReason}
      />

      {/* Delivery & Payment */}
      <DeliveryPaymentCard
        deliveryDate={mockOrderData.deliveryDate}
        deliveryTime={mockOrderData.deliveryTime}
        paymentStatus={mockOrderData.paymentStatus}
        paymentDateTime={mockOrderData.paymentDateTime}
      />

      {/* Order Timeline */}
      <OrderTimelineCard events={mockOrderData.timelineEvents} />

      {/* Refund Details - Conditional */}
      {mockOrderData.showRefund && (
        <RefundDetailsCard
          refundUTR={mockOrderData.refundUTR}
          refundProcessedDateTime={mockOrderData.refundProcessedDateTime}
        />
      )}

      {/* Logs & Remarks */}
      <LogsRemarksCard logs={logs} onAddRemark={handleAddRemark} />
    </div>
  );
}
