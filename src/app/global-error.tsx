'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

/**
 * global-error.tsx — Last resort error boundary that catches
 * root layout errors. Must include its own <html> and <body>.
 */
export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="id">
      <body style={{ margin: 0, fontFamily: "'Space Grotesk', 'Inter', system-ui, sans-serif" }}>
        <div
          style={{
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'linear-gradient(135deg, #fafafa 0%, #fff 50%, #fef2f2 100%)',
            padding: '1rem',
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '420px' }}>
            {/* Simple icon using inline styles (no CSS classes available) */}
            <div
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '20px',
                background: 'linear-gradient(135deg, #fef2f2, #ffe4e6)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 24px',
                boxShadow: '0 10px 25px rgba(239, 68, 68, 0.15)',
              }}
            >
              <AlertTriangle size={40} color="#ef4444" strokeWidth={1.5} />
            </div>

            <h1
              style={{
                fontSize: '24px',
                fontWeight: 900,
                color: '#111',
                marginBottom: '8px',
              }}
            >
              Terjadi Kesalahan Sistem
            </h1>
            <p
              style={{
                color: '#6b7280',
                fontSize: '15px',
                lineHeight: 1.6,
                marginBottom: '24px',
              }}
            >
              Maaf, terjadi kesalahan fatal pada aplikasi. Silakan coba muat ulang halaman.
            </p>

            {error.digest && (
              <p
                style={{
                  color: '#9ca3af',
                  fontSize: '12px',
                  fontFamily: 'monospace',
                  marginBottom: '16px',
                }}
              >
                Error ID: {error.digest}
              </p>
            )}

            <button
              onClick={reset}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '8px',
                padding: '12px 28px',
                background: '#111',
                color: '#fff',
                border: 'none',
                borderRadius: '9999px',
                fontSize: '14px',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'background 0.2s',
              }}
              onMouseOver={(e) => (e.currentTarget.style.background = '#333')}
              onMouseOut={(e) => (e.currentTarget.style.background = '#111')}
            >
              <RotateCcw size={16} />
              Muat Ulang
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
