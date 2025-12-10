import { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = 'https://www.laninabracelets.com';
  
  const routes = [
    '',
    '/collection',
    '/collection?filter=new',
    '/collection?filter=bestsellers', 
    '/about',
  ];

  const staticPages = routes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: (route === '' ? 'daily' : route.includes('collection') ? 'weekly' : 'monthly') as const,
    priority: route === '' ? 1 : route.includes('collection') ? 0.8 : 0.6,
  }));

  // Add product pages dynamically (when products are available)
  // This would be populated with actual product IDs from your database
  const productIds = ['1', '2', '3', '4', '5', '6', '7', '8']; // Example IDs
  
  const productPages = productIds.map((id) => ({
    url: `${baseUrl}/product/${id}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.7,
  }));

  return [...staticPages, ...productPages];
}
