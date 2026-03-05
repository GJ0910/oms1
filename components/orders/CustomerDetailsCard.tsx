import { MaskedField } from '@/components/shared/MaskedField';

interface CustomerDetailsCardProps {
  name: string;
  email: string;
  phone: string;
}

export function CustomerDetailsCard({ name, email, phone }: CustomerDetailsCardProps) {
  return (
    <div className="card-section">
      <h2 className="card-title">Customer Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {/* Name */}
        <div>
          <div className="field-label">Name</div>
          <div className="field-value font-medium">{name}</div>
        </div>

        {/* Email */}
        <MaskedField value={email} type="email" label="Email" />

        {/* Phone */}
        <MaskedField value={phone} type="phone" label="Phone" />
      </div>
    </div>
  );
}
