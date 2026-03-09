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

import { ORDER_TYPES, ORDER_STATUSES } from '@/lib/types';

// Mock data for demo - DELIVERED ORDER SCENARIO
const mockOrderData = {
  brand: 'Fitty',
  orderId: '#FTY-090324-0001',
  shopifyId: '#SH9876543210',
  orderType: ORDER_TYPES.SHOPIFY,
  orderStatus: ORDER_STATUSES.DELIVERED,
  refundStatus: 'NA' as const,
  paymentMethod: 'Prepaid',

  // Customer
  customerName: 'John Doe',
  customerEmail: 'john.doe@example.com',
  customerPhone: '9876543210',

  // Logistics & Financials
  awb: 'AWB1234567890',
  courierPartner: 'DHL Express',
  couponCodeUsed: 'FITTY20',
  invoiceSummaryINR: 2000.00,
  products: [
    {
      id: 'prod-1',
      name: 'Product A',
      quantity: 2,
      priceINR: 1200.00,
      discountINR: 100.00,
      finalPriceINR: 1100.00,
    },
    {
      id: 'prod-2',
      name: 'Product B',
      quantity: 1,
      priceINR: 1200.00,
      discountINR: 100.00,
      finalPriceINR: 900.00,
    },
  ],

  // Shipping
  address: '123 Main Street, Apt 4B',
  city: 'Gurgaon',
  state: 'Haryana',
  country: 'India',
  pincode: '122001',

  // Clone - NOT PRESENT for delivered orders
  hasClone: false,

  // Delivery & Payment
  deliveryDate: 'April 15, 2023',
  deliveryTime: '2:00 PM',
  paymentStatus: 'completed' as const,
  paymentDateTime: 'April 9, 2023; 10:00 AM',

  // Timeline events - DELIVERED ORDER FORMAT
  timelineEvents: [
    {
      id: 'placed',
      eventName: ORDER_STATUSES.PLACED,
      timestamp: '26th February, 2026; 09:11 AM',
      remarks: 'Remarks: Order Placed on Shopify',
    },
    {
      id: 'confirmed',
      eventName: ORDER_STATUSES.CONFIRMED,
      timestamp: '26th February, 2026; 10:11 AM',
      remarks: 'Remarks: Order Confirmed on EasyEcom',
    },
    {
      id: 'pickup-scheduled',
      eventName: ORDER_STATUSES.PICKUP_SCHEDULED,
      timestamp: '26th February, 2026; 11:11 AM',
      remarks: 'Remarks: Courier - Shiprocket',
    },
    {
      id: 'pickup-done',
      eventName: ORDER_STATUSES.PICKUP_DONE,
      timestamp: '26th February, 2026; 11:11 AM',
      remarks: 'Remarks: AWB -',
    },
    {
      id: 'in-transit',
      eventName: ORDER_STATUSES.IN_TRANSIT,
      timestamp: '26th February, 2026; 11:11 AM',
      remarks: 'Remarks: NA',
    },
    {
      id: 'delivered',
      eventName: ORDER_STATUSES.DELIVERED,
      timestamp: '26th February, 2026; 11:11 AM',
      remarks: 'Remarks: NA',
    },
  ],

  // Refund - NO REFUND FOR DELIVERED ORDERS
  showRefund: false,

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
        couponCodeUsed={mockOrderData.couponCodeUsed}
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

      {/* Refund Details - Always show but content changes based on status */}
      <RefundDetailsCard hasRefund={mockOrderData.showRefund} />

      {/* Logs & Remarks */}
      <LogsRemarksCard logs={logs} onAddRemark={handleAddRemark} />
    </div>
  );
}
