'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Heart, Sparkles, Award, CheckCircle2 } from 'lucide-react';
import { Button } from '../components/ui/Button';

export function About() {
  return (
    <div className="w-full bg-white">
      {/* Hero Section - Editorial Style */}
      <section className="relative min-h-screen overflow-hidden bg-[#FDFBF7]">
        <div className="absolute inset-0">
          <img 
            src="https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=2600&auto=format&fit=crop" 
            alt="Artisan crafting jewelry" 
            className="w-full h-full object-cover object-center opacity-40"
          />
        </div>
        
        <div className="relative h-full container mx-auto px-6 md:px-12 flex flex-col justify-center py-32">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="max-w-4xl"
          >
            <span className="text-xs uppercase tracking-widest font-bold text-stone-600 mb-6 block">
              Over La Nina Bracelets
            </span>
            <h1 className="font-serif text-5xl md:text-8xl text-stone-900 tracking-tight leading-tight mb-8">
              Schoonheid in<br/>
              elk detail.
            </h1>
            <p className="text-xl md:text-2xl font-light text-stone-600 leading-relaxed max-w-3xl">
              Handgemaakte sieraden die tot de ziel spreken, geboren uit passie voor vakmanschap en puurheid van ontwerp.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story Section - Text Block with Drop Cap */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="prose prose-xl max-w-none"
          >
            <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed first-letter:text-7xl first-letter:font-serif first-letter:font-semibold first-letter:text-stone-900 first-letter:float-left first-letter:mr-3 first-letter:mt-1">
              Nina begon La Nina Bracelets vanuit een droom: mooie, handgemaakte sieraden creëren die voor 
              iedereen toegankelijk zijn. Als jonge onderneemster gelooft ze dat schoonheid niet duur hoeft 
              te zijn, en dat elk persoon het recht heeft om zich speciaal te voelen.
            </p>
            
            <p className="text-lg md:text-xl font-light text-stone-600 leading-relaxed mt-8">
              Haar inspiratie komt uit het alledaagse leven - de manier waarop licht door een raam valt, 
              de kleuren van bloemen op de markt, of de textuur van een oude bakstenen muur. Deze momenten 
              van schoonheid vertaalt Nina naar unieke sieraden die verhalen vertellen en herinneringen bewaren.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Image + Text Asymmetrical Grid */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="aspect-[4/5] bg-stone-100 overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1611652022419-a9419f74343a?q=80&w=1200&auto=format&fit=crop" 
                alt="Handcrafting process"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight">
                Ambachtelijk Vakmanschap
              </h2>
            <p className="text-lg font-light text-stone-600 leading-relaxed">
              Nina werkt vanuit haar atelier in Amsterdam, waar elk sieraad met de hand wordt gemaakt. 
              Elke curve, sluiting en kraal wordt zorgvuldig gekozen en geplaatst. Door gebruik te maken van 
              hoogwaardige maar betaalbare materialen, houdt Nina haar sieraden toegankelijk zonder in te boeten op kwaliteit.
            </p>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-500 mt-1 flex-shrink-0" />
                  <span className="text-stone-600 font-light">Handgemaakt door Nina in Amsterdam</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-500 mt-1 flex-shrink-0" />
                  <span className="text-stone-600 font-light">Betaalbaar zonder kwaliteitsverlies</span>
                </div>
                <div className="flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-stone-500 mt-1 flex-shrink-0" />
                  <span className="text-stone-600 font-light">Geïnspireerd door het dagelijks leven</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Zig-zag Layout - Reversed */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-7xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-2 space-y-8"
            >
              <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight">
                Het Verhaal van Nina
              </h2>
              <div className="space-y-6">
                <p className="text-lg font-light text-stone-600 leading-relaxed">
                  La Nina Bracelets is het verhaal van Nina, een jonge creatieve ziel met een passie voor 
                  handgemaakte sieraden. De naam "La Nina" is een speelse verwijzing naar haar voornaam, 
                  maar staat symbool voor iets veel groters: toegankelijke schoonheid voor iedereen.
                </p>
                <p className="text-lg font-light text-stone-600 leading-relaxed">
                  Nina gelooft dat mooie sieraden niet alleen voor de happy few moeten zijn. Haar missie is om 
                  stukken te creëren die niet alleen prachtig zijn, maar vooral betaalbaar blijven. Inspiratie 
                  vindt ze in de kleine, dagelijkse momenten om haar heen - van de kleuren van een zonsondergang 
                  tot de textuur van een oude muur.
                </p>
              </div>
            </motion.div>
            
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:order-1 aspect-[4/5] bg-stone-100 overflow-hidden"
            >
              <img 
                src="https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1200&auto=format&fit=crop" 
                alt="La Nina jewelry collection"
                className="w-full h-full object-cover hover:scale-105 transition-transform duration-700"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Pull Quote Section */}
      <section className="py-32 bg-[#FDFBF7]">
        <div className="container mx-auto px-6 md:px-12 max-w-4xl text-center">
          <motion.blockquote 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <p className="font-serif text-4xl md:text-5xl text-stone-900 leading-relaxed tracking-tight">
              "Schoonheid hoeft niet duur te zijn. Elk persoon verdient het om zich speciaal te voelen."
            </p>
            <footer className="text-stone-500 font-light">
              — Nina, Oprichtster La Nina Bracelets
            </footer>
          </motion.blockquote>
        </div>
      </section>

      {/* Values Grid */}
      <section className="py-32 bg-white">
        <div className="container mx-auto px-6 md:px-12 max-w-6xl">
          <div className="text-center mb-20">
            <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight mb-4">
              Onze Waarden
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: Heart,
                title: 'Handgemaakt',
                description: 'Nina maakt elk stuk met de hand in haar Amsterdamse atelier, met oog voor detail en persoonlijke touch.',
              },
              {
                icon: Award,
                title: 'Betaalbaar',
                description: 'Mooie sieraden moeten voor iedereen toegankelijk zijn. Nina houdt prijzen eerlijk zonder in te boeten op kwaliteit.',
              },
              {
                icon: Sparkles,
                title: 'Geïnspireerd',
                description: 'Dagelijkse momenten vormen de inspiratie - van kleurrijke marktkraampjes tot het spel van licht en schaduw.',
              },
            ].map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="text-center space-y-6"
              >
                <div className="w-16 h-16 mx-auto bg-stone-100 flex items-center justify-center">
                  <value.icon className="w-8 h-8 text-stone-500" />
                </div>
                <h3 className="font-serif text-2xl text-stone-900">
                  {value.title}
                </h3>
                <p className="text-stone-600 font-light leading-relaxed">
                  {value.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 bg-stone-50">
        <div className="container mx-auto px-6 md:px-12 text-center">
          <h2 className="font-serif text-4xl md:text-5xl text-stone-900 tracking-tight mb-8">
            Ontdek Onze Collectie
          </h2>
          <p className="text-lg font-light text-stone-600 mb-12 max-w-2xl mx-auto">
            Vind jouw perfecte sieraad en maak je look compleet met onze handgemaakte creaties.
          </p>
          <Link href="/collection">
            <Button size="lg" className="px-10 py-4">
              Shop Nu
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}