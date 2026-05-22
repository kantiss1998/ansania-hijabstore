import { redirect } from 'next/navigation';
import { ROUTES } from '@/constants/routes';

export default function PesananRedirectPage() {
  // Alias rute untuk memudahkan akses
  redirect(ROUTES.ACCOUNT.PROFILE.replace('/profil', '/pesanan'));
}
