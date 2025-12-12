import { Metadata } from 'next';
import Link from 'next/link';
import { CheckCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export const metadata: Metadata = {
  title: 'OAuth Succesvol - La Nina Bracelets Admin',
  description: 'Etsy shop succesvol verbonden',
  robots: 'noindex',
};

export default function OAuthSuccessPage() {
  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-xl">
        <div className="bg-white shadow-lg p-8 text-center">
          <div className="w-16 h-16 bg-green-100 mx-auto mb-6 flex items-center justify-center">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          
          <h1 className="font-serif text-3xl text-stone-900 mb-4">
            🎉 Etsy Shop Verbonden!
          </h1>
          
          <p className="text-stone-600 mb-8 leading-relaxed">
            Je Etsy shop is succesvol verbonden met je website. 
            De producten worden nu automatisch opgehaald en getoond aan bezoekers.
          </p>
          
          <div className="space-y-4">
            <Link href="/admin/oauth">
              <Button variant="secondary" className="w-full">
                Ga naar Admin Dashboard
              </Button>
            </Link>
            
            <Link href="/">
              <Button className="w-full">
                Bekijk je Website
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50 text-left">
            <h2 className="font-medium text-blue-900 mb-2">Wat gebeurt er nu?</h2>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>✅ Je producten worden automatisch opgehaald van Etsy</li>
              <li>✅ Bezoekers kunnen je collectie bekijken</li>
              <li>✅ Alle aankopen gaan nog steeds via Etsy</li>
              <li>✅ De verbinding wordt automatisch ververst</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
