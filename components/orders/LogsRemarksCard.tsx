'use client';

import { useState } from 'react';
import { Timeline } from '@/components/shared/Timeline';
import { MessageSquare } from 'lucide-react';

interface LogEntry {
  id: string;
  title: string;
  source: string;
  timestamp: string;
  description?: string;
}

interface LogsRemarksCardProps {
  logs: LogEntry[];
  onAddRemark?: (remark: string) => void;
}

export function LogsRemarksCard({ logs, onAddRemark }: LogsRemarksCardProps) {
  const [remarkText, setRemarkText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddRemark = async () => {
    if (!remarkText.trim()) return;

    setIsSubmitting(true);
    try {
      onAddRemark?.(remarkText);
      setRemarkText('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const items = logs.map(log => ({
    id: log.id,
    title: `${log.title} • ${log.source}`,
    description: log.description,
    timestamp: log.timestamp,
  }));

  return (
    <div className="rounded-lg border border-border bg-card p-5 sm:p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-foreground mb-5">Order Remarks & Logs</h2>

      {/* Activity Logs */}
      <div className="mb-6 sm:mb-8 pb-6 sm:pb-8 border-b border-border/50">
        <h3 className="text-sm font-semibold text-foreground mb-4">Activity Logs</h3>
        {logs.length > 0 ? (
          <Timeline items={items} />
        ) : (
          <div className="text-center p-4 text-muted-foreground text-sm">
            No logs yet
          </div>
        )}
      </div>

      {/* Add Remark Section */}
      <div>
        <h3 className="text-sm font-semibold text-foreground mb-4">Add Remark</h3>
        <div className="space-y-3">
          <textarea
            value={remarkText}
            onChange={(e) => setRemarkText(e.target.value)}
            placeholder="Enter your remark or note for this order..."
            className="w-full min-h-24 px-3.5 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none text-sm"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {remarkText.length} characters
            </span>
            <button
              onClick={handleAddRemark}
              disabled={!remarkText.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <MessageSquare className="h-4 w-4" />
              Add Remark
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
