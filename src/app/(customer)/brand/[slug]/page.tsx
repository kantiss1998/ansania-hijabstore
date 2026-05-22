import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default async function BrandSlugPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  // Secara otomatis redirect ke halaman produk dengan filter brand
  redirect(`${ROUTES.PRODUCTS}?brand=${resolvedParams.slug}`);
}
