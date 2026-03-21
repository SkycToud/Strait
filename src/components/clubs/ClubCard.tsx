import { Search, ExternalLink, Instagram } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { slugify } from '@/lib/utils';
import { Club } from '@/types/club';

export default function ClubCard({ club, index }: { club: Club; index: number }) {
  return (
    <Link 
      href={`/clubs/${slugify(club.category)}/${club.id}`}
      className="block group"
    >
      <div 
        className="glass-card p-5 group animate-slide-up flex flex-col h-full cursor-pointer hover:border-accent hover:shadow-accent/20 transition-all"
        style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
      >
        {club.thumbnail && (
          <div className="mb-4 -mx-5 -mt-5 h-32 overflow-hidden rounded-t-2xl">
            <img 
              src={club.thumbnail} 
              alt={`${club.nameJa} thumbnail`}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              onError={(e) => {
                // Fallback to hide image if it fails to load
                e.currentTarget.style.display = 'none';
              }}
            />
          </div>
        )}
        
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold text-lg text-foreground group-hover:text-accent transition-colors">{club.nameJa}</h3>
            <p className="text-xs text-foreground/60 font-medium">{club.nameEn}</p>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-foreground/70 px-2 py-1 rounded-full">
            {club.category.replace('_', ' ')}
          </span>
        </div>
        
        <p className="text-sm text-foreground/80 mb-6 flex-1 line-clamp-3 font-medium">
          {club.description}
        </p>

        <div className="flex items-center mt-auto pt-4 border-t border-slate-100 dark:border-slate-800">
          {club.instagram && (
            <a 
              href={club.instagram} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 text-sm font-bold text-[#E1306C] hover:opacity-80 transition-opacity mr-4"
              onClick={(e) => e.stopPropagation()}
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
              className="flex items-center gap-1.5 text-sm font-bold text-foreground hover:opacity-80 transition-opacity mr-4"
              onClick={(e) => e.stopPropagation()}
            >
              <span className="font-extrabold text-lg leading-none">𝕏</span>
              <span>X (Twitter)</span>
            </a>
          )}
          {!club.instagram && !club.xUrl && (
            <span className="text-sm text-foreground/60 italic font-medium">連絡先不明</span>
          )}
        </div>
      </div>
    </Link>
  );
}
