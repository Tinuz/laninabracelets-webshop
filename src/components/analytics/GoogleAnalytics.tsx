'use client';

import { useEffect, useState } from 'react';
import Script from 'next/script';
import { getCookiePreferences, CookiePreferences } from '@/src/lib/cookies';

interface GoogleAnalyticsProps {
  measurementId: string;
}

export function GoogleAnalytics({ measurementId }: GoogleAnalyticsProps) {
  const [hasConsent, setHasConsent] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check initial consent
    const preferences = getCookiePreferences();
    if (preferences?.analytics) {
      setHasConsent(true);
    }

    // Listen for consent changes
    const handleConsentChange = (event: CustomEvent<CookiePreferences | null>) => {
      if (event.detail?.analytics) {
        setHasConsent(true);
      } else {
        setHasConsent(false);
        // If consent is withdrawn, we could optionally disable tracking
        // but typically page reload is expected
      }
    };

    window.addEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    
    return () => {
      window.removeEventListener('cookieConsentChanged', handleConsentChange as EventListener);
    };
  }, []);

  // Don't render scripts if no consent
  if (!hasConsent) {
    return null;
  }

  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
        onLoad={() => setIsLoaded(true)}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_title: document.title,
              page_location: window.location.href,
              anonymize_ip: true,
            });
          `,
        }}
      />
    </>
  );
}

// Event tracking functions - only track if gtag is available
export const trackEvent = (eventName: string, parameters?: Record<string, unknown>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPageView = (url: string, title: string) => {
  trackEvent('page_view', {
    page_location: url,
    page_title: title,
  });
};

export const trackViewItem = (itemId: string, itemName: string, category: string) => {
  trackEvent('view_item', {
    items: [{
      item_id: itemId,
      item_name: itemName,
      category: category,
    }],
  });
};

export const trackSearch = (searchTerm: string) => {
  trackEvent('search', {
    search_term: searchTerm,
  });
};

export const trackNewsletterSignup = () => {
  trackEvent('newsletter_signup', {
    method: 'website',
  });
};

export const trackOutboundLink = (url: string, linkType: string) => {
  trackEvent('click', {
    event_category: 'outbound',
    event_label: url,
    link_type: linkType,
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: unknown[]) => void;
    dataLayer: unknown[];
  }
}
