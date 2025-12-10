'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../lib/cart-context';
import { formatPrice } from '../lib/utils';
import { Button } from './ui/Button';

export function CartDrawer() {
  const { isOpen, closeCart, items, removeItem, updateQuantity, total } = useCart();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCart}
            className="fixed inset-0 bg-purple-950/40 backdrop-blur-sm z-50"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-2xl flex flex-col"
          >
            <div className="p-6 flex items-center justify-between border-b border-purple-100">
              <h2 className="font-serif text-2xl text-foreground">Winkelwagen ({items.length})</h2>
              <button onClick={closeCart} className="p-2 hover:bg-purple-50 rounded-full transition-colors text-foreground">
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-8">
              {items.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center text-purple-900/60 space-y-4">
                  <ShoppingBag size={48} className="text-purple-200" />
                  <p>Je winkelwagen is leeg.</p>
                  <Button onClick={closeCart} variant="outline" className="border-purple-200 text-primary hover:bg-purple-50">Verder Winkelen</Button>
                </div>
              ) : (
                items.map(item => (
                  <div key={item.id} className="flex gap-4">
                    <div className="w-24 h-24 bg-purple-50 rounded-lg overflow-hidden flex-shrink-0">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <h3 className="font-medium text-lg leading-tight text-foreground">{item.name}</h3>
                        <p className="font-medium text-primary">{formatPrice(item.price)}</p>
                      </div>
                      <p className="text-sm text-purple-900/60 capitalize">{item.category}</p>
                      
                      <div className="flex justify-between items-end mt-2">
                        <div className="flex items-center border border-purple-100 rounded-md">
                          <button 
                            onClick={() => updateQuantity(item.id, -1)}
                            className="p-1 px-2 hover:bg-purple-50 transition-colors text-primary"
                          >
                            <Minus size={14} />
                          </button>
                          <span className="w-8 text-center text-sm text-foreground">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, 1)}
                            className="p-1 px-2 hover:bg-purple-50 transition-colors text-primary"
                          >
                            <Plus size={14} />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="text-xs text-red-400 underline underline-offset-2 hover:text-red-500"
                        >
                          Verwijderen
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {items.length > 0 && (
              <div className="p-6 border-t border-purple-100 bg-purple-50/50">
                <div className="flex justify-between mb-4 text-lg font-medium text-foreground">
                  <span>Subtotaal</span>
                  <span>{formatPrice(total)}</span>
                </div>
                <p className="text-xs text-purple-900/60 mb-6">Verzending en belasting worden berekend bij het afrekenen.</p>
                <Button className="w-full" size="lg">Afrekenen</Button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
