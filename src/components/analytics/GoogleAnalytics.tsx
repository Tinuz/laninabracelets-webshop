'use client';

import Script from 'next/script';

interface GoogleAnalyticsProps {
  GA_MEASUREMENT_ID: string;
}

export function GoogleAnalytics({ GA_MEASUREMENT_ID }: GoogleAnalyticsProps) {
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${GA_MEASUREMENT_ID}', {
              page_title: document.title,
              page_location: window.location.href,
            });
          `,
        }}
      />
    </>
  );
}

// Event tracking functions
export const trackEvent = (eventName: string, parameters?: Record<string, any>) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, parameters);
  }
};

export const trackPurchase = (transactionId: string, value: number, items: any[]) => {
  trackEvent('purchase', {
    transaction_id: transactionId,
    value: value,
    currency: 'EUR',
    items: items,
  });
};

export const trackAddToCart = (itemId: string, itemName: string, price: number) => {
  trackEvent('add_to_cart', {
    currency: 'EUR',
    value: price,
    items: [{
      item_id: itemId,
      item_name: itemName,
      price: price,
      quantity: 1,
    }],
  });
};

export const trackViewItem = (itemId: string, itemName: string, category: string, price: number) => {
  trackEvent('view_item', {
    currency: 'EUR',
    value: price,
    items: [{
      item_id: itemId,
      item_name: itemName,
      category: category,
      price: price,
    }],
  });
};

// Extend Window interface for TypeScript
declare global {
  interface Window {
    gtag: (...args: any[]) => void;
  }
}
