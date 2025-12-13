'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ExternalLink } from 'lucide-react';
import { cn } from '../lib/utils';
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from 'framer-motion';

export function Navbar() {
  const [isScrolled, setIsScrolled] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const { scrollY } = useScroll();
  const pathname = usePathname();

  useMotionValueEvent(scrollY, "change", (latest) => {
    setIsScrolled(latest > 50);
  });

  const navItems = [
    { label: 'Nieuw Binnen', href: '/collection?filter=new' },
    { label: 'Sieraden', href: '/collection' },
    { label: 'Over Ons', href: '/about' },
  ];

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
          <button 
            className="lg:hidden p-2 -ml-2 text-stone-900 z-50 relative"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle mobile menu"
          >
            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
          <div className="hidden lg:flex gap-8">
            {navItems.map((item) => (
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

        <Link href="/" className="absolute left-1/2 -translate-x-1/2 group flex items-center gap-2 lg:gap-3 max-w-[200px] sm:max-w-none">
          <div className="relative w-6 h-6 lg:w-8 lg:h-8 opacity-80 flex-shrink-0">
            <Image 
              src="/images/logo_trns.png" 
              alt="La Nina Logo" 
              fill
              className="object-contain"
            />
          </div>
          <span className="font-serif text-base sm:text-lg lg:text-2xl text-stone-900 tracking-wide truncate">
            La Nina Bracelets
          </span>
        </Link>

        <div className="flex items-center">
          {/* Etsy Shop Link - Client-side only to prevent hydration issues */}
          <div className="group flex items-center gap-2 px-4 py-2 text-stone-900 hover:text-stone-600 transition-colors">
            <button
              onClick={() => window.open('https://www.etsy.com/shop/LaNinaBracelets', '_blank', 'noopener,noreferrer')}
              className="flex items-center gap-2 group"
              aria-label="Bezoek onze Etsy Shop"
            >
              <ExternalLink size={20} className="group-hover:scale-110 transition-transform" />
              <span className="hidden sm:block text-xs font-bold tracking-widest uppercase font-sans">
                Shop
              </span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Mobile Menu */}
            <motion.div
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', bounce: 0, duration: 0.4 }}
              className="fixed top-0 left-0 h-full w-80 bg-white shadow-xl z-50 lg:hidden"
            >
              <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-stone-200">
                  <div className="flex items-center gap-3">
                    <div className="relative w-8 h-8">
                      <Image 
                        src="/images/logo_trns.png" 
                        alt="La Nina Logo" 
                        fill
                        className="object-contain"
                      />
                    </div>
                    <span className="font-serif text-xl text-stone-900">
                      La Nina
                    </span>
                  </div>
                  <button 
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 text-stone-900"
                    aria-label="Close menu"
                  >
                    <X size={24} />
                  </button>
                </div>
                
                {/* Navigation Links */}
                <div className="flex-1 px-6 py-8">
                  <nav className="space-y-8">
                    {navItems.map((item) => (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className={cn(
                          "block text-xl font-light transition-colors font-serif",
                          pathname === item.href 
                            ? "text-stone-900 font-normal" 
                            : "text-stone-600 hover:text-stone-900"
                        )}
                      >
                        {item.label}
                      </Link>
                    ))}
                  </nav>
                </div>
                
                {/* Footer */}
                <div className="p-6 border-t border-stone-200 space-y-4">
                  <Link
                    href="/collection"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="w-full flex items-center justify-center gap-3 py-4 bg-stone-900 text-white font-bold uppercase tracking-widest text-sm transition-colors hover:bg-stone-700"
                  >
                    Bekijk Collectie
                  </Link>
                  <button
                    onClick={() => {
                      window.open('https://www.etsy.com/shop/LaNinaBracelets', '_blank', 'noopener,noreferrer');
                      setIsMobileMenuOpen(false);
                    }}
                    className="w-full flex items-center justify-center gap-3 py-3 border-2 border-stone-900 text-stone-900 font-bold uppercase tracking-widest text-sm transition-colors hover:bg-stone-900 hover:text-white"
                  >
                    <ExternalLink size={16} />
                    Etsy Shop
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

