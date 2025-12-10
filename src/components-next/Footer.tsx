'use client';

import React from 'react';
import Link from 'next/link';
import { Instagram, Facebook, Mail } from 'lucide-react';

export function Footer() {
  return (
    <footer className="bg-stone-900 text-white pt-20 pb-10 relative overflow-hidden">
      <div className="container mx-auto px-6 md:px-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="space-y-6">
            <span className="font-serif text-3xl text-white">
              La Nina
            </span>
            <p className="text-stone-400 text-sm font-light leading-relaxed max-w-xs">
              Handgemaakte armbanden, kettingen & oorbellen. 
              Waterdicht & gemaakt met liefde.
            </p>
            <div className="flex gap-4">
              <a href="https://instagram.com/laninabracelets" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all text-white">
                <Instagram size={18} />
              </a>
              <a href="https://facebook.com/laninabracelets" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all text-white">
                <Facebook size={18} />
              </a>
              <a href="mailto:info@laninabracelets.com" className="w-10 h-10 bg-white/10 flex items-center justify-center hover:bg-white hover:text-stone-900 transition-all text-white">
                <Mail size={18} />
              </a>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white">Collectie</h4>
            <ul className="space-y-4 text-sm font-light text-stone-400">
              <li><Link href="/collection?filter=new" className="hover:text-white transition-colors">Nieuw Binnen</Link></li>
              <li><Link href="/collection?filter=bestsellers" className="hover:text-white transition-colors">Bestsellers</Link></li>
              <li><Link href="/collection" className="hover:text-white transition-colors">Armbanden</Link></li>
              <li><Link href="/collection" className="hover:text-white transition-colors">Kettingen</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 uppercase tracking-widest text-xs text-white">Bedrijf</h4>
            <ul className="space-y-4 text-sm font-light text-stone-400">
              <li><Link href="/about" className="hover:text-white transition-colors">Over Ons</Link></li>
              <li><Link href="/collection" className="hover:text-white transition-colors">Collectie</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row justify-between items-center pt-8 border-t border-stone-800 text-xs font-light text-stone-500">
          <p>&copy; {new Date().getFullYear()} La Nina Bracelets. Alle rechten voorbehouden.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-white transition-colors">Privacybeleid</a>
            <a href="#" className="hover:text-white transition-colors">Algemene Voorwaarden</a>
          </div>
        </div>
      </div>
    </footer>
  );
}