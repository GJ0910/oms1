interface CustomerDetailsCardProps {
  name: string;
  email: string;
  phone: string;
}

export function CustomerDetailsCard({ name, email, phone }: CustomerDetailsCardProps) {
  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Customer Details</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {/* Name */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Name</div>
          <div className="text-sm font-medium text-foreground">{name}</div>
        </div>

        {/* Email */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Email</div>
          <div className="text-sm text-foreground break-all">{email}</div>
        </div>

        {/* Phone */}
        <div>
          <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1.5">Phone</div>
          <div className="text-sm text-foreground">{phone}</div>
        </div>
      </div>
    </div>
  );
}
