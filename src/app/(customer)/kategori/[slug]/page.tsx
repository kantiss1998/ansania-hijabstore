import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default async function KategoriSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Secara otomatis redirect ke halaman produk dengan filter kategori
  redirect(`${ROUTES.PRODUCTS}?category=${resolvedParams.slug}`);
}
