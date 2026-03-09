import { CopyButton } from '@/components/shared/CopyButton';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface OrderOverviewCardProps {
  brand: string;
  orderId: string;
  shopifyId: string;
  orderType: string;
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  refundStatus: 'NA' | 'none' | 'pending' | 'completed' | 'failed';
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
    NA: 'default',
    none: 'default',
    pending: 'warning',
    completed: 'success',
    failed: 'error',
  } as const;

  return (
    <div className="card-section">
      {/* Card header with title and action buttons */}
      <div className="flex items-start justify-between gap-4 mb-6 pb-6 border-b border-border">
        <h2 className="card-title m-0">Order Overview</h2>
        
        {/* Action Buttons - Top Right */}
        <div className="flex flex-wrap gap-2 justify-end flex-shrink-0">
          <button className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Order
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-secondary px-4 py-2 text-sm font-medium text-secondary-foreground hover:bg-secondary/90 transition-colors gap-2">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Clone
          </button>
          <button className="inline-flex items-center justify-center rounded-md bg-destructive px-4 py-2 text-sm font-medium text-destructive-foreground hover:bg-destructive/90 transition-colors">
            Cancel Order
          </button>
        </div>
      </div>

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
                : refundStatus === 'NA'
                ? 'NA'
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
