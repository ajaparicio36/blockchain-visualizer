import * as React from 'react';

import { cn } from '@/lib/utils';

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<'input'>>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          'flex h-10 w-full rounded-lg border-2 border-ghost-gray/40 bg-slate-shadow/60 px-4 py-2 text-sm text-bright-gray backdrop-blur-sm transition-all file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-ghost-gray/70 focus-visible:outline-none focus-visible:border-cyber-cyan focus-visible:shadow-[0_0_0_3px_rgba(0,217,255,0.15)] disabled:cursor-not-allowed disabled:opacity-40 md:text-sm',
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Input.displayName = 'Input';

export { Input };
