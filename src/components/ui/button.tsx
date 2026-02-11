import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';

import { cn } from '@/lib/utils';

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-bold uppercase tracking-wide transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-40 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-gradient-to-br from-electric-blue to-cyber-cyan border border-cyber-cyan/30 text-white shadow-neon-cyan hover:-translate-y-0.5 hover:shadow-neon-cyan-lg',
        destructive:
          'bg-alert-red/20 border border-alert-red/50 text-alert-red shadow-neon-red hover:bg-alert-red/30',
        outline:
          'border border-ghost-gray/40 bg-slate-shadow/60 text-bright-gray backdrop-blur-sm hover:border-cyber-cyan/60 hover:text-cyber-cyan',
        secondary:
          'bg-slate-shadow/80 border border-ghost-gray/40 text-bright-gray backdrop-blur-xl hover:border-cyber-cyan hover:text-cyber-cyan',
        ghost: 'text-steel-gray hover:bg-slate-shadow hover:text-cyber-cyan',
        link: 'text-cyber-cyan underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-10 px-6 py-2',
        sm: 'h-8 rounded-md px-3 text-xs',
        lg: 'h-11 rounded-lg px-8',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    return (
      <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
    );
  },
);
Button.displayName = 'Button';

export { Button, buttonVariants };
