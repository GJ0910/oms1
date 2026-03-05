'use client';

import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface MaskedFieldProps {
  value: string;
  type: 'email' | 'phone';
  label?: string;
  className?: string;
}

export function MaskedField({ value, type, label, className = '' }: MaskedFieldProps) {
  const [isVisible, setIsVisible] = useState(false);

  const getMaskedValue = () => {
    if (type === 'email') {
      const [name, domain] = value.split('@');
      return `${name.slice(0, 3)}****@${domain}`;
    } else if (type === 'phone') {
      return `${value.slice(0, 2)}XXXXXX${value.slice(-2)}`;
    }
    return value;
  };

  return (
    <div className={className}>
      {label && <div className="field-label">{label}</div>}
      <div className="flex items-center justify-between gap-3 mt-1">
        <div className="field-value font-mono">
          {isVisible ? value : getMaskedValue()}
        </div>
        <button
          onClick={() => setIsVisible(!isVisible)}
          className="inline-flex items-center justify-center p-1 rounded hover:bg-muted transition-colors text-muted-foreground hover:text-foreground"
          title={isVisible ? 'Hide' : 'Show'}
          aria-label={isVisible ? 'Hide value' : 'Show value'}
        >
          {isVisible ? (
            <EyeOff className="h-4 w-4" />
          ) : (
            <Eye className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
