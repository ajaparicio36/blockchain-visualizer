import * as React from 'react';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border-2 px-4 py-1.5 text-xs font-bold tracking-wide transition-all focus:outline-none focus:ring-2 focus:ring-ring',
  {
    variants: {
      variant: {
        default: 'border-neon-green/50 bg-neon-green/10 text-neon-green shadow-neon-green',
        secondary: 'border-electric-blue/50 bg-electric-blue/10 text-electric-blue',
        destructive:
          'border-alert-red/50 bg-alert-red/10 text-alert-red shadow-neon-red animate-pulse-slow',
        outline: 'border-ghost-gray/40 text-steel-gray',
        warning:
          'border-volt-yellow/60 bg-volt-yellow/10 text-volt-yellow shadow-[0_0_15px_rgba(251,191,36,0.35)]',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
