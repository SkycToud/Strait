'use client';
import { useState } from 'react';
import { Search } from 'lucide-react';
import ClubCard from './ClubCard';
import { Club } from '@/types/club';

export default function ClubList({ clubs }: { clubs: Club[] }) {
  const [search, setSearch] = useState('');
  
  const filteredClubs = clubs.filter(club => 
    club.nameJa.toLowerCase().includes(search.toLowerCase()) || 
    club.nameEn.toLowerCase().includes(search.toLowerCase()) ||
    club.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative max-w-md mx-auto">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-foreground/50" />
        </div>
        <input
          type="text"
          className="w-full glass-card !rounded-2xl pl-12 pr-4 py-4 text-sm font-medium outline-none focus:ring-2 focus:ring-accent/50 transition-all placeholder:text-foreground/50"
          placeholder="サークル名、活動内容で検索..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClubs.length > 0 ? (
          filteredClubs.map((club, index) => (
            <ClubCard key={club.id} club={club} index={index} />
          ))
        ) : (
          <div className="col-span-full py-12 text-center text-foreground/70">
            見つかりませんでした。別のキーワードをお試しください。
          </div>
        )}
      </div>
    </div>
  );
}
