import type { Metadata } from "next";
import { Playfair_Display, Lato } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/src/components-next/Navbar";
import { Footer } from "@/src/components-next/Footer";
import { OrganizationSchema, WebsiteSchema } from "@/src/components/seo/StructuredData";
import { GoogleAnalytics } from "@/src/components/analytics/GoogleAnalytics";
import { CookieConsent } from "@/src/components/CookieConsent";

const playfairDisplay = Playfair_Display({ 
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
  weight: ['400', '600'],
});

const lato = Lato({ 
  subsets: ["latin"],
  variable: "--font-lato",
  display: "swap",
  weight: ['300', '400', '700'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://www.laninabracelets.com'),
  title: {
    default: "La Nina Bracelets - Handgemaakte Sieraden | Betaalbare Armbanden, Kettingen & Oorbellen",
    template: "%s | La Nina Bracelets"
  },
  description: "✨ Handgemaakte sieraden door Nina in Amsterdam. Betaalbare armbanden, kettingen & oorbellen. Gratis verzending vanaf €50. 30 dagen retour. ⭐ 4.9/5 sterren",
  keywords: [
    "handgemaakte sieraden", 
    "betaalbare armbanden", 
    "kettingen handgemaakt", 
    "oorbellen Amsterdam", 
    "sieraden online kopen",
    "La Nina Bracelets",
    "Nina sieraden",
    "unieke armbanden",
    "gouden kettingen",
    "zilveren oorbellen"
  ],
  authors: [{ name: "Nina", url: "https://www.laninabracelets.com/about" }],
  creator: "Nina - La Nina Bracelets",
  publisher: "La Nina Bracelets",
  category: "sieraden",
  openGraph: {
    type: "website",
    locale: "nl_NL",
    url: "https://www.laninabracelets.com",
    title: "La Nina Bracelets - Handgemaakte Sieraden door Nina",
    description: "Betaalbare, handgemaakte sieraden gemaakt met liefde in Amsterdam. Ontdek unieke armbanden, kettingen en oorbellen.",
    siteName: "La Nina Bracelets",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "La Nina Bracelets - Handgemaakte Sieraden Collection",
        type: "image/jpeg"
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@laninabracelets",
    creator: "@laninabracelets",
    title: "La Nina Bracelets - Handgemaakte Sieraden",
    description: "Betaalbare, handgemaakte sieraden gemaakt met liefde in Amsterdam door Nina",
    images: ["/og-image.jpg"]
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://www.laninabracelets.com",
    languages: {
      'nl-NL': 'https://www.laninabracelets.com',
    }
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="nl" className={`${playfairDisplay.variable} ${lato.variable}`}>
      <head>
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/images/logo_trns.png" />
        <meta name="theme-color" content="#1c1917" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="La Nina" />
        <meta name="google-site-verification" content="ICgVWYgcilS9zSfEc39q_KVccmR4ocR59xFZAtKthqI" />
      </head>
      <body className="font-sans antialiased">
        <GoogleAnalytics measurementId="G-9VX19LKH01" />
        <OrganizationSchema
          name="La Nina Bracelets"
          url="https://www.laninabracelets.com"
          logo="https://www.laninabracelets.com/images/logo_trns.png"
          description="Handgemaakte sieraden door Nina in Amsterdam. Betaalbare armbanden, kettingen en oorbellen gemaakt met liefde."
          address={{
            streetAddress: "Amsterdam",
            addressLocality: "Amsterdam", 
            postalCode: "1000 AA",
            addressCountry: "NL"
          }}
          contactPoint={{
            telephone: "+31-20-1234567",
            contactType: "customer service",
            email: "info@laninabracelets.com"
          }}
          socialMedia={[
            "https://instagram.com/laninabracelets",
            "https://facebook.com/laninabracelets"
          ]}
        />
        <WebsiteSchema
          name="La Nina Bracelets"
          url="https://www.laninabracelets.com"
          description="Handgemaakte sieraden online kopen bij La Nina Bracelets"
          potentialAction={{
            target: "https://www.laninabracelets.com/collection?search={search_term}",
            queryInput: "required name=search_term"
          }}
        />
        <Navbar />
        <main className="min-h-screen">
          {children}
        </main>
        <Footer />
        <CookieConsent />
      </body>
    </html>
  );
}

