import { Timeline } from '@/components/shared/Timeline';
import { Package, Truck, CheckCircle2, XCircle, AlertCircle, Clock } from 'lucide-react';

interface TimelineEvent {
  id: string;
  eventName: string;
  timestamp: string;
  remarks?: string;
}

interface OrderTimelineCardProps {
  events: TimelineEvent[];
}

export function OrderTimelineCard({ events }: OrderTimelineCardProps) {
  const iconMap: Record<string, any> = {
    placed: Package,
    confirmed: CheckCircle2,
    'pickup-scheduled': Clock,
    'pickup-done': Truck,
    'in-transit': Truck,
    'delivery-failed': AlertCircle,
    delivered: CheckCircle2,
    cancelled: XCircle,
  };

  const items = events.map(event => ({
    id: event.id,
    title: event.eventName,
    remarks: event.remarks,
    timestamp: event.timestamp,
    icon: iconMap[event.id] || undefined,
  }));

  return (
    <div className="card-section">
      <h2 className="card-title">Order Timeline</h2>
      <Timeline items={items} />
    </div>
  );
}
