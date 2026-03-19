import { Link as LinkIcon, School, Laptop, Mail, PlaneTakeoff, BookOpen, Briefcase, ArrowUpRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export type LinkItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
};

const iconMap: Record<string, React.ReactNode> = {
  school: <School className="w-6 h-6" />,
  laptop: <Laptop className="w-6 h-6" />,
  mail: <Mail className="w-6 h-6" />,
  flight_takeoff: <PlaneTakeoff className="w-6 h-6" />,
  menu_book: <BookOpen className="w-6 h-6" />,
  work: <Briefcase className="w-6 h-6" />
};

export default function LinkCard({ item, index }: { item: LinkItem; index: number }) {
  const IconComponent = iconMap[item.icon] || <LinkIcon className="w-6 h-6" />;

  return (
    <a 
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      className="glass-card p-4 flex items-center gap-4 group hover:-translate-y-1 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center text-accent group-hover:bg-accent group-hover:text-white transition-all duration-300 shadow-inner">
        {IconComponent}
      </div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{item.title}</h3>
          <ArrowUpRight className="w-4 h-4 text-slate-400 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{item.description}</p>
      </div>
    </a>
  );
}
