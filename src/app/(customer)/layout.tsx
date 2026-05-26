import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/layout/CartDrawer';
import { SearchOverlay } from '@/components/layout/SearchOverlay';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <div className="flex min-h-screen flex-col bg-mesh-blush">
        <Navbar />
        <main className="flex-1 pb-mobile-nav">{children}</main>
        <Footer />
        <MobileBottomNav />
      </div>
      <CartDrawer />
      <SearchOverlay />
    </>
  );
}
