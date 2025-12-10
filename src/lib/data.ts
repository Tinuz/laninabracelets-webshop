export interface Product {
  id: string;
  name: string;
  price: number;
  currency?: string;
  category: 'rings' | 'necklaces' | 'earrings' | 'bracelets' | string;
  image: string;
  images?: string[];
  description: string;
  isNew?: boolean;
  isBestseller?: boolean;
  inStock?: boolean;
  quantity?: number;
  etsyUrl?: string;
  etsyListingId?: number;
  tags?: string[];
}

// Fallback dummy data - will be replaced by Etsy API data
export const PRODUCTS: Product[] = [
  {
    id: '1',
    name: 'Gouden Kralenarmband',
    price: 89,
    currency: 'EUR',
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    images: ['https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop'],
    description: 'Handgemaakte armband met gouden kralen en natuursteen. Elk stuk is uniek en met liefde gemaakt.',
    isNew: true,
    isBestseller: true,
    inStock: true,
    quantity: 1,
  },
  {
    id: '2',
    name: 'Lunar Crescent Necklace',
    price: 890,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1599643478518-17488fbbcd75?q=80&w=1000&auto=format&fit=crop',
    description: 'Delicate crescent moon pendant suspended on a whisper-thin gold chain.',
    isNew: true,
  },
  {
    id: '3',
    name: 'Pearl Drop Earrings',
    price: 450,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?q=80&w=1000&auto=format&fit=crop',
    description: 'Freshwater pearls paired with geometric gold studs for a modern twist on a classic.',
    isBestseller: true,
  },
  {
    id: '4',
    name: 'Helix Gold Bracelet',
    price: 620,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?q=80&w=1000&auto=format&fit=crop',
    description: 'Interwoven gold strands creating a fluid, flexible bracelet that moves with you.',
  },
  {
    id: '5',
    name: 'Obsidiaan Bedel Armband',
    price: 75,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1611652022419-a9419f74343a?q=80&w=1000&auto=format&fit=crop',
    description: 'Handgemaakte armband met natuurlijke obsidiaan kralen. Stijlvol en elegant.',
    isBestseller: true,
  },
  {
    id: '6',
    name: 'Cascade Diamond Necklace',
    price: 2400,
    category: 'necklaces',
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=1000&auto=format&fit=crop',
    description: 'A waterfall of small diamonds creating a shimmering effect on the neckline.',
    isNew: true,
  },
  {
    id: '7',
    name: 'Geometric Hoops',
    price: 320,
    category: 'earrings',
    image: 'https://images.unsplash.com/photo-1630019852942-e5e12f9519d9?q=80&w=1000&auto=format&fit=crop',
    description: 'Angular hoops that catch the light, perfect for everyday statements.',
    isBestseller: true,
  },
  {
    id: '8',
    name: 'Blauwe Edelsteen Armband',
    price: 95,
    category: 'bracelets',
    image: 'https://images.unsplash.com/photo-1602173574767-37ac01994b2a?q=80&w=1000&auto=format&fit=crop',
    description: 'Elegante armband met blauwe edelstenen en zilver. Perfect voor elke gelegenheid.',
  }
];
