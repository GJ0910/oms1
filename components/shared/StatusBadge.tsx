interface StatusBadgeProps {
  status: 'success' | 'warning' | 'pending' | 'error' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-sm';
  
  const statusClasses = {
    success: 'badge-success',
    warning: 'badge-warning',
    pending: 'badge-pending',
    error: 'badge-error',
    default: 'badge-default',
  };

  return (
    <span className={`${baseClasses} ${statusClasses[status]} ${className}`}>
      {children}
    </span>
  );
}
