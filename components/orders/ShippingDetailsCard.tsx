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
    <div className="card-section">
      <h2 className="card-title">Shipping Details</h2>

      <div className="grid grid-cols-1 gap-6">
        {/* Full Address */}
        <div>
          <div className="field-label mb-2">Full Address</div>
          <div className="flex items-start justify-between gap-4 p-3 rounded-md bg-muted/30 border border-border">
            <div className="field-value text-sm flex-1 leading-relaxed">{fullAddress}</div>
            <CopyButton text={fullAddress} label="Copy" className="flex-shrink-0" />
          </div>
        </div>

        {/* Address breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
          <div>
            <div className="field-label">Address</div>
            <div className="field-value">{address}</div>
          </div>

          <div>
            <div className="field-label">City</div>
            <div className="field-value">{city}</div>
          </div>

          <div>
            <div className="field-label">State</div>
            <div className="field-value">{state}</div>
          </div>

          <div>
            <div className="field-label">Country</div>
            <div className="field-value">{country}</div>
          </div>

          <div>
            <div className="field-label">Pincode</div>
            <div className="field-value font-mono">{pincode}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
