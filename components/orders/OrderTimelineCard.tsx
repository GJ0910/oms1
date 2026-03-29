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
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Order Timeline</h2>
      <Timeline items={items} />
    </div>
  );
}
