import Header from './Header';
import BottomNav from './BottomNav';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1 w-full max-w-3xl mx-auto px-4 sm:px-6 pt-24 pb-32 animate-fade-in relative">
        {/* Background ambient light effects for premium feel */}
        <div className="fixed top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-accent/5 dark:bg-accent/10 blur-[100px]" />
          <div className="absolute top-[40%] right-[-10%] w-[30%] h-[30%] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-[100px]" />
        </div>
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
