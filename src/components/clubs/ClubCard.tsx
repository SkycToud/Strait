import { useMemo } from 'react';
import Link from 'next/link';
import { ClubDetail } from '@/types/club';
import ClubImage from './ClubImage';
import { slugify } from '@/lib/utils';

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
    
    // Format grades (e.g., ["1年生", "2年生", "3年生"] -> "1~3年生")
    const nums = grades
      .map(g => parseInt(g.replace(/[^0-9]/g, '')))
      .filter(n => !isNaN(n))
      .sort((a, b) => a - b);
      
    if (nums.length === 0) return grades.join(', ');
    
    // Check if it's a continuous range
    const isContinuous = nums.length > 1 && nums.every((n, i) => i === 0 || n === nums[i-1] + 1);
    
    if (isContinuous) {
      return `${nums[0]}~${nums[nums.length - 1]}年生`;
    }
    
    return nums.join(', ') + "年生";
  }, [club.recruitment?.targetGrades]);
  
  const actualCategorySlug = categorySlug || slugify(club.categories[0] || 'others');

  return (
    <Link 
      href={`/clubs/${actualCategorySlug}/${club.id}`} 
      className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col h-full"
    >
      <div className="relative h-56 overflow-hidden bg-surface-variant">
        <ClubImage 
          src={club.thumbnail} 
          alt={club.nameJa} 
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        
        {club.isSample && (
          <div className="absolute top-4 left-4 bg-amber-500 px-2.5 py-1 rounded-full text-[10px] font-bold text-white shadow-sm flex items-center gap-1">
            <span className="material-symbols-outlined text-xs">science</span>
            サンプル
          </div>
        )}
      </div>
      
      <div className="p-6 flex-grow flex flex-col">
        <div className="flex justify-between items-start mb-4">
          <div className="flex-grow pr-2">
            <h3 className="text-xl font-bold text-on-surface leading-tight mb-1">{club.nameJa}</h3>
            <p className="text-sm text-on-surface-variant line-clamp-2 mb-4">
              {club.description || "Traditional club focused on learning and teamwork."}
            </p>
          </div>
        </div>
        
        <div className="flex flex-wrap items-center gap-2 mt-auto w-full">
          <span className="flex items-center gap-1.5 px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-[10px] font-bold">
            <span className="material-symbols-outlined text-sm leading-none">{isIntra ? "school" : "public"}</span>
            {isIntra ? "外大生のみ" : "インカレ"}
          </span>
          <span className="text-xs text-on-surface-variant font-medium">{targetYears}</span>
          <span className="ml-auto text-[10px] text-outline-variant">
            {club.lastUpdated ? `Last updated: ${club.lastUpdated}` : 'Recently updated'}
          </span>
        </div>
      </div>
    </Link>
  );
}
