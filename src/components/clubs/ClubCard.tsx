'use client';

import { useMemo } from 'react';
import Link from 'next/link';
import { ClubDetail } from '@/types/club';
import ClubImage from './ClubImage';
import { toCategorySlug } from '@/lib/club-categories';

interface ClubCardProps {
  club: ClubDetail;
  index?: number;
  categorySlug?: string;
}

export default function ClubCard({ club, categorySlug }: ClubCardProps) {
  const isIntra = club.membership?.isIntraUniversity !== false; 
  
  const targetYears = useMemo(() => {
    const grades = club.recruitment?.targetGrades;
    if (!grades || grades.length === 0) return "全学年";

    const uniqueGrades = [...new Set(grades)];
    const undergradGrades = ['1年生', '2年生', '3年生', '4年生'];
    const includesAllUndergrad = undergradGrades.every((grade) => uniqueGrades.includes(grade));

    if (includesAllUndergrad) {
      return uniqueGrades.includes('院生') ? '学部生+院生' : '学部生';
    }
    
    // Format grades (e.g., ["1年生", "2年生", "3年生"] -> "1~3年生")
    const nums = uniqueGrades
      .map(g => parseInt(g.replace(/[^0-9]/g, '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
      
    if (nums.length === 0) return uniqueGrades.join(', ');
    
    // Check if it's a continuous range
    const isContinuous = nums.length > 1 && nums.every((n, i) => i === 0 || n === nums[i-1] + 1);
    
    if (isContinuous) {
      return `${nums[0]}~${nums[nums.length - 1]}年生`;
    }
    
    return nums.join(', ') + "年生";
  }, [club.recruitment?.targetGrades]);
  
  const actualCategorySlug =
    categorySlug ||
    club.primaryCategorySlug ||
    club.categorySlugs?.[0] ||
    toCategorySlug(club.categories[0] || 'others');

  return (
    <Link 
      href={`/clubs/${actualCategorySlug}/${club.id}`} 
      data-analytics-event="select_content"
      data-analytics-param-content-type="club_card"
      data-analytics-param-item-id={club.id}
      data-analytics-param-item-title={club.nameJa}
      data-analytics-param-category-slug={actualCategorySlug}
      className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-40 md:h-56 overflow-hidden bg-surface-variant">
        <ClubImage 
          src={club.thumbnail} 
          alt={club.nameJa} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {club.isSample && (
          <div className="absolute top-3 left-3 md:top-4 md:left-4 bg-amber-500 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1 z-10">
            <span className="material-symbols-outlined text-xs">science</span>
            サンプル
          </div>
        )}

        {/* Tags moved to image overlay */}
        <div className="absolute bottom-3 left-3 right-3 flex flex-wrap items-center gap-2 z-10">
          <span className="inline-flex items-center gap-1 px-2.5 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full text-[10px] font-bold shadow-sm">
            <span className="material-symbols-outlined leading-none" style={{ fontSize: '12px', fontVariationSettings: "'opsz' 20, 'wght' 400" }}>{isIntra ? "school" : "public"}</span>
            <span className="leading-none">{isIntra ? "外大生のみ" : "インカレ"}</span>
          </span>
          <span className="inline-flex items-center px-2.5 h-6 bg-black/60 backdrop-blur-sm text-white rounded-full text-[10px] font-bold shadow-sm">
            <span className="leading-none">{targetYears}</span>
          </span>
        </div>
      </div>
      
      <div className="p-4 md:p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-3 md:mb-4">
          <div className="flex-grow pr-2">
            <h3 className="text-lg md:text-xl font-bold text-on-surface leading-tight mb-1">{club.nameJa}</h3>
            <p className="text-xs md:text-sm text-on-surface-variant line-clamp-2">
              {club.description || "Traditional club focused on learning and teamwork."}
            </p>
          </div>
        </div>
        
        <div className="flex items-center mt-auto w-full pt-2">
          <span className="ml-auto text-[10px] text-outline-variant">
            {club.lastUpdated ? `Last updated: ${club.lastUpdated}` : 'Recently updated'}
          </span>
        </div>
      </div>
    </Link>
  );
}
