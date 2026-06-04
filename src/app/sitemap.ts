import type { MetadataRoute } from 'next';

const BASE_URL = 'https://ansania.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const routes = [
    '',
    '/produk',
    '/flash-sale',
    '/tentang',
    '/kontak',
    '/cara-belanja',
    '/syarat-ketentuan',
    '/kebijakan-privasi',
    '/retur',
    '/pengiriman',
  ];

  const staticUrls: MetadataRoute.Sitemap = routes.map((route) => ({
    url: `${BASE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: 'daily',
    priority: route === '' ? 1.0 : 0.8,
  }));

  return staticUrls;
}
