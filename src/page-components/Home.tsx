'use client';

import React from 'react';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Star, Heart, Layers } from 'lucide-react';
import Link from 'next/link';
import { Product } from '../lib/data';
import { ProductCard } from '../components-next/ProductCard';
import { Button } from '../components/ui/Button';
import { InstagramSection } from '../components/InstagramSection';

interface HomeProps {
  products: Product[];
}

export function Home({ products = [] }: HomeProps) {
  const featuredProducts = products.slice(0, 3);

  return (
    <div className="w-full bg-background">
      {/* Hero Section */}
      <section className="relative min-h-screen w-full overflow-hidden bg-warm-beige pt-24">
        <div className="absolute inset-0 top-0">
          <img
            src="https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=2600&auto=format&fit=crop"
            alt="Handgemaakte gouden armbanden en sieraden collectie door La Nina Bracelets"
            className="w-full h-full object-cover object-center opacity-30"
          />
        </div>
        
        {/* Decorative Hearts - Very Subtle */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 0.04, x: 0 }}
          transition={{ delay: 0.8, duration: 1 }}
          className="absolute top-32 right-20 w-40 h-40 pointer-events-none"
        >
          <Image src="/images/hearts-1.png" alt="" fill className="object-contain" />
        </motion.div>
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 0.04, y: 0 }}
          transition={{ delay: 1.2, duration: 1.2 }}
          className="absolute bottom-32 left-20 w-32 h-32 pointer-events-none"
        >
          <Image src="/images/hearts-2.png" alt="" fill className="object-contain" />
        </motion.div>
        
        <div className="relative h-full container mx-auto px-6 flex flex-col justify-center py-32">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-6xl md:text-7xl lg:text-8xl mb-8 leading-[1.1] max-w-4xl text-stone-900"
          >
            Tijdloze<br/>
            Elegantie
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-lg md:text-xl font-light text-stone-600 mb-12 max-w-2xl leading-relaxed"
          >
            Ontdek onze collectie van ambachtelijke armbanden ontworpen om jouw dagelijkse momenten te verrijken.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Link href="/collection">
              <Button size="lg">
                Bekijk de Collectie
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-32 bg-white relative overflow-hidden">
        {/* Decorative Hearts */}
        <div className="absolute top-10 left-5 w-20 h-20 opacity-20 pointer-events-none">
          <Image src="/images/hearts-2.png" alt="" fill className="object-contain" />
        </div>
        <div className="absolute bottom-10 right-5 w-24 h-24 opacity-20 pointer-events-none">
          <Image src="/images/hearts-1.png" alt="" fill className="object-contain" />
        </div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-20">
             <h2 className="font-serif text-5xl text-stone-900 mb-4">Onze Favorieten</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link href="/collection" className="group relative aspect-[16/9] overflow-hidden rounded-2xl shadow-xl">
              <img 
                src="/images/bracelets.jpg" 
                    alt="Handgemaakte armbanden collectie - La Nina Bracelets"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-stone-900/40 opacity-60 group-hover:opacity-50 transition-opacity" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white font-serif text-5xl tracking-wide">Armbanden</span>
              </div>
            </Link>
            <div className="grid grid-cols-2 gap-6">
              <Link href="/collection" className="group relative aspect-square overflow-hidden rounded-2xl shadow-xl">
                <img 
                  src="/images/earring_shop.jpg" 
                      alt="Handgemaakte oorbellen - unieke ontwerpen"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/40 opacity-60 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-serif text-4xl tracking-wide">Oorbellen</span>
                </div>
              </Link>
              <Link href="/collection" className="group relative aspect-square overflow-hidden rounded-2xl shadow-xl">
                <img 
                    src="/images/necklace_shop.jpg"
                      alt="Handgemaakte kettingen - goud en zilver"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-stone-900/40 opacity-60 group-hover:opacity-50 transition-opacity" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-serif text-4xl tracking-wide">Kettingen</span>
                </div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-32 bg-stone-50 relative overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-4">
            <div>
              <h2 className="font-serif text-4xl mb-2 text-stone-900">Populair Nu</h2>
              <p className="text-stone-600 font-light">Elegante sieraden voor jouw dagelijkse stijl.</p>
            </div>
            <Link href="/collection" className="hidden md:flex items-center gap-2 text-sm uppercase tracking-widest text-stone-900 hover:text-stone-600 transition-colors font-bold">
              Bekijk Alles <ArrowRight size={16} />
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-16 md:hidden flex justify-center">
            <Link href="/collection">
              <Button variant="secondary">Bekijk Alle Producten</Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Brand Story */}
      <section className="py-32 relative overflow-hidden bg-stone-50">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-4xl mx-auto text-center space-y-10">
            <motion.span 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-xs uppercase tracking-widest text-stone-500 font-bold"
            >
              Onze Filosofie
            </motion.span>
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="font-serif text-5xl md:text-6xl leading-tight text-stone-900"
            >
              Schoonheid hoeft<br/>niet duur te zijn.
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="space-y-6 text-stone-600 text-base md:text-lg font-light leading-relaxed max-w-3xl mx-auto"
            >
              <p>
                Nina begon La Nina Bracelets vanuit een droom: mooie, handgemaakte sieraden creëren die voor 
                iedereen toegankelijk zijn. Als jonge onderneemster gelooft ze dat schoonheid niet duur hoeft 
                te zijn, en dat elk persoon het recht heeft om zich speciaal te voelen.
              </p>
              <p>
                Haar inspiratie komt uit het alledaagse leven - de manier waarop licht door een raam valt, 
                de kleuren van bloemen op de markt, of de textuur van een oude muur. Nina werkt vanuit haar 
                atelier in Amsterdam, waar elk sieraad met de hand wordt gemaakt met persoonlijke zorg en aandacht.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
            >
              <Link href="/about">
                <Button variant="secondary" className="mt-8 px-8 py-6 text-base">
                  Ontdek Nina's Verhaal
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Styling Tips Section */}
      <section className="py-32 bg-gradient-to-b from-white to-stone-50/30">
        <div className="container mx-auto px-6 md:px-12">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight mb-4"
            >
              Styling Tips
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-stone-600 font-light text-lg"
            >
              Hoe draag je onze sieraden?
            </motion.p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {[
              {
                icon: Layers,
                title: 'Layering',
                description: 'Combineer meerdere armbanden voor een trendy look. Mix verschillende diktes en kleuren voor extra effect.',
              },
              {
                icon: Star,
                title: 'Mix & Match',
                description: 'Combineer goud met zilver voor een moderne twist. Durf te experimenteren met verschillende stijlen.',
              },
              {
                icon: Heart,
                title: 'Persoonlijk Touch',
                description: 'Voeg een armband met initialen toe voor een persoonlijke betekenis. Perfect voor speciale momenten.',
              },
            ].map((tip, index) => (
              <motion.div
                key={tip.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className="text-center group"
              >
                <div className="w-20 h-20 mx-auto mb-6 bg-stone-100 flex items-center justify-center group-hover:bg-stone-200 transition-colors duration-300">
                  <tip.icon className="w-8 h-8 text-stone-500 group-hover:text-stone-700 transition-colors duration-300" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900 mb-4 tracking-tight">
                  {tip.title}
                </h3>
                <p className="text-stone-600 font-light leading-relaxed max-w-xs mx-auto">
                  {tip.description}
                </p>
              </motion.div>
            ))}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-center mt-16"
          >
            <Link href="/collection">
              <Button variant="secondary" className="px-8 py-4 uppercase tracking-widest">
                Ontdek Onze Collectie
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Subtle Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-stone-200/50 to-transparent"></div>

      {/* Instagram Section */}
      <InstagramSection />

      {/* Newsletter Section */}
      <section className="py-32 bg-stone-50 relative overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="font-serif text-4xl md:text-5xl text-stone-900"
            >
              Blijf op de Hoogte
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-stone-600 font-light text-lg"
            >
              Schrijf je in voor onze nieuwsbrief en ontvang als eerste nieuws over nieuwe collecties, exclusieve aanbiedingen en verhalen achter de sieraden.
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto"
            >
              <input 
                type="email" 
                placeholder="Jouw e-mailadres" 
                className="flex-1 px-6 py-4 border border-stone-300 bg-white text-stone-900 placeholder-stone-400 focus:outline-none focus:border-stone-900 transition-colors font-light"
              />
              <Button className="sm:w-auto whitespace-nowrap px-8 py-4">
                Schrijf In
              </Button>
            </motion.div>
            <p className="text-xs text-stone-500 font-light">
              We respecteren jouw privacy. Geen spam, alleen mooie verhalen.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

