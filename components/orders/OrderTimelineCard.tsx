import { Timeline } from '@/components/shared/Timeline';
import { Package, Truck, CheckCircle2, XCircle } from 'lucide-react';

interface TimelineEvent {
  id: string;
  title: string;
  timestamp: string;
  description?: string;
}

interface OrderTimelineCardProps {
  events: TimelineEvent[];
}

export function OrderTimelineCard({ events }: OrderTimelineCardProps) {
  const iconMap: Record<string, any> = {
    placed: Package,
    shipped: Truck,
    delivered: CheckCircle2,
    cancelled: XCircle,
  };

  const items = events.map(event => ({
    id: event.id,
    title: event.title,
    description: event.description,
    timestamp: event.timestamp,
    icon: iconMap[event.id.split('-')[0]] || undefined,
  }));

  return (
    <div className="card-section">
      <h2 className="card-title">Order Timeline</h2>
      <Timeline items={items} />
    </div>
  );
}
