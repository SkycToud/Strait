'use client';

import dynamic from 'next/dynamic';
import Header from './Header';
import Footer from './Footer';
import MobileNav from './MobileNav';

const AnalyticsTracker = dynamic(
  () => import('@/components/analytics/AnalyticsTracker'),
  { ssr: false }
);

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <AnalyticsTracker />
      <Header />
      <main className="flex-1 pt-24 pb-24 px-6 md:px-12 lg:px-24 2xl:px-40 w-full">
        {children}
      </main>
      <Footer />
      <MobileNav />
    </div>
  );
}
