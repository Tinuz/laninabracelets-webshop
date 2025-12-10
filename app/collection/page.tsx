import { CollectionWrapper } from '@/src/components/CollectionWrapper';
import { getProducts } from '@/src/lib/products';
import type { Metadata } from "next";

export async function generateMetadata({ searchParams }: { searchParams: Promise<{ filter?: string }> }): Promise<Metadata> {
  const { filter } = await searchParams;
  
  if (filter === 'new') {
    return {
      title: "Nieuw Binnen - Handgemaakte Sieraden",
      description: "🆕 Ontdek onze nieuwste handgemaakte sieraden! Unieke armbanden, kettingen en oorbellen door Nina. Gratis verzending vanaf €50.",
      keywords: ["nieuwe sieraden", "nieuw binnen", "handgemaakte armbanden", "nieuwe collectie"],
      openGraph: {
        title: "Nieuw Binnen - La Nina Bracelets",
        description: "Ontdek onze nieuwste handgemaakte sieraden collectie",
        url: "https://www.laninabracelets.com/collection?filter=new",
      },
      alternates: {
        canonical: "https://www.laninabracelets.com/collection?filter=new",
      },
    };
  }
  
  if (filter === 'bestsellers') {
    return {
      title: "Bestsellers - Meest Populaire Sieraden",
      description: "⭐ Onze bestselling handgemaakte sieraden! Meest geliefde armbanden, kettingen en oorbellen. 4.9/5 sterren beoordelingen.",
      keywords: ["bestsellers", "populaire sieraden", "best verkochte armbanden", "favoriete sieraden"],
      openGraph: {
        title: "Bestsellers - La Nina Bracelets", 
        description: "Onze meest geliefde handgemaakte sieraden collectie",
        url: "https://www.laninabracelets.com/collection?filter=bestsellers",
      },
      alternates: {
        canonical: "https://www.laninabracelets.com/collection?filter=bestsellers",
      },
    };
  }
  
  return {
    title: "Sieraden Collectie - Handgemaakte Armbanden, Kettingen & Oorbellen",
    description: "🔗 Volledige collectie handgemaakte sieraden door Nina in Amsterdam. Betaalbare armbanden, kettingen en oorbellen. Uniek design, kwaliteit materialen.",
    keywords: [
      "sieraden collectie",
      "handgemaakte armbanden",
      "kettingen online", 
      "oorbellen kopen",
      "sieraden Amsterdam"
    ],
    openGraph: {
      title: "Sieraden Collectie - La Nina Bracelets",
      description: "Ontdek onze volledige collectie handgemaakte sieraden",
      url: "https://www.laninabracelets.com/collection",
    },
    alternates: {
      canonical: "https://www.laninabracelets.com/collection",
    },
  };
}

export default async function CollectionPage() {
  const products = await getProducts();
  
  return <CollectionWrapper products={products} />;
}

