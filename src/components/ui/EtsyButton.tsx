'use client';

import React from 'react';
import { ExternalLink, ShoppingBag } from 'lucide-react';
import { cn } from '../../lib/utils';

interface EtsyButtonProps {
  etsyUrl: string;
  productName: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  variant?: 'primary' | 'secondary';
}

export function EtsyButton({ 
  etsyUrl, 
  productName, 
  size = 'lg',
  className,
  variant = 'primary'
}: EtsyButtonProps) {
  const sizes = {
    sm: 'h-9 px-4 text-xs',
    md: 'h-11 px-6 text-sm',
    lg: 'h-14 px-8 text-base',
  };

  const variants = {
    primary: 'bg-gradient-to-r from-primary to-secondary text-white hover:opacity-90 shadow-xl',
    secondary: 'bg-white text-primary border-2 border-primary hover:bg-primary hover:text-white',
  };

  return (
    <a
      href={etsyUrl}
      target="_blank"
      rel="noopener noreferrer"
      className={cn(
        'relative inline-flex items-center justify-center gap-3 font-bold uppercase tracking-wider transition-all duration-300 rounded-full group',
        variants[variant],
        sizes[size],
        className
      )}
      aria-label={`Koop ${productName} op Etsy`}
    >
      <ShoppingBag className="w-5 h-5" />
      <span>Koop op Etsy</span>
      <ExternalLink className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
    </a>
  );
}

interface EtsyBadgeProps {
  className?: string;
}

export function EtsyBadge({ className }: EtsyBadgeProps) {
  return (
    <div className={cn(
      'inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white text-xs font-bold uppercase tracking-wide shadow-md',
      className
    )}>
      <svg className="w-4 h-4" viewBox="0 0 48 48" fill="currentColor">
        <path d="M36.5 9H11.5C10.1193 9 9 10.1193 9 11.5V36.5C9 37.8807 10.1193 39 11.5 39H36.5C37.8807 39 39 37.8807 39 36.5V11.5C39 10.1193 37.8807 9 36.5 9ZM20 32H14V17H20V19H17V22H20V24H17V30H20V32ZM29 20H27V32H24V20H22V17H29V20ZM37 29H31C30.4477 29 30 28.5523 30 28V26C30 25.4477 30.4477 25 31 25H36V24H30V22H37V28L31 28V27H36V29H37Z"/>
      </svg>
      <span>Verkocht via Etsy</span>
    </div>
  );
}

