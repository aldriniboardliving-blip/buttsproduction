import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const paddingStyles = {
  none: '',
  sm: 'p-4',
  md: 'p-6',
  lg: 'p-8',
} as const;

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  padding?: keyof typeof paddingStyles;
  elevated?: boolean;
  bordered?: boolean;
}

export function Card({
  padding = 'md',
  elevated = true,
  bordered,
  className,
  children,
  ...props
}: CardProps) {
  return (
    <div
      className={cn(
        'bg-white rounded-lg',
        elevated && 'shadow-md',
        bordered && 'border border-neutral-200',
        paddingStyles[padding],
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
