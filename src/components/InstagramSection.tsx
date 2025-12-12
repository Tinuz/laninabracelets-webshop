'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Instagram, ExternalLink } from 'lucide-react';
import { Button } from './ui/Button';

interface InstagramPost {
  id: string;
  media_type: 'IMAGE' | 'VIDEO' | 'CAROUSEL_ALBUM';
  media_url: string;
  permalink: string;
  caption?: string;
  timestamp: string;
  thumbnail_url?: string;
}

interface InstagramSectionProps {
  posts: InstagramPost[];
}

export function InstagramSection({ posts = [] }: InstagramSectionProps) {
  // Show 8 posts in a 2x4 grid on mobile, 4x2 on desktop
  const displayPosts = posts.slice(0, 8);

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

        {displayPosts.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {displayPosts.map((post, index) => (
              <motion.a
                key={post.id}
                href={post.permalink}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.05 }}
                className="group relative aspect-square overflow-hidden bg-stone-100 hover:shadow-xl transition-all duration-300"
              >
                {/* Image/Video */}
                <img
                  src={post.media_url}
                  alt={post.caption?.slice(0, 100) || 'La Nina Bracelets Instagram post'}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                
                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Instagram size={32} className="drop-shadow-lg" />
                </div>

                {/* Video indicator */}
                {post.media_type === 'VIDEO' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-stone-900/80 rounded-full flex items-center justify-center">
                    <div className="w-0 h-0 border-l-[6px] border-l-white border-y-[3px] border-y-transparent ml-0.5" />
                  </div>
                )}

                {/* Carousel indicator */}
                {post.media_type === 'CAROUSEL_ALBUM' && (
                  <div className="absolute top-3 right-3 w-6 h-6 bg-stone-900/80 rounded-full flex items-center justify-center">
                    <div className="grid grid-cols-2 gap-0.5">
                      {[...Array(4)].map((_, i) => (
                        <div key={i} className="w-1 h-1 bg-white rounded-full" />
                      ))}
                    </div>
                  </div>
                )}
              </motion.a>
            ))}
          </div>
        ) : (
          /* Fallback when no posts available */
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-16">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <motion.a
                key={i}
                href="https://instagram.com/laninabracelets"
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="aspect-square bg-stone-100 overflow-hidden group relative"
              >
                <img 
                  src={`https://source.unsplash.com/random/400x400?jewelry,bracelet&${i}`} 
                  alt={`Instagram post ${i}`} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                />
                <div className="absolute inset-0 bg-stone-900/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                  <Instagram size={32} />
                </div>
              </motion.a>
            ))}
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
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
    </section>
  );
}
