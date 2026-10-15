import { cn } from '@/lib/utils';
import type { HTMLAttributes } from 'react';

const sizeStyles = {
  sm: 'max-w-[640px]',
  md: 'max-w-[768px]',
  lg: 'max-w-[1024px]',
  xl: 'max-w-[1280px]',
  '2xl': 'max-w-[1536px]',
  full: 'max-w-none',
} as const;

export interface ContainerProps extends HTMLAttributes<HTMLDivElement> {
  size?: keyof typeof sizeStyles;
}

export function Container({ size = 'xl', className, children, ...props }: ContainerProps) {
  return (
    <div
      className={cn(
        'mx-auto w-full',
        sizeStyles[size],
        'px-4 sm:px-6 lg:px-8',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
