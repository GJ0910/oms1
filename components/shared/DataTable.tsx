interface Column<T> {
  header: string;
  accessor: keyof T;
  render?: (value: any, row: T) => React.ReactNode;
  className?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  className?: string;
}

export function DataTable<T extends Record<string, any>>({
  columns,
  data,
  className = '',
}: DataTableProps<T>) {
  return (
    <div className={`overflow-x-auto border border-border rounded-lg bg-card shadow-sm ${className}`}>
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border bg-muted/40">
            {columns.map((column, index) => (
              <th
                key={index}
                className={`px-4 py-3.5 text-left text-xs font-semibold text-foreground uppercase tracking-wide ${column.className || ''}`}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, rowIndex) => (
            <tr
              key={rowIndex}
              className="border-b border-border/50 last:border-b-0 hover:bg-muted/50 transition-colors duration-150"
            >
              {columns.map((column, colIndex) => (
                <td
                  key={colIndex}
                  className={`px-4 py-3 text-foreground ${column.className || ''}`}
                >
                  {column.render
                    ? column.render(row[column.accessor], row)
                    : String(row[column.accessor])}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
