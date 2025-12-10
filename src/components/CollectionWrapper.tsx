'use client';

import { Suspense } from 'react';
import { Collection } from '../page-components/Collection';
import { Product } from '../lib/data';

interface CollectionWrapperProps {
  products: Product[];
}

function CollectionFallback() {
  return (
    <div className="pt-24 min-h-screen bg-white">
      {/* Breadcrumb Skeleton */}
      <div className="container mx-auto px-6 md:px-12 py-6">
        <div className="h-4 bg-stone-200 rounded w-32 animate-pulse"></div>
      </div>

      {/* Header Skeleton */}
      <div className="container mx-auto px-6 md:px-12 text-center py-16">
        <div className="h-12 md:h-20 bg-stone-200 rounded w-64 mx-auto animate-pulse"></div>
      </div>

      {/* Content Skeleton */}
      <div className="container mx-auto px-6 md:px-12 max-w-7xl">
        <div className="flex gap-12">
          {/* Sidebar Skeleton */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="h-4 bg-stone-200 rounded w-24 animate-pulse"></div>
                <div className="space-y-2">
                  {[1, 2, 3, 4].map(i => (
                    <div key={i} className="h-6 bg-stone-100 rounded w-32 animate-pulse"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Grid Skeleton */}
          <div className="flex-1">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
              {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                <div key={i} className="space-y-4">
                  <div className="aspect-[3/4] bg-stone-200 rounded animate-pulse"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-stone-200 rounded w-3/4 animate-pulse"></div>
                    <div className="h-4 bg-stone-100 rounded w-1/2 animate-pulse"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CollectionWrapper({ products }: CollectionWrapperProps) {
  return (
    <Suspense fallback={<CollectionFallback />}>
      <Collection products={products} />
    </Suspense>
  );
}
