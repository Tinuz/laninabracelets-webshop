import { Metadata } from 'next';
import Link from 'next/link';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/src/components/ui/Button';

export const metadata: Metadata = {
  title: 'OAuth Fout - La Nina Bracelets Admin',
  description: 'Er ging iets mis bij het verbinden van je Etsy shop',
  robots: 'noindex',
};

interface Props {
  searchParams: Promise<{
    error?: string;
    description?: string;
  }>;
}

const ERROR_MESSAGES: Record<string, { title: string; description: string; solution: string }> = {
  access_denied: {
    title: 'Toegang Geweigerd',
    description: 'Je hebt de toestemming geannuleerd.',
    solution: 'Probeer opnieuw en geef toestemming aan de applicatie.',
  },
  invalid_request: {
    title: 'Ongeldige Aanvraag',
    description: 'Er is een fout in de OAuth configuratie.',
    solution: 'Controleer of alle API instellingen correct zijn.',
  },
  invalid_state: {
    title: 'Beveiligingsfout',
    description: 'De beveiligingscontrole is mislukt (CSRF).',
    solution: 'Probeer opnieuw. Als het probleem aanhoudt, wis je browsercache.',
  },
  missing_parameters: {
    title: 'Ontbrekende Parameters',
    description: 'Etsy heeft niet alle benodigde gegevens teruggestuurd.',
    solution: 'Probeer de OAuth flow opnieuw te starten.',
  },
  token_exchange_failed: {
    title: 'Token Uitwisseling Mislukt',
    description: 'Het uitwisselen van de autorisatiecode voor tokens is mislukt.',
    solution: 'Controleer of je API key correct is ingesteld.',
  },
};

export default async function OAuthErrorPage({ searchParams }: Props) {
  const params = await searchParams;
  const errorCode = params.error || 'unknown';
  const errorDescription = params.description;
  
  const errorInfo = ERROR_MESSAGES[errorCode] || {
    title: 'Onbekende Fout',
    description: errorDescription || 'Er is een onverwachte fout opgetreden.',
    solution: 'Probeer het opnieuw. Als het probleem aanhoudt, neem contact op.',
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-32 pb-20">
      <div className="container mx-auto px-6 max-w-xl">
        <div className="bg-white shadow-lg p-8">
          <div className="w-16 h-16 bg-red-100 mx-auto mb-6 flex items-center justify-center">
            <AlertCircle className="w-8 h-8 text-red-600" />
          </div>
          
          <h1 className="font-serif text-3xl text-stone-900 mb-4 text-center">
            {errorInfo.title}
          </h1>
          
          <p className="text-stone-600 mb-6 text-center">
            {errorInfo.description}
          </p>
          
          <div className="mb-8 p-4 bg-orange-50 border-l-4 border-orange-400">
            <h2 className="font-medium text-orange-900 mb-2">Oplossing:</h2>
            <p className="text-orange-800 text-sm">
              {errorInfo.solution}
            </p>
          </div>

          {errorDescription && errorCode !== 'token_exchange_failed' && (
            <div className="mb-6 p-3 bg-stone-50 border">
              <h3 className="font-medium text-stone-900 text-sm mb-1">Technische Details:</h3>
              <p className="text-xs text-stone-600 font-mono">
                {errorDescription}
              </p>
            </div>
          )}
          
          <div className="space-y-4">
            <Link href="/admin/oauth">
              <Button className="w-full">
                Probeer Opnieuw
              </Button>
            </Link>
            
            <Link href="/">
              <Button variant="secondary" className="w-full">
                Terug naar Website
              </Button>
            </Link>
          </div>

          <div className="mt-8 p-4 bg-blue-50">
            <h2 className="font-medium text-blue-900 mb-2">Hulp nodig?</h2>
            <p className="text-sm text-blue-800">
              Als je dit probleem blijft ondervinden, controleer dan:
            </p>
            <ul className="text-sm text-blue-800 mt-2 space-y-1">
              <li>• Of je Etsy API key correct is</li>
              <li>• Of de redirect URL juist ingesteld is</li>
              <li>• Of je app de juiste scopes heeft</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
