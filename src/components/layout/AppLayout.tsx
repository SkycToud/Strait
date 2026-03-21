import Header from './Header';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 pt-24 pb-20 px-6 md:px-12 max-w-[1440px] mx-auto min-h-screen w-full">
        {children}
      </main>
    </div>
  );
}
