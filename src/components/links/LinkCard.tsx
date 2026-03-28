"use client";

import { cn } from '@/lib/utils';
import { logUserBehavior } from '@/lib/firebaseClient';

type LinkItem = {
  id: string;
  title: string;
  description: string;
  url: string;
  category: string;
  icon: string;
};

const cardStyles = [
  { bg: 'bg-secondary-container', text: 'text-primary' },
  { bg: 'bg-tertiary-container', text: 'text-tertiary' },
  { bg: 'bg-primary-container', text: 'text-on-primary-container' },
  { bg: 'bg-surface-container-high', text: 'text-on-surface' },
  { bg: 'bg-secondary-container/50', text: 'text-primary' },
  { bg: 'bg-tertiary-container/30', text: 'text-tertiary' },
  { bg: 'bg-primary-container/20', text: 'text-primary' },
  { bg: 'bg-secondary-container/80', text: 'text-primary-dim' },
];

export default function LinkCard({ item, index }: { item: LinkItem; index: number }) {
  const style = cardStyles[index % cardStyles.length];
  
  // Format id to make a English label
  const englishLabel = item.id.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase());

  const handleClick = () => {
    logUserBehavior("select_content", {
      content_type: "link",
      item_id: item.id,
      item_url: item.url,
      item_title: item.title,
      item_category: item.category,
    });
  };

  return (
    <a 
      href={item.url}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="group relative flex flex-col p-8 bg-surface-container-lowest rounded-3xl transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl hover:shadow-[#0e61a51a] animate-fade-in"
      style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
    >
      <div className="mb-6 flex items-center justify-between">
        <div className={`w-14 h-14 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 ${style.bg} ${style.text}`}>
          <span className="material-symbols-outlined text-3xl select-none">{item.icon}</span>
        </div>
        <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors select-none">north_east</span>
      </div>
      <h3 className="text-lg font-bold text-on-surface mb-2">{item.title}</h3>
      <p className="text-sm text-on-surface-variant leading-relaxed mb-4">{item.description}</p>
      
      <div className="mt-auto pt-4 border-t border-surface-container-high flex items-center gap-2">
        <span className="text-[10px] font-bold text-primary tracking-widest uppercase">{englishLabel}</span>
      </div>
    </a>
  );
}
