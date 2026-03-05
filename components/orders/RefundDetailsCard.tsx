import { CopyButton } from '@/components/shared/CopyButton';

interface RefundDetailsCardProps {
  refundUTR?: string;
  refundProcessedDateTime?: string;
  hasRefund?: boolean;
}

export function RefundDetailsCard({ refundUTR, refundProcessedDateTime, hasRefund = false }: RefundDetailsCardProps) {
  return (
    <div className="card-section border-destructive/20 bg-destructive/5">
      <h2 className="card-title text-destructive">Refund Details</h2>

      {!hasRefund ? (
        <div className="p-4 rounded-md bg-muted/30 border border-border text-center">
          <p className="text-sm text-muted-foreground">No refund requested</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Refund UTR */}
          <div>
            <div className="field-label">Refund UTR</div>
            <div className="flex items-center justify-between mt-1">
              <div className="field-value font-mono">{refundUTR}</div>
              <CopyButton text={refundUTR || ''} label="Copy" />
            </div>
          </div>

          {/* Refund Processed Date & Time */}
          <div>
            <div className="field-label">Refund Processed Date & Time</div>
            <div className="field-value">{refundProcessedDateTime}</div>
          </div>
        </div>
      )}
    </div>
  );
}
