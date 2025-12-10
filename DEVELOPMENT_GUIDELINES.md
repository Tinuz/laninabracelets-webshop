# Ontwikkelingsinstructies - LaNinaBracelets Webshop

## Project Overzicht

Dit is een luxe e-commerce webshop voor LaNinaBracelets, gebouwd met moderne web technologieën. Het project richt zich op een premium gebruikerservaring met elegante animaties en een responsive design.

## Tech Stack

### Core Technologieën
- **Next.js** (App Router) - React framework voor productie
- **TypeScript** - Type-safe JavaScript
- **Tailwind CSS** - Utility-first CSS framework

### Aanvullende Libraries
- **Framer Motion** - Animaties en transitions
- **Lucide React** - Icon library
- **React Context API** - State management (winkelwagen)

## Code Conventies

### TypeScript

#### Strikte Type Definities
```typescript
// ✅ CORRECT: Expliciete types voor props en return values
interface ProductProps {
  id: string;
  name: string;
  price: number;
  image: string;
}

export function ProductCard({ id, name, price, image }: ProductProps): JSX.Element {
  // implementation
}

// ❌ INCORRECT: Any types vermijden
function ProductCard(props: any) {
  // implementation
}
```

#### Type Safety
- Gebruik **geen** `any` types tenzij absoluut noodzakelijk
- Definieer interfaces voor alle component props
- Gebruik type guards voor runtime checks
- Maak gebruik van utility types: `Partial<T>`, `Pick<T>`, `Omit<T>`

### Next.js Specifiek

#### App Router Structuur
```
app/
  ├── layout.tsx          # Root layout
  ├── page.tsx            # Home page
  ├── collection/
  │   └── page.tsx        # Collection page
  ├── product/
  │   └── [id]/
  │       └── page.tsx    # Dynamic product page
  └── api/                # API routes (indien nodig)
```

#### Server vs Client Components
```typescript
// Server Component (standaard)
// ✅ Gebruik voor data fetching, geen interactiviteit
export default async function ProductPage({ params }: { params: { id: string } }) {
  const product = await getProduct(params.id);
  return <ProductDetail product={product} />;
}

// Client Component
// ✅ Gebruik 'use client' voor interactiviteit, hooks, event handlers
'use client';

export function CartButton() {
  const [isOpen, setIsOpen] = useState(false);
  // ...
}
```

#### Richtlijnen Component Type
- **Server Components**: Data fetching, statische content, SEO-kritische content
- **Client Components**: Interactieve elementen, useState/useEffect, event listeners, browser APIs

### Tailwind CSS

#### Styling Conventies
```typescript
// ✅ CORRECT: Gebruik utility classes, groepeer logisch
<div className="
  flex items-center justify-between
  px-4 py-6 md:px-8
  bg-white shadow-sm
  hover:shadow-md transition-shadow
">

// ✅ CORRECT: Gebruik custom classes in globals.css voor herbruikbare patronen
// globals.css
@layer components {
  .btn-primary {
    @apply px-6 py-3 bg-amber-600 text-white rounded-md hover:bg-amber-700 transition-colors;
  }
}

// ❌ INCORRECT: Inline styles vermijden
<div style={{ padding: '20px', background: 'white' }}>
```

#### Responsive Design
- **Mobile-first** aanpak: start met mobile, werk naar desktop
- Gebruik Tailwind breakpoints: `sm:`, `md:`, `lg:`, `xl:`, `2xl:`
- Test op minimaal 3 schermformaten: mobile (375px), tablet (768px), desktop (1440px)

### Component Structuur

#### Bestandsorganisatie
```
components/
  ├── ui/              # Generieke UI componenten (Button, Input, Card)
  ├── layout/          # Layout componenten (Navbar, Footer)
  ├── features/        # Feature-specifieke componenten (CartDrawer, ProductCard)
  └── shared/          # Gedeelde business componenten
```

#### Component Template
```typescript
'use client'; // alleen als nodig

import { type ComponentProps } from 'react';

// Props interface
interface ComponentNameProps {
  // Props definitie
}

// Component definitie
export function ComponentName({ prop1, prop2 }: ComponentNameProps) {
  // Hooks
  // Event handlers
  // Render logic
  
  return (
    <div className="...">
      {/* JSX */}
    </div>
  );
}

// Named export voor tree-shaking
export type { ComponentNameProps };
```

## Features Implementatie

### 1. Product Catalogus
- Gebruik **Server Components** voor product listing
- Implementeer filtering en sortering met URL search params
- Lazy loading voor product afbeeldingen (`next/image`)
- Pagination of infinite scroll voor grote catalogi

