import { StatusBadge } from '@/components/shared/StatusBadge';
import { CopyButton } from '@/components/shared/CopyButton';

interface CloneDetailsCardProps {
  hasClone: boolean;
  cloneOrderId?: string;
  cloneStatus?: 'placed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  cloneReason?: string;
}

export function CloneDetailsCard({
  hasClone,
  cloneOrderId,
  cloneStatus,
  cloneReason,
}: CloneDetailsCardProps) {
  const statusMap = {
    placed: 'pending',
    processing: 'pending',
    shipped: 'warning',
    delivered: 'success',
    cancelled: 'error',
  } as const;

  if (!hasClone) {
    return (
      <div className="card-section">
        <h2 className="card-title">Clone Details</h2>
        <div className="p-4 rounded-md bg-muted/30 border border-border text-center">
          <p className="text-sm text-muted-foreground">No clone order associated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="card-section">
      <h2 className="card-title">Clone Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Clone Order ID */}
        <div>
          <div className="field-label">Clone Order ID</div>
          <div className="flex items-center justify-between mt-1">
            <div className="field-value font-mono text-primary hover:underline cursor-pointer">
              {cloneOrderId}
            </div>
            <CopyButton text={cloneOrderId || ''} label="Copy" />
          </div>
        </div>

        {/* Clone Status */}
        {cloneStatus && (
          <div>
            <div className="field-label">Clone Order Status</div>
            <div className="mt-1">
              <StatusBadge status={statusMap[cloneStatus]}>
                {cloneStatus.charAt(0).toUpperCase() + cloneStatus.slice(1)}
              </StatusBadge>
            </div>
          </div>
        )}

        {/* Clone Reason */}
        {cloneReason && (
          <div className="md:col-span-2">
            <div className="field-label">Clone Reason</div>
            <div className="field-value">{cloneReason}</div>
          </div>
        )}
      </div>
    </div>
  );
}
