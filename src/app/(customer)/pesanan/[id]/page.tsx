import { redirect } from 'next/navigation';

export default async function PesananDetailRedirectPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = await params;
  // Alias rute untuk detail pesanan
  redirect(`/akun/pesanan/${resolvedParams.id}`);
}
