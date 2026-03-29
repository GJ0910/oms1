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
      <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-foreground mb-5">Clone Details</h2>
        <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 text-center">
          <p className="text-sm text-muted-foreground">No clone order associated</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Clone Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Clone Order ID */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Clone Order ID</div>
          <div className="flex items-center justify-between mt-1">
            <div className="text-sm font-mono text-primary hover:underline cursor-pointer">
              {cloneOrderId}
            </div>
            <CopyButton text={cloneOrderId || ''} label="Copy" />
          </div>
        </div>

        {/* Clone Status */}
        {cloneStatus && (
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Clone Order Status</div>
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
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Clone Reason</div>
            <div className="text-sm text-foreground">{cloneReason}</div>
          </div>
        )}
      </div>
    </div>
  );
}
