'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';
import Script from 'next/script';

export function InstagramSection() {
  return (
    <section className="py-32 bg-white relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="font-serif text-4xl md:text-5xl text-stone-900 mb-4"
          >
            #LaNinaBracelets
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-stone-600 font-light"
          >
            Styled by you! Tag ons op Instagram
          </motion.p>
        </div>

        {/* Juicer Instagram Feed */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {/* Juicer Container - styling via CSS below */}
          <div className="juicer-instagram-feed">
            {/* This div will be populated by Juicer */}
            <div id="juicer-feed" data-feed-id="laninabracelets"></div>
          </div>
        </motion.div>

        {/* Call to Action */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
          >
            <a
              href="https://instagram.com/laninabracelets"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button variant="secondary" className="uppercase tracking-widest inline-flex items-center gap-2">
                <Instagram size={18} />
                Volg ons op Instagram
                <ExternalLink size={16} />
              </Button>
            </a>
          </motion.div>
        </div>
      </div>

      {/* Juicer Script - Load with Next.js Script component for optimization */}
      <Script
        src="https://www.juicer.io/embed/laninabracelets/embed-code.js"
        strategy="lazyOnload"
        onLoad={() => {
          console.log('Juicer Instagram feed loaded successfully');
        }}
      />

      {/* Custom Styling for Juicer Feed */}
      <style jsx global>{`
        /* Custom Juicer Styling to match La Nina brand */
        .juicer-feed {
          max-width: 100% !important;
        }
        
        .juicer-feed .j-container {
          margin: 0 auto !important;
          padding: 0 !important;
        }
        
        .juicer-feed .j-message {
          background: #f5f5f4 !important; /* stone-100 */
          border: none !important;
          border-radius: 0 !important;
          color: #57534e !important; /* stone-600 */
          font-family: inherit !important;
          font-weight: 300 !important;
          padding: 2rem !important;
          text-align: center !important;
        }
        
        .juicer-feed .j-message h1 {
          color: #1c1917 !important; /* stone-900 */
          font-family: var(--font-playfair), serif !important;
          font-size: 1.5rem !important;
          font-weight: 600 !important;
          margin-bottom: 1rem !important;
        }
        
        /* Individual post styling */
        .juicer-feed .feed-item {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
          margin-bottom: 1rem !important;
          transition: transform 0.3s ease, box-shadow 0.3s ease !important;
        }
        
        .juicer-feed .feed-item:hover {
          transform: translateY(-2px) !important;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.1) !important;
        }
        
        /* Hide Juicer branding if needed */
        .juicer-feed .j-paginate {
          background: #1c1917 !important; /* stone-900 */
          color: white !important;
          border: none !important;
          border-radius: 0 !important;
          font-family: var(--font-lato), sans-serif !important;
          font-weight: 700 !important;
          text-transform: uppercase !important;
          letter-spacing: 0.1em !important;
          padding: 0.75rem 2rem !important;
          transition: background-color 0.3s ease !important;
        }
        
        .juicer-feed .j-paginate:hover {
          background: #44403c !important; /* stone-700 */
        }
        
        /* Responsive grid for Juicer */
        .juicer-feed .j-container .feed-item {
          width: calc(50% - 0.5rem) !important;
          margin-right: 0.5rem !important;
          margin-bottom: 1rem !important;
        }
        
        @media (min-width: 768px) {
          .juicer-feed .j-container .feed-item {
            width: calc(25% - 0.75rem) !important;
            margin-right: 1rem !important;
          }
        }
      `}</style>
    </section>
  );
}
