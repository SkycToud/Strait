'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Calendar, Building2, Users, Link2 } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
  { name: 'Facilities', href: '/facilities', icon: Building2 },
  { name: 'Clubs', href: '/clubs', icon: Users },
  { name: 'Links', href: '/links', icon: Link2 },
];

export default function Header() {
  const pathname = usePathname();

  // Highlight matches even for subpaths e.g /calendar/detailed
  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed top-0 w-full z-50 glass-nav shadow-sm shadow-slate-200/50">
      <div className="flex justify-between items-center h-16 px-6 md:px-12 max-w-[1440px] mx-auto">
        <div className="text-2xl font-bold tracking-tighter text-primary">Strait</div>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {navItems.map((item) => {
            const isActive = isActivePath(item.href);
            const Icon = item.icon;
            
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  isActive 
                    ? "text-primary font-semibold border-b-2 border-primary pb-1" 
                    : "text-slate-600 font-medium hover:text-primary transition-colors"
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
