import { useState, useMemo } from 'react';
import { ClubDetail } from '@/types/club';

export type ClubTypeFilter = 'all' | 'intra' | 'inter';
export type ClubGradeFilter = 'all' | '1年生' | '2年生' | '3年生' | '4年生' | '院生';

interface UseClubFilterProps {
  initialClubs: ClubDetail[];
}

export function useClubFilter({ initialClubs }: UseClubFilterProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<ClubTypeFilter>('all');
  const [gradeFilter, setGradeFilter] = useState<ClubGradeFilter>('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const activeFilterCount = useMemo(() => {
    let count = 0;
    if (typeFilter !== 'all') count++;
    if (gradeFilter !== 'all') count++;
    return count;
  }, [typeFilter, gradeFilter]);

  const filteredClubs = useMemo(() => {
    return initialClubs.filter(club => {
      // Search matching
      const matchesSearch = 
        club.nameJa?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.nameEn?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        club.description?.toLowerCase().includes(searchQuery.toLowerCase());

      if (!matchesSearch) return false;

      // Type matching
      if (typeFilter === 'intra' && club.membership?.isIntraUniversity !== true) return false;
      if (typeFilter === 'inter' && club.membership?.isIntraUniversity !== false) return false;

      // Grade matching
      if (gradeFilter !== 'all') {
        const grades = club.recruitment?.targetGrades || [];
        if (!grades.includes(gradeFilter)) return false;
      }

      return true;
    });
  }, [initialClubs, searchQuery, typeFilter, gradeFilter]);

  const handleClearFilters = () => {
    setSearchQuery('');
    setTypeFilter('all');
    setGradeFilter('all');
  };

  return {
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
  };
}
