import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from 'react-hot-toast';

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
        {children}
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#1C1917',
              color: '#FAFAF9',
              borderRadius: '12px',
              fontSize: '14px',
              fontWeight: '500',
              padding: '12px 16px',
            },
            success: {
              iconTheme: { primary: '#BA3565', secondary: '#fff' },
            },
          }}
        />
      </body>
    </html>
  );
}
