'use client';

import { ArrowDown, ArrowUp, ArrowUpDown } from 'lucide-react';
import * as React from 'react';

import { cn } from '../../lib/utils';

export interface SortButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  sortDirection?: 'asc' | 'desc' | null;
}

const SortButton = React.forwardRef<HTMLButtonElement, SortButtonProps>(
  ({ className, sortDirection, children, ...props }, ref) => {
    const getSortIcon = () => {
      if (sortDirection === 'asc') {
        return <ArrowUp className="ml-2 h-4 w-4" />;
      }
      if (sortDirection === 'desc') {
        return <ArrowDown className="ml-2 h-4 w-4" />;
      }
      return <ArrowUpDown className="ml-2 h-4 w-4" />;
    };

    return (
      <button
        ref={ref}
        className={cn('hover:text-foreground flex items-center space-x-2 font-medium focus:outline-none', className)}
        {...props}
      >
        {children}
        {getSortIcon()}
      </button>
    );
  },
);
SortButton.displayName = 'SortButton';

export { SortButton };
