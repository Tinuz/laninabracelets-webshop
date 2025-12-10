'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '../lib/data';
import { formatPrice } from '../lib/utils';
import { useCart } from '../lib/cart-context';
import { Plus, ExternalLink } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group relative"
    >
      <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-purple-50 mb-4">
        {product.isNew && (
          <span className="absolute top-3 left-3 bg-white/90 backdrop-blur px-2 py-1 text-[10px] uppercase tracking-widest font-medium z-10 text-primary">
            Nieuw
          </span>
        )}
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-purple-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {product.etsyUrl ? (
          <a
            href={product.etsyUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-4 right-4 bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 flex items-center gap-2 rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:opacity-90 shadow-lg text-xs font-bold uppercase"
          >
            <span>Bekijk op Etsy</span>
            <ExternalLink size={14} />
          </a>
        ) : (
          <button
            onClick={(e) => {
              e.preventDefault();
              addItem(product);
            }}
            className="absolute bottom-4 right-4 bg-white text-primary w-10 h-10 flex items-center justify-center rounded-full translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300 hover:bg-primary hover:text-white"
          >
            <Plus size={20} />
          </button>
        )}
      </Link>
      
      <div className="space-y-1">
        <h3 className="font-medium text-lg leading-tight group-hover:underline underline-offset-4 decoration-1 text-foreground">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>
        <div className="flex items-center gap-2">
          <p className="text-purple-900/60 font-serif italic">
            {product.currency ? `${product.currency} ` : ''}
            {formatPrice(product.price)}
          </p>
          {product.etsyUrl && (
            <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded font-bold uppercase">
              Etsy
            </span>
          )}
        </div>
      </div>
    </motion.div>
  );
}

