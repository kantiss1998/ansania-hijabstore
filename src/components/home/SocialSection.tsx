import { MessageCircle, Sparkles } from 'lucide-react';

function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
    </svg>
  );
}

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export function SocialSection() {
  return (
    <section className="py-16 sm:py-20">
      <div className="container-main">
        <div className="relative rounded-4xl overflow-hidden">
          {/* Background */}
          <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, #FFF5F7 0%, #F3E8FF 50%, #FFE4F0 100%)' }} />
          <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(186, 53, 101, 0.15)' }} />
          <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full blur-3xl" style={{ background: 'rgba(139, 92, 246, 0.15)' }} />

          <div className="relative z-10 py-16 px-6 text-center">
            {/* Label */}
            <div className="inline-flex items-center gap-2 bg-white rounded-full px-5 py-2.5 shadow-md mb-6" style={{ border: '1px solid rgba(229, 231, 235, 0.5)' }}>
              <Sparkles className="h-4 w-4 animate-pulse" style={{ color: '#BA3565' }} />
              <span className="text-sm font-bold" style={{ background: 'linear-gradient(to right, #BA3565, #7C3AED)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Terhubung dengan Kami
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold font-heading mb-3" style={{ background: 'linear-gradient(to right, #1C1917, #881649, #5B21B6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Ikuti Kami di Media Sosial
            </h2>
            <p className="text-gray-600 text-lg max-w-md mx-auto mb-10">
              Dapatkan inspirasi gaya, tips padu padan, dan update koleksi terbaru
            </p>

            {/* Social Cards */}
            <div className="flex flex-wrap gap-5 justify-center">
              {[
                {
                  icon: InstagramIcon,
                  label: 'Instagram',
                  handle: '@ansania',
                  href: '#',
                  gradient: 'linear-gradient(135deg, #ec4899, #8b5cf6)',
                  shadowColor: 'rgba(236, 72, 153, 0.2)',
                  borderHover: '#fce7f3',
                },
                {
                  icon: FacebookIcon,
                  label: 'Facebook',
                  handle: '/ansania',
                  href: '#',
                  gradient: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  shadowColor: 'rgba(59, 130, 246, 0.2)',
                  borderHover: '#dbeafe',
                },
                {
                  icon: MessageCircle,
                  label: 'WhatsApp',
                  handle: 'Chat Kami',
                  href: 'https://wa.me/6281234567890',
                  gradient: 'linear-gradient(135deg, #22c55e, #16a34a)',
                  shadowColor: 'rgba(34, 197, 94, 0.2)',
                  borderHover: '#dcfce7',
                },
              ].map(({ icon: Icon, label, handle, href, gradient }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="group flex flex-col items-center gap-4 p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:-translate-y-2 border border-gray-100 min-w-[150px]"
                >
                  <div className="relative">
                    <div
                      className="relative flex h-16 w-16 items-center justify-center rounded-full text-white shadow-xl"
                      style={{ background: gradient }}
                    >
                      <Icon className="h-8 w-8" />
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="font-bold text-gray-800 group-hover:text-primary-700 transition-colors">
                      {label}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">{handle}</p>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
