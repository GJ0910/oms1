import { StatusBadge } from '@/components/shared/StatusBadge';

interface DeliveryPaymentCardProps {
  deliveryDate: string;
  deliveryTime?: string;
  paymentStatus: 'pending' | 'completed' | 'failed';
  paymentDateTime?: string;
}

export function DeliveryPaymentCard({
  deliveryDate,
  deliveryTime,
  paymentStatus,
  paymentDateTime,
}: DeliveryPaymentCardProps) {
  const paymentStatusMap = {
    pending: 'warning',
    completed: 'success',
    failed: 'error',
  } as const;

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Delivery & Payment</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Delivery Date */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Delivery Date</div>
          <div className="text-sm text-foreground">{deliveryDate}</div>
        </div>

        {/* Delivery Time */}
        {deliveryTime && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Delivery Time</div>
            <div className="text-sm text-foreground">{deliveryTime}</div>
          </div>
        )}

        {/* Payment Status */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Payment Status</div>
          <div className="mt-1">
            <StatusBadge status={paymentStatusMap[paymentStatus]}>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </StatusBadge>
          </div>
        </div>

        {/* Payment Date & Time */}
        {paymentStatus === 'completed' && paymentDateTime && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Payment Date & Time</div>
            <div className="text-sm text-foreground">{paymentDateTime}</div>
          </div>
        )}
      </div>
    </div>
  );
}
