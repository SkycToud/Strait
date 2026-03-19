'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, CalendarDays, Building2, Users, Link as LinkIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Calendar', href: '/calendar', icon: CalendarDays },
  { name: 'Facilities', href: '/facilities', icon: Building2 },
  { name: 'Clubs', href: '/clubs', icon: Users },
  { name: 'Links', href: '/links', icon: LinkIcon },
];

export default function BottomNav() {
  const pathname = usePathname();

  // Highlight matches even for subpaths e.g /calendar/detailed
  const isActivePath = (path: string) => {
    if (path === '/') return pathname === '/';
    return pathname?.startsWith(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 p-4 pointer-events-none flex justify-center pb-6 sm:pb-8">
      <div className="glass pointer-events-auto flex items-center justify-around h-16 rounded-2xl px-2 sm:px-6 sm:gap-8 w-full max-w-md shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-white/20 dark:border-slate-700/50">
        {navItems.map((item) => {
          const isActive = isActivePath(item.href);
          const Icon = item.icon;
          
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "relative flex flex-col items-center justify-center w-14 h-14 rounded-xl transition-all duration-300",
                isActive ? "text-accent" : "text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200"
              )}
            >
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-accent/10 dark:bg-accent/20 rounded-xl"
                  initial={false}
                  transition={{ type: "spring", stiffness: 500, damping: 30 }}
                />
              )}
              <Icon className={cn("w-6 h-6 z-10", isActive && "animate-pulse-slow")} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium mt-1 z-10">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
