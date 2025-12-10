import { About } from "@/src/page-components/About";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Over Nina - Het Verhaal Achter La Nina Bracelets",
  description: "👩‍🎨 Leer Nina kennen, de creatieve kracht achter La Nina Bracelets. Ontdek hoe ze vanuit Amsterdam betaalbare, handgemaakte sieraden creëert die iedereen kan dragen.",
  keywords: [
    "Nina La Nina Bracelets",
    "over Nina",
    "handgemaakte sieraden Amsterdam", 
    "betaalbare sieraden maker",
    "artisan jeweler Netherlands",
    "handcrafted jewelry story",
    "sieraden ontwerper"
  ],
  openGraph: {
    title: "Over Nina - Het Verhaal Achter La Nina Bracelets",
    description: "Ontdek het verhaal van Nina, de creatieve onderneemster achter La Nina Bracelets",
    url: "https://www.laninabracelets.com/about",
    images: [
      {
        url: "/nina-portrait.jpg",
        width: 800,
        height: 600,
        alt: "Nina - Oprichtster La Nina Bracelets"
      }
    ]
  },
  twitter: {
    card: "summary_large_image",
    title: "Over Nina - La Nina Bracelets",
    description: "Het verhaal van Nina en haar missie: betaalbare schoonheid voor iedereen",
    images: ["/nina-portrait.jpg"]
  },
  alternates: {
    canonical: "https://www.laninabracelets.com/about",
  },
  authors: [{ name: "Nina", url: "https://www.laninabracelets.com/about" }]
};

export default function AboutPage() {
  return <About />;
}

