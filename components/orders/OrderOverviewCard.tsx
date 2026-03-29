import { CopyButton } from '@/components/shared/CopyButton';
import { StatusBadge } from '@/components/shared/StatusBadge';

interface OrderOverviewCardProps {
  brand: string;
  orderId: string;
  platformId: string;
  orderType: string;
  orderStatus: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  refundStatus: 'NA' | 'none' | 'pending' | 'completed' | 'failed';
  paymentMethod: string;
}

export function OrderOverviewCard({
  brand,
  orderId,
  platformId,
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
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      {/* Card header with title and action buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-5 sm:mb-6 pb-5 sm:pb-6 border-b border-border/50">
        <h2 className="text-lg font-semibold text-foreground">Order Overview</h2>
        
        {/* Action Buttons - Top Right */}
        <div className="flex flex-wrap gap-2 justify-start sm:justify-end flex-shrink-0">
          <button className="inline-flex items-center justify-center rounded-lg bg-muted px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-95 gap-2 border border-border/50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Edit Order
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-muted px-3.5 py-2 text-sm font-medium text-foreground hover:bg-muted/80 transition-all duration-200 active:scale-95 gap-2 border border-border/50">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Create Clone
          </button>
          <button className="inline-flex items-center justify-center rounded-lg bg-destructive/10 px-3.5 py-2 text-sm font-medium text-destructive hover:bg-destructive/20 transition-all duration-200 active:scale-95 border border-destructive/20">
            Cancel Order
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Brand */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Brand</div>
          <div className="text-sm font-medium text-foreground">{brand}</div>
        </div>

        {/* Order ID */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Order ID</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm font-mono text-foreground">{orderId}</div>
            <CopyButton text={orderId} label="Copy" />
          </div>
        </div>

        {/* Platform ID */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Platform ID</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="text-sm font-mono text-foreground">{platformId}</div>
            <CopyButton text={platformId} label="Copy" />
          </div>
        </div>

        {/* Order Type */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Order Type</div>
          <div className="text-sm text-foreground">{orderType}</div>
        </div>

        {/* Order Status */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Order Status</div>
          <div className="mt-1">
            <StatusBadge status={statusMap[orderStatus]}>
              {orderStatus.charAt(0).toUpperCase() + orderStatus.slice(1)}
            </StatusBadge>
          </div>
        </div>

        {/* Refund Status */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Refund Status</div>
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
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Payment Method</div>
          <div className="text-sm text-foreground">{paymentMethod}</div>
        </div>
      </div>
    </div>
  );
}
