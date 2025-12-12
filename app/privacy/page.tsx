import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Privacybeleid',
  description: 'Privacybeleid van La Nina Bracelets - Hoe wij omgaan met jouw gegevens',
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8">Privacybeleid</h1>
        
        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-stone-600 font-light mb-8">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">1. Wie zijn wij?</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              La Nina Bracelets is een webshop voor handgemaakte sieraden, gevestigd in Amsterdam. 
              Wij verkopen onze producten via Etsy. Deze website dient als showcase voor onze collectie.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">2. Welke gegevens verzamelen wij?</h2>
            <p className="text-stone-600 font-light leading-relaxed mb-4">
              Op deze website verzamelen wij de volgende gegevens:
            </p>
            <ul className="list-disc pl-6 text-stone-600 font-light space-y-2">
              <li><strong>E-mailadres:</strong> Als je je aanmeldt voor onze nieuwsbrief</li>
              <li><strong>Analytische gegevens:</strong> Anonieme gegevens over websitegebruik via Google Analytics (alleen met jouw toestemming)</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">3. Cookies</h2>
            <p className="text-stone-600 font-light leading-relaxed mb-4">
              Wij gebruiken de volgende soorten cookies:
            </p>
            <ul className="list-disc pl-6 text-stone-600 font-light space-y-2">
              <li><strong>Noodzakelijke cookies:</strong> Voor de basisfunctionaliteit van de website</li>
              <li><strong>Analytische cookies:</strong> Google Analytics om te begrijpen hoe bezoekers onze site gebruiken (alleen met toestemming)</li>
            </ul>
            <p className="text-stone-600 font-light leading-relaxed mt-4">
              Je kunt je cookie-voorkeuren altijd aanpassen via de "Cookie-instellingen" link onderaan de pagina.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">4. Nieuwsbrief</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Als je je aanmeldt voor onze nieuwsbrief, gebruiken wij Mailchimp om deze te verzenden. 
              Je e-mailadres wordt opgeslagen bij Mailchimp en gebruikt om je onze nieuwsbrief te sturen. 
              Je kunt je op elk moment uitschrijven via de link onderaan elke e-mail.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">5. Aankopen via Etsy</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Alle aankopen worden verwerkt via Etsy. Voor informatie over hoe Etsy omgaat met jouw 
              gegevens, verwijzen wij naar het{' '}
              <a 
                href="https://www.etsy.com/nl/legal/privacy/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-900 underline hover:text-stone-600"
              >
                privacybeleid van Etsy
              </a>.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">6. Jouw rechten</h2>
            <p className="text-stone-600 font-light leading-relaxed mb-4">
              Je hebt het recht om:
            </p>
            <ul className="list-disc pl-6 text-stone-600 font-light space-y-2">
              <li>Inzage te vragen in je persoonsgegevens</li>
              <li>Je gegevens te laten corrigeren of verwijderen</li>
              <li>Je toestemming in te trekken</li>
              <li>Een klacht in te dienen bij de Autoriteit Persoonsgegevens</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">7. Contact</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Heb je vragen over dit privacybeleid? Neem contact met ons op via{' '}
              <a 
                href="mailto:info@laninabracelets.com" 
                className="text-stone-900 underline hover:text-stone-600"
              >
                info@laninabracelets.com
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

