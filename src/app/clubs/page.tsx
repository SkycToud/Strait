import Link from 'next/link';
import clubsData from '@/data/clubs.json';
import { slugify } from '@/lib/utils';
import { Users, Music, Activity, Globe, Heart, Medal, ArrowRight } from 'lucide-react';

const getCategoryIcon = (category: string) => {
  if (category.includes('Ball Sports')) return <Activity className="w-6 h-6" />;
  if (category.includes('Track & Field')) return <Medal className="w-6 h-6" />;
  if (category.includes('Music')) return <Music className="w-6 h-6" />;
  if (category.includes('Performance')) return <Users className="w-6 h-6" />;
  if (category.includes('Japanese Culture')) return <Globe className="w-6 h-6" />;
  return <Heart className="w-6 h-6" />;
};

export default function ClubsPage() {
  const categories = Array.from(new Set(clubsData.map(c => c.category)));

  return (
    <div className="space-y-8">
      <header className="animate-fade-in text-center p-2 mb-4">
        <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white mb-3">サークル情報</h1>
        <p className="text-slate-600 dark:text-slate-400">見たいカテゴリを選んでください。</p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {categories.map((category, index) => {
          const count = clubsData.filter(c => c.category === category).length;
          return (
            <Link 
              key={category} 
              href={`/clubs/${slugify(category)}`}
              className="glass-card p-5 group animate-slide-up transition-all hover:border-accent hover:shadow-accent/20 flex flex-col justify-between"
              style={{ animationDelay: `${index * 50}ms`, animationFillMode: 'both' }}
            >
              <div className="flex items-center gap-4">
                <div className="p-3 bg-accent/10 text-accent rounded-xl group-hover:bg-accent group-hover:text-white transition-colors duration-300">
                  {getCategoryIcon(category)}
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 group-hover:text-accent transition-colors">{category}</h2>
                  <p className="text-sm text-slate-500 mt-1">{count} 団体</p>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-300 opacity-0 group-hover:opacity-100 group-hover:text-accent transform -translate-x-2 group-hover:translate-x-0 transition-all duration-300" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
