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
    <div className="card-section">
      <h2 className="card-title">Delivery & Payment</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Delivery Date */}
        <div>
          <div className="field-label">Delivery Date</div>
          <div className="field-value">{deliveryDate}</div>
        </div>

        {/* Delivery Time */}
        {deliveryTime && (
          <div>
            <div className="field-label">Delivery Time</div>
            <div className="field-value">{deliveryTime}</div>
          </div>
        )}

        {/* Payment Status */}
        <div>
          <div className="field-label">Payment Status</div>
          <div className="mt-1">
            <StatusBadge status={paymentStatusMap[paymentStatus]}>
              {paymentStatus.charAt(0).toUpperCase() + paymentStatus.slice(1)}
            </StatusBadge>
          </div>
        </div>

        {/* Payment Date & Time */}
        {paymentStatus === 'completed' && paymentDateTime && (
          <div>
            <div className="field-label">Payment Date & Time</div>
            <div className="field-value">{paymentDateTime}</div>
          </div>
        )}
      </div>
    </div>
  );
}
