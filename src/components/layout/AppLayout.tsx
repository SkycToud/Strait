import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-24 px-6 md:px-12 lg:px-24 2xl:px-40 w-full">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
