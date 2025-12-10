'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Menu } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { cn } from '../lib/utils';
import { motion, useScroll, useMotionValueEvent } from 'framer-motion';

export function Navbar() {
  const { openCart, count } = useCart();
  const [isScrolled, setIsScrolled] = React.useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();
  const isHome = pathname === '/';

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  return (
    <motion.nav
      className={cn(
        "fixed top-0 w-full z-40 transition-all duration-300",
        isScrolled 
          ? "bg-white border-b border-stone-200 py-4 shadow-sm" 
          : "bg-white border-b border-stone-200 py-6"
      )}
    >
      <div className="container mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <button className="lg:hidden p-2 -ml-2 text-primary">
            <Menu size={24} />
          </button>
          <div className="hidden lg:flex gap-8">
            {[
              { label: 'Nieuw Binnen', href: '/collection?filter=new' },
              { label: 'Sieraden', href: '/collection' },
              { label: 'Over Ons', href: '/about' },
            ].map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className={cn(
                  "text-xs font-bold tracking-widest transition-colors uppercase font-sans",
                  "text-stone-900 hover:text-stone-600",
                  pathname === item.href && "border-b-2 border-stone-900"
                )}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group flex items-center gap-3">
          <div className="relative w-8 h-8 opacity-80">
            <Image 
              src="/images/logo_trns.png" 
              alt="La Nina Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-2xl text-stone-900 tracking-wide">
            La Nina Bracelets
          </span>
        </Link>

        <div className="flex items-center">
          <button 
            onClick={openCart}
            className="p-2 hover:opacity-70 transition-opacity relative text-stone-900"
          >
            <ShoppingBag size={20} />
            {count > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] w-5 h-5 rounded-full flex items-center justify-center font-semibold border-2 border-white shadow-sm">
                {count}
              </span>
            )}
          </button>
        </div>
      </div>
    </motion.nav>
  );
}

