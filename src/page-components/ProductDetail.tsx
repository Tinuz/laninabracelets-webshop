'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Product } from '../lib/data';
import { Button } from '../components/ui/Button';
import { EtsyButton } from '../components/ui/EtsyButton';
import { ProductCard } from '../components-next/ProductCard';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';

interface ProductDetailProps {
  product: Product | null;
  relatedProducts: Product[];
}

export function ProductDetail({ product, relatedProducts = [] }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [showFullDescription, setShowFullDescription] = useState(false);

  if (!product) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-background">
        <p className="text-xl mb-4 text-primary font-bold">Product niet gevonden.</p>
        <Link href="/collection"><Button>Terug naar Collectie</Button></Link>
      </div>
    );
  }

  // Get truncated description (first 2 sentences)
  const getTruncatedDescription = (text: string) => {
    const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
    return sentences.slice(0, 2).join('. ') + (sentences.length > 2 ? '.' : '');
  };

  const truncatedDescription = getTruncatedDescription(product?.description || '');
  const shouldShowReadMore = product?.description && product.description.split(/[.!?]+/).filter(s => s.trim().length > 0).length > 2;

  return (
    <div className="pt-24 min-h-screen bg-background relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-40 right-10 w-32 h-32 opacity-10 pointer-events-none">
        <Image src="/images/hearts-1.png" alt="" fill className="object-contain" />
      </div>
      <div className="absolute top-96 left-10 w-24 h-24 opacity-10 pointer-events-none">
        <Image src="/images/hearts-2.png" alt="" fill className="object-contain" />
      </div>
      
      {/* Breadcrumb */}
      <div className="container mx-auto px-6 py-6 text-sm text-purple-900/60 relative z-10">
        <Link href="/" className="hover:text-primary transition-colors">Home</Link>
        <span className="mx-2 text-pink-300">/</span>
        <Link href="/collection" className="hover:text-primary capitalize transition-colors">{product.category}</Link>
        <span className="mx-2 text-pink-300">/</span>
        <span className="text-secondary font-medium">{product.name}</span>
      </div>

      <div className="container mx-auto px-6 mb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-24">
          
          {/* Image Gallery */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="bg-white p-4 rounded-3xl shadow-xl shadow-purple-900/5 aspect-[4/5] w-full overflow-hidden relative">
              <div className="absolute top-0 right-0 w-full h-full bg-gradient-to-tr from-purple-100/50 to-pink-100/50 rounded-2xl pointer-events-none" />
              <motion.img 
                key={selectedImageIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3 }}
                src={product.images?.[selectedImageIndex] || product.image} 
                alt={`${product.name} - Afbeelding ${selectedImageIndex + 1}`}
                className="w-full h-full object-cover object-center rounded-2xl"
              />
            </div>
            
            {/* Thumbnail Navigation */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3 justify-center">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedImageIndex(index)}
                    className={`
                      w-16 h-16 rounded-xl overflow-hidden transition-all duration-200
                      ${index === selectedImageIndex 
                        ? 'ring-2 ring-purple-600 ring-offset-2 shadow-lg' 
                        : 'opacity-60 hover:opacity-100 hover:shadow-md'}
                    `}
                  >
                    <img
                      src={image}
                      alt={`${product.name} thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="flex flex-col justify-center h-full">
            <div className="flex flex-wrap gap-2 mb-4">
              {product.isNew && (
                <span className="inline-block w-fit bg-gradient-to-r from-primary to-secondary text-white text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full shadow-md">Nieuw Binnen</span>
              )}
            </div>
            <h1 className="font-serif text-4xl md:text-5xl mb-4 text-[#4a044e]">{product.name}</h1>
            <p className="text-lg font-light mb-8 text-stone-600">
              Handgemaakt • Betaalbaar • Uniek
            </p>

            {/* Description with Read More */}
            <div className="prose prose-sm text-purple-900/70 mb-8 max-w-md">
              <p>
                {showFullDescription ? product.description : truncatedDescription}
              </p>
              {shouldShowReadMore && (
                <button
                  onClick={() => setShowFullDescription(!showFullDescription)}
                  className="text-purple-600 hover:text-purple-800 font-medium text-sm underline mt-2 transition-colors"
                >
                  {showFullDescription ? 'Minder tonen' : 'Meer lezen'}
                </button>
              )}
            </div>


            <div className="space-y-4 max-w-md">
              {product.etsyUrl ? (
                <>
                  <EtsyButton 
                    etsyUrl={product.etsyUrl}
                    productName={product.name}
                    size="lg"
                    className="w-full shadow-xl shadow-purple-900/10"
                  />
                  <p className="text-center text-sm text-purple-900/70 leading-relaxed">
                    Je wordt doorgeleid naar Etsy voor een veilige betaling. Profiteer van Etsy's koopbescherming!
                  </p>
                  {!product.inStock && (
                    <p className="text-center text-sm text-orange-600 font-semibold">
                      ⚠️ Momenteel niet op voorraad
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center space-y-4">
                  <a
                    href="https://www.etsy.com/shop/LaNinaBracelets"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block"
                  >
                    <Button size="lg" className="w-full h-14 text-lg bg-stone-900 hover:bg-stone-700 text-white uppercase tracking-widest">
                      Bekijk op Etsy Shop
                    </Button>
                  </a>
                  <p className="text-center text-xs text-stone-500 font-light">
                    Veilig betalen via Etsy • Wereldwijde verzending • Buyer Protection
                  </p>
                </div>
              )}
            </div>

            {/* Etsy Benefits */}
            <div className="mt-12 pt-12 border-t border-stone-200">
              <div className="text-center space-y-3">
                <p className="text-sm font-light text-stone-600">
                  Handgemaakt met zorg • Betaalbare elegantie • Unieke stukken
                </p>
                <p className="text-xs text-stone-500">
                  Verzending en retourbeleid via Etsy
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {relatedProducts.length > 0 && (
        <section className="bg-gradient-to-b from-purple-50/50 to-white py-24 relative overflow-hidden">
          {/* Gold Accent */}
          <div className="absolute top-0 left-0 w-full h-24 bg-gradient-to-r from-gold-light via-gold to-gold-dark opacity-15 pointer-events-none" />
          {/* Decorative Hearts */}
          <div className="absolute top-20 right-20 w-28 h-28 opacity-15 pointer-events-none">
            <Image src="/images/hearts-1.png" alt="" fill className="object-contain" />
          </div>
          
          <div className="container mx-auto px-6 relative z-10">
            <h2 className="font-elegant italic text-4xl mb-12 text-center text-[#4a044e]">Dit vind je misschien ook leuk</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedProducts.map(p => (
                <div key={p.id}>
                   <ProductCard product={p} />
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}

