'use client';

import { ClubDetail } from '@/types/club';
import ClubCard from './ClubCard';
import { useClubFilter, ClubTypeFilter, ClubGradeFilter } from '@/hooks/useClubFilter';

export const TYPE_OPTIONS: { label: string; value: ClubTypeFilter }[] = [
  { label: '全て', value: 'all' },
  { label: '外大生のみ', value: 'intra' },
  { label: 'インカレ', value: 'inter' }
];

export const GRADE_OPTIONS: { label: string; value: ClubGradeFilter }[] = [
  { label: '全て', value: 'all' },
  { label: '1年生', value: '1年生' },
  { label: '2年生', value: '2年生' },
  { label: '3年生', value: '3年生' },
  { label: '4年生', value: '4年生' },
  { label: '院生', value: '院生' }
];

interface AllClubsListProps {
  initialClubs: ClubDetail[];
}

export default function AllClubsList({ initialClubs }: AllClubsListProps) {
  const {
    searchQuery,
    setSearchQuery,
    typeFilter,
    setTypeFilter,
    gradeFilter,
    setGradeFilter,
    isExpanded,
    setIsExpanded,
    activeFilterCount,
    filteredClubs,
    handleClearFilters
  } = useClubFilter({ initialClubs });

  return (
    <div className="space-y-8">
      {/* Search and Filters Header */}
      <div className="sticky top-0 z-10 py-6 bg-surface-container-lowest/90 backdrop-blur-xl rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.06)] border border-outline-variant/30 px-8">
        <div className="flex flex-col gap-4">
          {/* Search Row */}
          <div className="relative w-full">
            <span className="absolute left-5 top-1/2 -translate-y-1/2 material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>search</span>
            <input
              type="text"
              placeholder="サークル名やキーワードを検索..."
              className="w-full pl-14 pr-6 py-5 bg-surface-container-low rounded-2xl border-2 border-transparent focus:border-primary focus:bg-white focus:shadow-[0_0_0_4px_rgba(var(--primary-rgb),0.1)] outline-none transition-all text-lg placeholder:text-on-surface-variant/50"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          {/* Accordion Toggle & Summary */}
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="flex items-center gap-2 text-sm font-bold text-on-surface-variant hover:text-primary transition-colors group"
            >
              <span className={`material-symbols-outlined text-xl transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`}>
                keyboard_arrow_down
              </span>
              <span>絞り込み条件</span>
              {!isExpanded && activeFilterCount > 0 && (
                <span className="ml-1 bg-primary/10 text-primary px-2 py-0.5 rounded-full text-[10px]">
                  {activeFilterCount}件適用中
                </span>
              )}
            </button>

            {activeFilterCount > 0 && (
              <button
                onClick={handleClearFilters}
                className="text-[11px] font-bold text-primary hover:underline flex items-center gap-1"
              >
                クリア <span className="material-symbols-outlined text-xs">close</span>
              </button>
            )}
          </div>

          {/* Collapsible Filter Section */}
          <div 
            className={`grid transition-all duration-300 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0 overflow-hidden'}`}
          >
            <div className="overflow-hidden">
              <div className="flex flex-col gap-5 pt-2 pb-4">
                {/* Type Filter */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[11px] font-bold text-on-surface-variant mr-2 opacity-70">募集状況:</span>
                  {TYPE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setTypeFilter(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${typeFilter === opt.value
                        ? 'bg-primary text-on-primary shadow-md shadow-primary/20'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>

                {/* Grade Filter */}
                <div className="flex flex-wrap gap-2 items-center">
                  <span className="text-[11px] font-bold text-on-surface-variant mr-2 opacity-70">対象学年:</span>
                  {GRADE_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => setGradeFilter(opt.value)}
                      className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${gradeFilter === opt.value
                        ? 'bg-secondary text-on-secondary shadow-md shadow-secondary/20'
                        : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container-high'
                        }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-4 flex items-center justify-between text-[11px] text-on-surface-variant font-medium pt-4 border-t border-outline-variant/10">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-sm opacity-50">list_alt</span>
            <span>{filteredClubs.length} 件のサークルが見つかりました</span>
          </div>
        </div>
      </div>

      {/* Grid */}
      {filteredClubs.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredClubs.map(club => (
            <ClubCard key={club.id} club={club} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-24 text-center bg-surface-container-low/30 rounded-3xl border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-6xl text-outline-variant mb-4">search_off</span>
          <h3 className="text-xl font-bold text-on-surface mb-2">サークルが見つかりません</h3>
          <p className="text-on-surface-variant">検索条件を変えてみてください。</p>
        </div>
      )}
    </div>
  );
}
