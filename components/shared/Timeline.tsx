import { LucideIcon } from 'lucide-react';

interface TimelineItem {
  id: string;
  title: string;
  description?: string;
  timestamp: string;
  remarks?: string;
  icon?: LucideIcon;
}

interface TimelineProps {
  items: TimelineItem[];
  className?: string;
}

export function Timeline({ items, className = '' }: TimelineProps) {
  return (
    <div className={`space-y-6 ${className}`}>
      {items.map((item, index) => {
        const Icon = item.icon;
        return (
          <div key={item.id} className="timeline-item">
            {/* Dot and connecting line */}
            <div className="flex flex-col items-center">
              <div className="timeline-dot">
                {Icon ? (
                  <Icon className="h-2 w-2 text-primary-foreground" />
                ) : null}
              </div>
              {index < items.length - 1 && (
                <div className="w-0.5 h-8 bg-border mt-2" />
              )}
            </div>

            {/* Content */}
            <div className="timeline-content">
              {/* Event title */}
              <h4 className="text-sm font-medium text-foreground">{item.title}</h4>
              
              {/* Timestamp */}
              <p className="timeline-time mt-0.5">{item.timestamp}</p>
              
              {/* Remarks or description */}
              {item.remarks && (
                <p className="timeline-description text-xs mt-1">{item.remarks}</p>
              )}
              {item.description && !item.remarks && (
                <p className="timeline-description">{item.description}</p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
