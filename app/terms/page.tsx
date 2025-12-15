import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Algemene Voorwaarden',
  description: 'Algemene voorwaarden van La Nina Bracelets',
};

export default function TermsPage() {
  return (
    <div className="pt-32 pb-20 min-h-screen bg-white">
      <div className="container mx-auto px-6 max-w-3xl">
        <h1 className="font-serif text-4xl md:text-5xl text-stone-900 mb-8">Algemene Voorwaarden</h1>
        
        <div className="prose prose-stone max-w-none">
          <p className="text-lg text-stone-600 font-light mb-8">
            Laatst bijgewerkt: {new Date().toLocaleDateString('nl-NL', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">1. Algemeen</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Deze website is eigendom van La Nina Bracelets, gevestigd nabij Amsterdam, Nederland. 
              Door deze website te bezoeken en te gebruiken, ga je akkoord met deze algemene voorwaarden.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">2. Producten en Aankopen</h2>
            <p className="text-stone-600 font-light leading-relaxed mb-4">
              Alle producten op deze website worden verkocht via ons{' '}
              <a 
                href="https://www.etsy.com/shop/LaNinaBracelets" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-stone-900 underline hover:text-stone-600"
              >
                Etsy-verkoopkanaal
              </a>. 
            </p>
            <p className="text-stone-600 font-light leading-relaxed">
              Voor aankopen gelden de algemene voorwaarden van Etsy. Bezoek de Etsy-pagina voor informatie over:
            </p>
            <ul className="list-disc pl-6 text-stone-600 font-light space-y-2 mt-4">
              <li>Verzendkosten en levertijden</li>
              <li>Retourbeleid</li>
              <li>Betalingsmethoden</li>
              <li>Koperbescherming</li>
            </ul>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">3. Handgemaakte Producten</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Al onze sieraden zijn handgemaakt, wat betekent dat elk stuk uniek is. 
              Kleine variaties in kleur, grootte of afwerking zijn normaal en maken deel uit 
              van het ambachtelijke karakter van onze producten.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">4. Intellectueel Eigendom</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Alle content op deze website, inclusief maar niet beperkt tot teksten, afbeeldingen, 
              logo's en ontwerpen, is eigendom van La Nina Bracelets en beschermd door auteursrecht. 
              Het is niet toegestaan om zonder schriftelijke toestemming content te kopiëren of te gebruiken.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">5. Nieuwsbrief</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Door je aan te melden voor onze nieuwsbrief, ga je akkoord met het ontvangen van 
              marketingcommunicatie van La Nina Bracelets. Je kunt je op elk moment uitschrijven 
              via de link onderaan elke e-mail.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">6. Aansprakelijkheid</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Wij doen ons best om alle informatie op deze website correct en up-to-date te houden, 
              maar kunnen niet garanderen dat deze altijd foutloos is. La Nina Bracelets is niet 
              aansprakelijk voor eventuele fouten of onvolledigheden op de website.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">7. Wijzigingen</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Wij behouden ons het recht voor om deze algemene voorwaarden op elk moment te wijzigen. 
              Wijzigingen treden in werking zodra ze op deze pagina zijn gepubliceerd.
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">8. Contact</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Heb je vragen over deze voorwaarden? Neem contact met ons op via{' '}
              <a 
                href="mailto:info@laninabracelets.com" 
                className="text-stone-900 underline hover:text-stone-600"
              >
                info@laninabracelets.com
              </a>
            </p>
          </section>

          <section className="mb-10">
            <h2 className="font-serif text-2xl text-stone-900 mb-4">9. Toepasselijk Recht</h2>
            <p className="text-stone-600 font-light leading-relaxed">
              Op deze voorwaarden is Nederlands recht van toepassing. Eventuele geschillen worden 
              voorgelegd aan de bevoegde rechter in Haarlem.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

