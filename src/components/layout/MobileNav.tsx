'use client';
import { Home as HomeIcon, Calendar, Building2, Users, Link2, Bell } from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { name: 'ホーム', href: '/', icon: HomeIcon },
    { name: '予定表', href: '/calendar', icon: Calendar },
    { name: '施設情報', href: '/facilities', icon: Building2 },
    { name: 'サークル情報', href: '/clubs', icon: Users },
    { name: '関連リンク', href: '/links', icon: Link2 },
  ];

  return (
    <div className="md:hidden fixed bottom-1 left-0 w-full px-4 py-2 z-50">
      <div className="glass-nav px-2 py-3 flex justify-around items-center border border-outline-variant/10 shadow-lg rounded-2xl">
        {navItems.map((item) => {
          const isActive = item.href === '/' ? pathname === '/' : pathname?.startsWith(item.href);
          const Icon = item.icon;
          
          return (
            <Link 
              key={item.name}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 transition-colors",
                isActive ? "text-primary" : "text-on-surface-variant"
              )}
            >
              <Icon className={cn("w-6 h-6", isActive && "fill-current")} />
              <span className={cn("text-[10px]", isActive ? "font-bold" : "font-medium")}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
