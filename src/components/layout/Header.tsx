import Link from 'next/link';
import { Waves } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 h-16 glass z-50 flex items-center px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto w-full flex items-center">
        <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-105 group">
          <div className="bg-accent text-white p-1.5 rounded-lg shadow-md group-hover:shadow-lg transition-all">
            <Waves className="w-5 h-5" />
          </div>
          <span className="text-xl font-bold tracking-tight text-gradient">Strait</span>
        </Link>
      </div>
    </header>
  );
}
