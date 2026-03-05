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
    <div className="card-section">
      <h2 className="card-title">Order Remarks & Logs</h2>

      {/* Activity Logs */}
      <div className="mb-8 pb-8 border-b border-border">
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
            className="w-full min-h-24 px-3 py-2 rounded-md border border-border bg-input text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none"
            disabled={isSubmitting}
          />
          <div className="flex items-center justify-between">
            <span className="text-xs text-muted-foreground">
              {remarkText.length} characters
            </span>
            <button
              onClick={handleAddRemark}
              disabled={!remarkText.trim() || isSubmitting}
              className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
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
