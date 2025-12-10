'use client';

import Script from 'next/script';

interface OrganizationSchemaProps {
  name: string;
  url: string;
  logo: string;
  description: string;
  address?: {
    streetAddress: string;
    addressLocality: string;
    postalCode: string;
    addressCountry: string;
  };
  contactPoint?: {
    telephone: string;
    contactType: string;
    email: string;
  };
  socialMedia?: string[];
}

export function OrganizationSchema({
  name,
  url,
  logo,
  description,
  address,
  contactPoint,
  socialMedia = []
}: OrganizationSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": name,
    "url": url,
    "logo": logo,
    "description": description,
    "foundingDate": "2023",
    "founder": {
      "@type": "Person",
      "name": "Nina",
      "jobTitle": "Jewelry Designer & Founder"
    },
    ...(address && {
      "address": {
        "@type": "PostalAddress",
        "streetAddress": address.streetAddress,
        "addressLocality": address.addressLocality,
        "postalCode": address.postalCode,
        "addressCountry": address.addressCountry
      }
    }),
    ...(contactPoint && {
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": contactPoint.telephone,
        "contactType": contactPoint.contactType,
        "email": contactPoint.email,
        "availableLanguage": "Dutch"
      }
    }),
    ...(socialMedia.length > 0 && {
      "sameAs": socialMedia
    })
  };

  return (
    <Script
      id="organization-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface ProductSchemaProps {
  product: {
    name: string;
    description: string;
    image: string[];
    price: number;
    currency: string;
    availability: 'InStock' | 'OutOfStock' | 'PreOrder';
    category: string;
    brand: string;
    sku?: string;
    aggregateRating?: {
      ratingValue: number;
      reviewCount: number;
    };
  };
}

export function ProductSchema({ product }: ProductSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": product.image,
    "brand": {
      "@type": "Brand",
      "name": product.brand
    },
    "category": product.category,
    ...(product.sku && { "sku": product.sku }),
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": product.currency,
      "availability": `https://schema.org/${product.availability}`,
      "seller": {
        "@type": "Organization",
        "name": "La Nina Bracelets"
      },
      "shippingDetails": {
        "@type": "OfferShippingDetails",
        "shippingRate": {
          "@type": "MonetaryAmount",
          "value": "0",
          "currency": "EUR"
        },
        "deliveryTime": {
          "@type": "ShippingDeliveryTime",
          "handlingTime": {
            "@type": "QuantitativeValue",
            "minValue": 1,
            "maxValue": 3,
            "unitCode": "DAY"
          },
          "transitTime": {
            "@type": "QuantitativeValue", 
            "minValue": 2,
            "maxValue": 5,
            "unitCode": "DAY"
          }
        }
      }
    },
    ...(product.aggregateRating && {
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": product.aggregateRating.ratingValue,
        "reviewCount": product.aggregateRating.reviewCount
      }
    })
  };

  return (
    <Script
      id={`product-schema-${product.name.replace(/\s+/g, '-').toLowerCase()}`}
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface WebsiteSchemaProps {
  name: string;
  url: string;
  description: string;
  potentialAction?: {
    target: string;
    queryInput: string;
  };
}

export function WebsiteSchema({ name, url, description, potentialAction }: WebsiteSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": name,
    "url": url,
    "description": description,
    ...(potentialAction && {
      "potentialAction": {
        "@type": "SearchAction",
        "target": {
          "@type": "EntryPoint",
          "urlTemplate": potentialAction.target
        },
        "query-input": potentialAction.queryInput
      }
    })
  };

  return (
    <Script
      id="website-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface BreadcrumbSchemaProps {
  items: {
    name: string;
    url: string;
  }[];
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url
    }))
  };

  return (
    <Script
      id="breadcrumb-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}

interface FAQSchemaProps {
  faqs: {
    question: string;
    answer: string;
  }[];
}

export function FAQSchema({ faqs }: FAQSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": faqs.map(faq => ({
      "@type": "Question",
      "name": faq.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": faq.answer
      }
    }))
  };

  return (
    <Script
      id="faq-schema"
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