### 2. Winkelwagen Functionaliteit
- **Client Component** met React Context voor state
- Persist winkelwagen in localStorage
- Optimistic updates voor betere UX
- Real-time totaal berekeningen

### 3. Product Detail Pagina
- **Dynamic routes** met `[id]` folders
- Image gallery met optimalisatie via `next/image`
- Size selector voor ringen (indien van toepassing)
- Related products sectie

### 4. Animaties
```typescript
// ✅ Gebruik Framer Motion voor complexe animaties
import { motion } from 'framer-motion';

<motion.div
  initial={{ opacity: 0, y: 20 }}
  animate={{ opacity: 1, y: 0 }}
  transition={{ duration: 0.5 }}
>
  {/* content */}
</motion.div>

// ✅ Gebruik CSS transitions voor eenvoudige effecten
<button className="transition-colors hover:bg-amber-700">
```

## Performance Best Practices

### Next.js Optimalisatie
- Gebruik `next/image` voor alle afbeeldingen
- Implementeer proper caching strategies
- Gebruik `loading.tsx` voor loading states
- Implementeer `error.tsx` voor error boundaries
- Enable ISR (Incremental Static Regeneration) waar mogelijk

### Code Splitting
- Gebruik dynamic imports voor grote componenten
```typescript
import dynamic from 'next/dynamic';

const CartDrawer = dynamic(() => import('@/components/CartDrawer'), {
  loading: () => <div>Loading...</div>
});
```

### Data Fetching
- Server Components: Fetch data op component niveau
- Cache waar mogelijk met Next.js caching
- Gebruik parallel data fetching voor betere performance

## Toegankelijkheid (a11y)

### Verplichte Toegankelijkheidseisen
- Alle interactieve elementen moeten keyboard-navigeerbaar zijn
- Gebruik semantische HTML (`<nav>`, `<main>`, `<article>`, etc.)
- Alt tekst voor alle afbeeldingen
- Proper heading hiërarchie (h1 → h2 → h3)
- ARIA labels waar nodig
- Color contrast ratio minimaal 4.5:1 voor normale tekst

```typescript
// ✅ CORRECT: Toegankelijke button
<button
  aria-label="Voeg toe aan winkelwagen"
  className="..."
>
  <ShoppingCart aria-hidden="true" />
  Toevoegen
</button>
```

## SEO Vereisten

### Metadata
```typescript
// app/layout.tsx of page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'LaNinaBracelets - Luxe Sieraden',
  description: 'Ontdek onze collectie handgemaakte armbanden en sieraden',
  openGraph: {
    title: 'LaNinaBracelets',
    description: 'Luxe handgemaakte sieraden',
    images: ['/og-image.jpg'],
  },
};
```

### Structured Data
- Implementeer JSON-LD voor Product schema
- Breadcrumbs voor navigatie
- Organization schema voor bedrijfsinformatie

## Testing

### Test Strategieën
- Unit tests voor utility functies
- Component tests voor UI componenten
- E2E tests voor kritische user flows (checkout, cart)
- Visual regression testing voor styling consistentie

## Git Workflow

### Commit Messages
Gebruik conventional commits:
```
feat: voeg product filtering toe
fix: los winkelwagen totaal berekening op
style: update button styling naar brand colors
refactor: herstructureer product data types
docs: update README met installatie instructies
```

### Branch Naming
```
feature/product-filtering
fix/cart-total-calculation
refactor/type-definitions
```

## Code Review Checklist

Voor elke Pull Request, controleer:
- [ ] TypeScript errors zijn opgelost
- [ ] Geen `any` types gebruikt
- [ ] Tailwind classes zijn gebruikt (geen inline styles)
- [ ] Components zijn properly typed
- [ ] Server/Client components correct gebruikt
- [ ] Images gebruiken `next/image`
- [ ] Toegankelijkheid is gewaarborgd
- [ ] Mobile responsive design
- [ ] Performance optimalisaties toegepast
- [ ] Code is gedocumenteerd waar nodig

## Environment Variables

```env
# .env.local
NEXT_PUBLIC_SITE_URL=https://laninabracelets.com
NEXT_PUBLIC_API_URL=https://api.laninabracelets.com

# Nooit committen naar git!
```

## Deployment

### Build Check
Voor deployment, zorg dat:
```bash
npm run build    # Succesvol
npm run lint     # Geen errors
npm run type-check  # Geen type errors
```

## Bronnen

- [Next.js Documentatie](https://nextjs.org/docs)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Tailwind CSS](https://tailwindcss.com/docs)
- [Framer Motion](https://www.framer.com/motion/)
- [Web Accessibility](https://www.w3.org/WAI/WCAG21/quickref/)

---

**Laatst bijgewerkt**: December 2025

