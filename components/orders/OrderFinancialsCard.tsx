import { DataTable } from '@/components/shared/DataTable';
import { CopyButton } from '@/components/shared/CopyButton';

interface Product {
  id: string;
  name: string;
  quantity: number;
  priceINR: number;
  discountINR: number;
  finalPriceINR: number;
}

interface OrderFinancialsCardProps {
  awb: string;
  courierPartner: string;
  couponCodeUsed?: string;
  invoiceSummaryINR: number;
  products: Product[];
}

const formatINR = (amount: number) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);
};

export function OrderFinancialsCard({
  awb,
  courierPartner,
  couponCodeUsed,
  invoiceSummaryINR,
  products,
}: OrderFinancialsCardProps) {
  const columns = [
    {
      header: 'Product Name',
      accessor: 'name' as const,
    },
    {
      header: 'Quantity',
      accessor: 'quantity' as const,
    },
    {
      header: 'Price (MRP)',
      accessor: 'priceINR' as const,
      render: (value: number) => <span className="font-mono">{formatINR(value)}</span>,
    },
    {
      header: 'Discount',
      accessor: 'discountINR' as const,
      render: (value: number) => (
        <span className="font-mono text-destructive">-{formatINR(value)}</span>
      ),
    },
    {
      header: 'Final Sale Price',
      accessor: 'finalPriceINR' as const,
      render: (value: number) => <span className="font-mono font-medium">{formatINR(value)}</span>,
    },
  ];

  return (
    <div className="card-section">
      <h2 className="card-title">Order Financials & Logistics</h2>

      {/* Logistics info */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-8 pb-8 border-b border-border">
        {/* AWB */}
        <div>
          <div className="field-label">AWB</div>
          <div className="flex items-center gap-2 mt-1">
            <div className="field-value font-mono m-0">{awb}</div>
            <CopyButton text={awb} label="Copy" />
          </div>
        </div>

        {/* Courier Partner */}
        <div>
          <div className="field-label">Courier Partner</div>
          <div className="field-value">{courierPartner}</div>
        </div>

        {/* Coupon Code Used */}
        {couponCodeUsed && (
          <div>
            <div className="field-label">Coupon Code Used</div>
            <div className="field-value font-mono">{couponCodeUsed}</div>
          </div>
        )}

        {/* Invoice Summary */}
        <div>
          <div className="field-label">Invoice Summary</div>
          <div className="field-value font-medium font-mono text-lg text-primary">
            {formatINR(invoiceSummaryINR)}
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Products</h3>
        <DataTable columns={columns} data={products} />
      </div>
    </div>
  );
}
