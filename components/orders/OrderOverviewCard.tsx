import { CopyButton } from '@/components/shared/CopyButton';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface OrderOverviewCardProps {
  brand: string;
  orderId: string;
  shopifyId: string;
  orderType: string;
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  refundStatus: 'none' | 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

export function OrderOverviewCard({
  brand,
  orderId,
  shopifyId,
  orderType,
  orderStatus,
  refundStatus,
  paymentMethod,
}: OrderOverviewCardProps) {
  const statusMap = {
    placed: 'pending',
    processing: 'pending',
    shipped: 'warning',
    delivered: 'success',
    cancelled: 'error',
  } as const;

  const refundStatusMap = {
    none: 'default',
    pending: 'warning',
    completed: 'success',
    failed: 'error',
  } as const;

  return (
    <div className="card-section">
      <h2 className="card-title">Order Overview</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Brand */}
        <div>
          <div className="field-label">Brand</div>
          <div className="field-value font-medium">{brand}</div>
        </div>

        {/* Order ID */}
        <div>
          <div className="field-label">Order ID</div>
          <div className="flex items-center justify-between">
            <div className="field-value font-mono">{orderId}</div>
            <CopyButton text={orderId} label="Copy" />
          </div>
        </div>

        {/* Shopify ID */}
        <div>
          <div className="field-label">Shopify ID</div>
          <div className="flex items-center justify-between">
            <div className="field-value font-mono">{shopifyId}</div>
            <CopyButton text={shopifyId} label="Copy" />
          </div>
        </div>

        {/* Order Type */}
        <div>
          <div className="field-label">Order Type</div>
          <div className="field-value">{orderType}</div>
        </div>

        {/* Order Status */}
        <div>
          <div className="field-label">Order Status</div>
          <div className="mt-1">
            <StatusBadge status={statusMap[orderStatus]}>
              {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
            </StatusBadge>
          </div>
        </div>

        {/* Refund Status */}
        <div>
          <div className="field-label">Refund Status</div>
          <div className="mt-1">
            <StatusBadge status={refundStatusMap[refundStatus]}>
              {refundStatus === 'none'
                ? 'No Refund'
                : refundStatus.charAt(0).toUpperCase() + refundStatus.slice(1)}
            </StatusBadge>
          </div>
        </div>

        {/* Payment Method */}
        <div>
          <div className="field-label">Payment Method</div>
          <div className="field-value">{paymentMethod}</div>
        </div>
      </div>
    </div>
  );
}
