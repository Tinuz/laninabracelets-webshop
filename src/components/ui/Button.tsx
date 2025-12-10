'use client';

import React from 'react';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'link';
  size?: 'sm' | 'md' | 'lg' | 'icon';
  isLoading?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
      primary: 'bg-stone-900 text-white hover:bg-stone-800 transition-colors',
      secondary: 'bg-transparent text-stone-900 border-2 border-stone-900 hover:bg-stone-900 hover:text-white transition-colors',
      outline: 'border border-stone-900 text-stone-900 bg-transparent hover:bg-stone-900 hover:text-white transition-colors',
      ghost: 'bg-transparent hover:bg-stone-100 text-stone-700',
      link: 'text-stone-900 underline-offset-4 hover:underline p-0 h-auto',
    };

    const sizes = {
      sm: 'h-9 px-3 text-xs',
      md: 'h-11 px-6 text-sm',
      lg: 'h-14 px-8 text-base',
      icon: 'h-10 w-10 p-2 flex items-center justify-center',
    };

    return (
      <button
        ref={ref}
        disabled={isLoading || props.disabled}
        className={cn(
          'relative inline-flex items-center justify-center font-bold uppercase tracking-widest transition-all duration-300 disabled:opacity-50 disabled:pointer-events-none',
          variants[variant],
          sizes[size],
          className
        )}
        {...props}
      >
        {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';
