'use client';

import { cn } from '@/src/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import React, { JSX } from 'react';

const headingVariants = cva('font-inter text-card-foreground tracking-tight', {
  variants: {
    variant: {
      h1: 'text-4xl font-semibold leading-tight',
      h2: 'text-3xl font-semibold leading-snug',
      h3: 'text-2xl font-semibold leading-normal',
      h4: 'text-xl font-semibold leading-normal',
      h5: 'text-lg font-medium leading-snug',
      h6: 'text-base font-medium leading-snug',
    },
  },
  defaultVariants: {
    variant: 'h3',
  },
});

export interface HeadingProps extends VariantProps<typeof headingVariants> {
  children: React.ReactNode;
  className?: string;
}

export const Heading = ({ children, className, variant }: HeadingProps) => {
  const Component = (variant ?? 'h3') as keyof JSX.IntrinsicElements;

  return <Component className={cn(headingVariants({ variant }), className)}>{children}</Component>;
};
