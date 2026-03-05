interface StatusBadgeProps {
  status: 'success' | 'warning' | 'pending' | 'error' | 'default';
  children: React.ReactNode;
  className?: string;
}

export function StatusBadge({ status, children, className = '' }: StatusBadgeProps) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium';
  
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
