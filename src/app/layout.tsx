import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import Providers from './providers';

export const metadata: Metadata = {
  title: {
    template: '%s | ansania',
    default: 'ansania — Fashion Muslim Premium Indonesia',
  },
  description:
    'Temukan koleksi hijab, gamis, mukena, dan fashion muslim premium terbaik di ansania. Kualitas terjamin, pengiriman cepat ke seluruh Indonesia.',
  keywords: ['hijab', 'gamis', 'mukena', 'fashion muslim', 'kerudung', 'jilbab', 'baju muslim'],
  authors: [{ name: 'ansania' }],
  creator: 'ansania',
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://ansania.com',
    siteName: 'ansania',
    title: 'ansania — Fashion Muslim Premium Indonesia',
    description: 'Temukan koleksi fashion muslim premium terbaik di ansania.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'ansania — Fashion Muslim Premium Indonesia',
    description: 'Temukan koleksi fashion muslim premium terbaik di ansania.',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>
          {children}
        </Providers>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#0A0A0A',
              color: '#fff',
              borderRadius: '9999px',
              fontSize: '13px',
              fontFamily: "'Space Grotesk', sans-serif",
              fontWeight: '500',
              padding: '12px 20px',
            },
            success: {
              iconTheme: { primary: '#F52D6E', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
