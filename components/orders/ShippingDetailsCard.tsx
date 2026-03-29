import { CopyButton } from '@/components/shared/CopyButton';

interface ShippingDetailsCardProps {
  address: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
}

export function ShippingDetailsCard({
  address,
  city,
  state,
  country,
  pincode,
}: ShippingDetailsCardProps) {
  const fullAddress = `${address}, ${city}, ${state}, ${country} ${pincode}`;

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Shipping Details</h2>

      <div className="grid grid-cols-1 gap-5 sm:gap-6">
        {/* Full Address */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">Full Address</div>
          <div className="flex items-start justify-between gap-4 p-3.5 rounded-lg bg-muted/20 border border-border/50">
            <div className="text-sm text-foreground flex-1 leading-relaxed">{fullAddress}</div>
            <CopyButton text={fullAddress} label="Copy" className="flex-shrink-0" />
          </div>
        </div>

        {/* Address breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Address</div>
            <div className="text-sm text-foreground">{address}</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">City</div>
            <div className="text-sm text-foreground">{city}</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">State</div>
            <div className="text-sm text-foreground">{state}</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Country</div>
            <div className="text-sm text-foreground">{country}</div>
          </div>

          <div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Pincode</div>
            <div className="text-sm font-mono text-foreground">{pincode}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
