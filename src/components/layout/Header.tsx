'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Building2, Users, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'ホーム', href: '/', icon: Home },
  { name: '予定表', href: '/calendar', icon: Calendar },
  { name: '施設情報', href: '/facilities', icon: Building2 },
  { name: 'サークル情報', href: '/clubs', icon: Users },
  { name: '関連リンク', href: '/links', icon: Link2 },
];

export default function Header() {
  const pathname = usePathname();

  // Highlight matches even for subpaths e.g /calendar/detailed
  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm shadow-outline-variant/20 border-b border-outline-variant/20">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 w-full">
        <Link href="/" className="flex items-center gap-2 text-2xl font-bold tracking-tighter text-primary hover:opacity-80 transition-opacity">
          <img src="/icon.png" alt="Strait" className="w-8 h-8" />
          Strait
        </Link>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive 
                    ? "text-primary font-semibold border-b-2 border-primary pb-1" 
                    : "text-on-surface-variant font-medium hover:text-primary transition-colors"
                )}
              >
                {item.name}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
