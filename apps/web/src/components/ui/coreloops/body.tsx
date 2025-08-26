'use client';

import { cn } from '@/src/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React from 'react';

export const bodyVariants = cva('font-inter text-m', {
  variants: {
    variant: {
      normal: 'text-card-foreground',
      muted: 'text-muted-foreground',
      label: 'text-card-foreground text-sm',
      destructive: 'text-destructive',
      warning: 'text-yellow-500',
      positive: 'text-green-500',
      normalSemiBold: 'text-card-foreground font-semibold',
      labelSemiBold: 'text-card-foreground text-sm font-semibold',
      labelMedium: 'text-card-foreground text-sm font-medium',
      smallMuted: 'text-muted-foreground text-sm',
      small: 'text-card-foreground text-sm',
      smallSemiBold: 'text-card-foreground text-sm font-semibold',
      extraSmall: 'text-card-foreground text-xs',
    },
  },
  defaultVariants: {
    variant: 'normal',
  },
});

export interface BodyProps extends VariantProps<typeof bodyVariants> {
  children: React.ReactNode;
  htmlFor?: string;
  className?: string;
  as?: 'p' | 'label' | 'span' | 'div'; // flexible base tag
}

export const Body = ({ variant, children, htmlFor, className, as = 'p' }: BodyProps) => {
  const Component = variant === 'label' ? 'label' : as;

  return (
    <Component className={cn(bodyVariants({ variant }), className)} {...(variant === 'label' ? { htmlFor } : {})}>
      {children}
    </Component>
  );
};
