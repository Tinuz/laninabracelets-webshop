'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '../lib/data';
import { ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <div className="relative aspect-[3/4] overflow-hidden bg-stone-100 mb-4">
        <Link href={`/product/${product.id}`} className="block absolute inset-0 z-10">
          <span className="sr-only">{product.name} bekijken</span>
        </Link>
        
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/95 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest font-bold z-20 text-stone-900 shadow-sm">
            Nieuw
          </span>
        )}
        {product.isBestseller && (
          <span className="absolute top-3 right-3 bg-stone-900 text-white px-2 py-1 text-[10px] uppercase tracking-widest font-bold z-20 shadow-sm">
            Bestseller
          </span>
        )}
        
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-stone-900/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0" />
        
        <a
          href={product.etsyUrl || "https://www.etsy.com/shop/LaNinaBracelets"}
          target="_blank"
          rel="noopener noreferrer"
          className="absolute bottom-4 right-4 bg-stone-900 text-white px-3 py-2 flex items-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-stone-700 shadow-lg text-xs font-bold uppercase tracking-widest z-30"
        >
          <span className="hidden sm:inline">Etsy</span>
          <ExternalLink size={14} />
        </a>
      </div>
      
      <div className="space-y-2">
        <h3 className="font-serif text-lg lg:text-xl leading-tight group-hover:text-stone-600 transition-colors text-stone-900">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center justify-between">
          <p className="text-stone-600 font-light text-sm">
            Betaalbare elegantie
          </p>
          <span className="text-[10px] bg-orange-100 text-orange-800 px-2 py-1 font-bold uppercase tracking-wide">
            Etsy
          </span>
        </div>
      </div>
    </motion.div>
  );
}

