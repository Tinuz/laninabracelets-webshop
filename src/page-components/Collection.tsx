'use client';

import React, { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Product } from '../lib/data';
import { ProductCard } from '../components-next/ProductCard';
import { Filter } from 'lucide-react';

type Category = 'all' | 'rings' | 'necklaces' | 'earrings' | 'bracelets';
type SortOption = 'newest' | 'name-asc' | 'name-desc';

interface CollectionProps {
  products: Product[];
}

export function Collection({ products = [] }: CollectionProps) {
  const searchParams = useSearchParams();
  const [category, setCategory] = useState<Category>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [showNewOnly, setShowNewOnly] = useState(false);
  const [showBestsellersOnly, setShowBestsellersOnly] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Initialize filters from URL parameters
  useEffect(() => {
    const filterParam = searchParams.get('filter');
    const categoryParam = searchParams.get('category');
    
    if (filterParam === 'new') {
      setShowNewOnly(true);
    } else if (filterParam === 'bestsellers') {
      setShowBestsellersOnly(true);
    }
    
    // Set category from URL parameter
    if (categoryParam && ['rings', 'necklaces', 'earrings', 'bracelets'].includes(categoryParam)) {
      setCategory(categoryParam as Category);
    }
  }, [searchParams]);

  const filteredProducts = useMemo(() => {
    let result = [...products];
    
    // Filter by "new" items if showNewOnly is true
    if (showNewOnly) {
      result = result.filter(p => p.isNew === true);
    }
    
    // Filter by "bestsellers" if showBestsellersOnly is true
    if (showBestsellersOnly) {
      result = result.filter(p => p.isBestseller === true);
    }
    
    if (category !== 'all') {
      result = result.filter(p => p.category === category);
    }

    if (sort === 'name-asc') {
      result.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sort === 'name-desc') {
      result.sort((a, b) => b.name.localeCompare(a.name));
    } else if (sort === 'newest') {
      result.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));
    }

    return result;
  }, [products, category, sort, showNewOnly, showBestsellersOnly]);

  const categories: { label: string; value: Category }[] = [
    { label: 'Alle Sieraden', value: 'all' },
    { label: 'Armbanden', value: 'bracelets' },
    { label: 'Kettingen', value: 'necklaces' },
    { label: 'Oorbellen', value: 'earrings' },
  ];

  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 md:px-12 py-6 text-sm text-stone-500 font-light">
        <Link href="/" className="hover:text-stone-900 transition-colors">Home</Link>
        <span className="mx-2">/</span>
        {showNewOnly ? (
          <>
            <Link href="/collection" className="hover:text-stone-900 transition-colors">Collectie</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-900">Nieuw Binnen</span>
          </>
        ) : showBestsellersOnly ? (
          <>
            <Link href="/collection" className="hover:text-stone-900 transition-colors">Collectie</Link>
            <span className="mx-2">/</span>
            <span className="text-stone-900">Bestsellers</span>
          </>
        ) : (
          <span className="text-stone-900">Collectie</span>
        )}
      </div>

      {/* Minimal Header */}
      <div className="container mx-auto px-6 md:px-12 text-center py-16">
        <h1 className="font-serif text-5xl md:text-8xl text-stone-900 tracking-tight">
          {showNewOnly ? 'Nieuw Binnen' : showBestsellersOnly ? 'Bestsellers' : 'De Collectie'}
        </h1>
        {showNewOnly && (
          <p className="text-stone-600 font-light mt-4">
            Ontdek onze nieuwste handgemaakte sieraden
          </p>
        )}
        {showBestsellersOnly && (
          <p className="text-stone-600 font-light mt-4">
            Onze meest geliefde en populaire sieraden
          </p>
        )}
      </div>

      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        {/* Mobile Filters */}
        <div className="lg:hidden w-full mb-8">
          <button 
            className="flex items-center justify-between w-full py-4 border-b border-stone-300 text-stone-900 font-regular"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <span className="uppercase tracking-widest text-xs font-bold">Filters & Sorteer</span>
            <Filter size={18} className={isFilterOpen ? 'rotate-180' : ''} />
          </button>
          
          {isFilterOpen && (
            <div className="py-6 space-y-6 border-b border-stone-200 bg-stone-50 -mx-6 px-6">
              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Filter
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  <button
                    onClick={() => {
                      setShowNewOnly(!showNewOnly);
                      if (showBestsellersOnly) setShowBestsellersOnly(false);
                    }}
                    className={`
                      px-4 py-2 text-xs uppercase tracking-widest transition-all font-bold rounded-none
                      ${showNewOnly 
                        ? 'bg-stone-900 text-white' 
                        : 'border border-stone-400 text-stone-900 hover:bg-stone-900 hover:text-white'}
                    `}
                  >
                    Nieuw Binnen
                  </button>
                  <button
                    onClick={() => {
                      setShowBestsellersOnly(!showBestsellersOnly);
                      if (showNewOnly) setShowNewOnly(false);
                    }}
                    className={`
                      px-4 py-2 text-xs uppercase tracking-widest transition-all font-bold rounded-none
                      ${showBestsellersOnly 
                        ? 'bg-stone-900 text-white' 
                        : 'border border-stone-400 text-stone-900 hover:bg-stone-900 hover:text-white'}
                    `}
                  >
                    Bestsellers
                  </button>
                </div>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Categorieën
                </h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {categories.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`
                        px-4 py-2 text-xs uppercase tracking-widest transition-all font-bold rounded-none
                        ${category === c.value 
                          ? 'bg-stone-900 text-white' 
                          : 'border border-stone-400 text-stone-900 hover:bg-stone-900 hover:text-white'}
                      `}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Sorteer
                </h3>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full bg-white border border-stone-300 text-stone-900 font-light py-3 px-4 focus:outline-none focus:border-stone-900 transition-colors rounded-none"
                >
                  <option value="newest">Nieuwste</option>
                  <option value="name-asc">Naam: A-Z</option>
                  <option value="name-desc">Naam: Z-A</option>
                </select>
              </div>
            </div>
          )}
        </div>

        <div className="flex flex-col lg:flex-row gap-0 lg:gap-12">
          {/* Sidebar Filters - Desktop */}
          <div className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-fit">
            <div className="space-y-8">
              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Filter
                </h3>
                <div className="space-y-3 mb-6">
                  <button
                    onClick={() => {
                      setShowNewOnly(!showNewOnly);
                      if (showBestsellersOnly) setShowBestsellersOnly(false);
                    }}
                    className={`
                      block w-full text-left font-light transition-colors
                      ${showNewOnly 
                        ? 'text-stone-900 font-regular' 
                        : 'text-stone-500 hover:text-stone-900'}
                    `}
                  >
                    {showNewOnly ? '✓ ' : ''}Alleen Nieuw Binnen
                  </button>
                  <button
                    onClick={() => {
                      setShowBestsellersOnly(!showBestsellersOnly);
                      if (showNewOnly) setShowNewOnly(false);
                    }}
                    className={`
                      block w-full text-left font-light transition-colors
                      ${showBestsellersOnly 
                        ? 'text-stone-900 font-regular' 
                        : 'text-stone-500 hover:text-stone-900'}
                    `}
                  >
                    {showBestsellersOnly ? '✓ ' : ''}Alleen Bestsellers
                  </button>
                  {(showNewOnly || showBestsellersOnly) && (
                    <Link 
                      href="/collection"
                      className="block w-full text-left font-light text-stone-400 hover:text-stone-600 text-xs"
                    >
                      ← Alle producten tonen
                    </Link>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Categorieën
                </h3>
                <div className="space-y-2">
                  {categories.map(c => (
                    <button
                      key={c.value}
                      onClick={() => setCategory(c.value)}
                      className={`
                        block w-full text-left font-light transition-colors
                        ${category === c.value 
                          ? 'text-stone-900 font-regular' 
                          : 'text-stone-500 hover:text-stone-900'}
                      `}
                    >
                      {c.label}
                    </button>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-sans font-bold text-xs uppercase tracking-widest text-stone-900 mb-4">
                  Sorteer
                </h3>
                <select 
                  value={sort}
                  onChange={(e) => setSort(e.target.value as SortOption)}
                  className="w-full bg-transparent border-b border-stone-300 text-stone-900 font-light py-2 focus:outline-none focus:border-stone-900 transition-colors"
                >
                  <option value="newest">Nieuwste</option>
                  <option value="name-asc">Naam: A-Z</option>
                  <option value="name-desc">Naam: Z-A</option>
                </select>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="w-full lg:flex-1">
            {/* Product Grid */}
            <motion.div 
              layout
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 sm:gap-x-6 lg:gap-x-8 gap-y-8 lg:gap-y-12 pb-24"
            >
              <AnimatePresence>
                {filteredProducts.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </AnimatePresence>
            </motion.div>

            {filteredProducts.length === 0 && (
              <div className="text-center py-24">
                <p className="text-stone-500 text-lg font-light">Geen producten gevonden in deze categorie.</p>
                <button 
                  onClick={() => {
                    setCategory('all');
                    setShowNewOnly(false);
                    setShowBestsellersOnly(false);
                  }}
                  className="mt-4 text-stone-900 font-regular hover:underline"
                >
                  Wis filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}