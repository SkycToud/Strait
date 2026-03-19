import { Search, ExternalLink, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';

export type Club = {
  id: string;
  nameJa: string;
  nameEn: string;
  category: string;
  description: string;
  instagram?: string;
  xUrl?: string;
  metadata?: string;
};

export default function ClubCard({ club, index }: { club: Club; index: number }) {
  return (
    <div 
      className="glass-card p-5 group animate-slide-up flex flex-col h-full"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg group-hover:text-accent transition-colors">{club.nameJa}</h3>
          <p className="text-xs text-slate-400">{club.nameEn}</p>
        </div>
        <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-2 py-1 rounded-full">
          {club.category.replace('_', ' ')}
        </span>
      </div>
      
      <p className="text-sm text-slate-600 dark:text-slate-300 mb-6 flex-1 line-clamp-3">
        {club.description}
      </p>

      <div className="flex items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
        {club.instagram && (
          <a 
            href={club.instagram} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-bold text-[#E1306C] hover:opacity-80 transition-opacity mr-4"
          >
            <Instagram className="w-4 h-4" />
            <span>Instagram</span>
          </a>
        )}
        {club.xUrl && (
          <a 
            href={club.xUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-1.5 text-sm font-bold text-slate-800 dark:text-slate-200 hover:opacity-80 transition-opacity mr-4"
          >
            <span className="font-extrabold text-lg leading-none">𝕏</span>
            <span>X (Twitter)</span>
          </a>
        )}
        {!club.instagram && !club.xUrl && (
          <span className="text-sm text-slate-400 italic">連絡先不明</span>
        )}
      </div>
    </div>
  );
}
