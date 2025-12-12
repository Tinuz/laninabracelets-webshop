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

        {/* Instagram Feed - Custom Implementation */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
          className="mb-16"
        >
          {/* Direct Juicer Embed - Simplified */}
          <div 
            className="instagram-feed-wrapper"
            dangerouslySetInnerHTML={{
              __html: `
                <script type="text/javascript" src="https://www.juicer.io/embed/laninabracelets/embed-code.js?per=3&gutter=20&columns=3&color=1c1917&after=1"></script>
              `
            }}
          />
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

      {/* No separate script needed - included in dangerouslySetInnerHTML */}

      {/* Custom Styling for Juicer Feed */}
      <style jsx global>{`
        /* Instagram Feed Wrapper */
        .instagram-feed-wrapper {
          width: 100%;
          margin: 0 auto;
        }
        
        /* Force Juicer to stay in this section */
        .instagram-feed-wrapper .juicer-feed {
          position: relative !important;
          max-width: 100% !important;
          margin: 0 !important;
          padding: 0 !important;
        }
        
        /* Individual Post Styling - La Nina Brand */
        .juicer-feed .feed-item {
          border: none !important;
          border-radius: 0 !important;
          box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1) !important;
          transition: all 0.3s ease !important;
          background: white !important;
          overflow: hidden !important;
        }
        
        .juicer-feed .feed-item:hover {
          transform: translateY(-4px) !important;
          box-shadow: 0 10px 25px -5px rgb(0 0 0 / 0.15) !important;
        }
        
        /* Post Images */
        .juicer-feed .feed-item img {
          width: 100% !important;
          height: auto !important;
          aspect-ratio: 1 / 1 !important;
          object-fit: cover !important;
          border-radius: 0 !important;
          transition: transform 0.3s ease !important;
        }
        
        .juicer-feed .feed-item:hover img {
          transform: scale(1.05) !important;
        }
        
        /* Hide Juicer branding & pagination */
        .juicer-feed .j-credit,
        .juicer-feed .j-paginate,
        .juicer-feed .j-filter,
        .juicer-feed .j-message {
          display: none !important;
        }
        
        /* Font Styling */
        .juicer-feed * {
          font-family: var(--font-lato), sans-serif !important;
        }
        
        /* Links */
        .juicer-feed a {
          color: #1c1917 !important; /* stone-900 */
          text-decoration: none !important;
          transition: color 0.3s ease !important;
        }
        
        .juicer-feed a:hover {
          color: #44403c !important; /* stone-700 */
        }
        
        /* Responsive Grid - Override Juicer's grid */
        @media (max-width: 640px) {
          .juicer-feed .feed-item {
            width: 100% !important;
            margin: 0 0 1.5rem 0 !important;
          }
        }
        
        @media (min-width: 640px) {
          .juicer-feed {
            display: flex !important;
            flex-wrap: wrap !important;
            gap: 1.5rem !important;
            justify-content: center !important;
          }
          
          .juicer-feed .feed-item {
            width: calc(33.333% - 1rem) !important;
            margin: 0 !important;
            flex: 0 0 auto !important;
          }
        }
      `}</style>
    </section>
  );
}
