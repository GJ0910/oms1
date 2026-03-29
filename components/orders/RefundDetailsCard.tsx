import { CopyButton } from '@/components/shared/CopyButton';

interface RefundDetailsCardProps {
  refundUTR?: string;
  refundProcessedDateTime?: string;
  hasRefund?: boolean;
}

export function RefundDetailsCard({ refundUTR, refundProcessedDateTime, hasRefund = false }: RefundDetailsCardProps) {
  return (
    <div className="rounded-lg border border-destructive/20 bg-destructive/5 p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-destructive mb-5">Refund Details</h2>

      {!hasRefund ? (
        <div className="p-3.5 rounded-lg bg-muted/20 border border-border/50 text-center">
          <p className="text-sm text-muted-foreground">No refund requested</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Refund UTR */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Refund UTR</div>
            <div className="flex items-center justify-between mt-1">
              <div className="text-sm font-mono text-foreground">{refundUTR}</div>
              <CopyButton text={refundUTR || ''} label="Copy" />
            </div>
          </div>

          {/* Refund Processed Date & Time */}
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Refund Processed Date & Time</div>
            <div className="text-sm text-foreground">{refundProcessedDateTime}</div>
          </div>
        </div>
      )}
    </div>
  );
}
