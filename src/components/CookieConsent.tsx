'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ChevronDown, ChevronUp } from 'lucide-react';
import { 
  hasConsent, 
  acceptAllCookies, 
  acceptNecessaryOnly, 
  saveCookiePreferences,
  getCookiePreferences
} from '../lib/cookies';
import { Button } from './ui/Button';

export function CookieConsent() {
  const [isVisible, setIsVisible] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const [preferences, setPreferences] = useState({
    analytics: true,
    marketing: false,
  });

  useEffect(() => {
    // Check if user has already given consent
    const timer = setTimeout(() => {
      if (!hasConsent()) {
        setIsVisible(true);
      }
    }, 1000); // Small delay for better UX

    return () => clearTimeout(timer);
  }, []);

  const handleAcceptAll = () => {
    acceptAllCookies();
    setIsVisible(false);
  };

  const handleAcceptNecessary = () => {
    acceptNecessaryOnly();
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    saveCookiePreferences(preferences);
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', damping: 25, stiffness: 200 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-4 md:p-6"
      >
        <div className="max-w-4xl mx-auto bg-white border border-stone-200 shadow-2xl">
          {/* Main Banner */}
          <div className="p-6 md:p-8">
            <div className="flex items-start gap-4">
              <div className="hidden md:flex w-12 h-12 bg-stone-100 items-center justify-center flex-shrink-0">
                <Cookie className="w-6 h-6 text-stone-600" />
              </div>
              
              <div className="flex-1">
                <h3 className="font-serif text-xl md:text-2xl text-stone-900 mb-2">
                  Wij gebruiken cookies 🍪
                </h3>
                <p className="text-stone-600 font-light text-sm md:text-base leading-relaxed mb-4">
                  We gebruiken cookies om je ervaring op onze website te verbeteren. 
                  Analytische cookies helpen ons begrijpen hoe bezoekers onze site gebruiken, 
                  zodat we deze kunnen verbeteren.
                </p>

                {/* Cookie Details (Expandable) */}
                <button
                  onClick={() => setShowDetails(!showDetails)}
                  className="flex items-center gap-2 text-sm text-stone-500 hover:text-stone-700 transition-colors mb-4"
                >
                  {showDetails ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  <span>Cookie-instellingen aanpassen</span>
                </button>

                <AnimatePresence>
                  {showDetails && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-stone-200 pt-4 mb-4 space-y-4">
                        {/* Necessary Cookies */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-stone-900 text-sm">Noodzakelijke cookies</h4>
                            <p className="text-xs text-stone-500">
                              Vereist voor de werking van de website. Kunnen niet worden uitgeschakeld.
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <div className="w-12 h-6 bg-stone-900 rounded-full relative cursor-not-allowed opacity-50">
                              <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full" />
                            </div>
                          </div>
                        </div>

                        {/* Analytics Cookies */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-stone-900 text-sm">Analytische cookies</h4>
                            <p className="text-xs text-stone-500">
                              Helpen ons begrijpen hoe bezoekers de website gebruiken (Google Analytics).
                            </p>
                          </div>
                          <button
                            onClick={() => setPreferences(p => ({ ...p, analytics: !p.analytics }))}
                            className={`flex-shrink-0 w-12 h-6 rounded-full relative transition-colors ${
                              preferences.analytics ? 'bg-stone-900' : 'bg-stone-300'
                            }`}
                          >
                            <div 
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                preferences.analytics ? 'right-1' : 'left-1'
                              }`} 
                            />
                          </button>
                        </div>

                        {/* Marketing Cookies */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <h4 className="font-medium text-stone-900 text-sm">Marketing cookies</h4>
                            <p className="text-xs text-stone-500">
                              Worden gebruikt voor gepersonaliseerde advertenties (momenteel niet actief).
                            </p>
                          </div>
                          <button
                            onClick={() => setPreferences(p => ({ ...p, marketing: !p.marketing }))}
                            className={`flex-shrink-0 w-12 h-6 rounded-full relative transition-colors ${
                              preferences.marketing ? 'bg-stone-900' : 'bg-stone-300'
                            }`}
                          >
                            <div 
                              className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${
                                preferences.marketing ? 'right-1' : 'left-1'
                              }`} 
                            />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3">
                  {showDetails ? (
                    <>
                      <Button
                        onClick={handleSavePreferences}
                        className="flex-1 sm:flex-none"
                      >
                        Voorkeuren Opslaan
                      </Button>
                      <button
                        onClick={handleAcceptNecessary}
                        className="text-sm text-stone-500 hover:text-stone-700 underline"
                      >
                        Alleen noodzakelijke
                      </button>
                    </>
                  ) : (
                    <>
                      <Button
                        onClick={handleAcceptAll}
                        className="flex-1 sm:flex-none"
                      >
                        Alles Accepteren
                      </Button>
                      <button
                        onClick={handleAcceptNecessary}
                        className="px-6 py-3 border border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors text-sm font-bold uppercase tracking-widest"
                      >
                        Alleen Noodzakelijke
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Privacy Link */}
          <div className="border-t border-stone-100 px-6 md:px-8 py-3 bg-stone-50">
            <p className="text-xs text-stone-500">
              Door op "Alles Accepteren" te klikken, ga je akkoord met ons{' '}
              <a href="/privacy" className="underline hover:text-stone-700">privacybeleid</a>.
            </p>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}

/**
 * Small button to re-open cookie settings (for footer)
 */
export function CookieSettingsButton() {
  const [, setForceUpdate] = useState(0);

  const handleOpenSettings = () => {
    // Remove consent to show banner again
    if (typeof window !== 'undefined') {
      localStorage.removeItem('lanina_cookie_consent');
      // Force re-render and show banner
      window.location.reload();
    }
  };

  return (
    <button
      onClick={handleOpenSettings}
      className="text-stone-500 hover:text-stone-300 transition-colors text-sm"
    >
      Cookie-instellingen
    </button>
  );
}

