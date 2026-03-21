import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllClubs } from '@/lib/clubs';
import { slugify } from '@/lib/utils';
import { ClubDetail } from '@/types/club';
import ClubImage from '@/components/clubs/ClubImage';

export function generateStaticParams() {
  const clubsData = getAllClubs();
  const categories = Array.from(new Set(clubsData.map((club) => club.category)));
  return categories.map((category) => ({
    category: slugify(category),
  }));
}

const categoryInfo: Record<string, { title: string, subtitle: string }> = {
  "ball-sports": { title: "球技サークル一覧", subtitle: "Ball Sports Club List — Explore your passion on the court and field." },
  "track-field-martial-arts": { title: "陸上・武道サークル一覧", subtitle: "Track & Field / Martial Arts — Push your limits." },
  "music-arts": { title: "音楽・芸術サークル一覧", subtitle: "Music & Arts — Express yourself through creativity." },
  "language-social": { title: "語学・社会サークル一覧", subtitle: "Language & Social — Connect with the world." },
  "dance-performance": { title: "舞踊・ダンスサークル一覧", subtitle: "Dance & Performance — Move to the rhythm." },
  "japanese-culture": { title: "伝統文化サークル一覧", subtitle: "Japanese Culture — Experience traditional arts." },
  "volunteer": { title: "ボランティアサークル一覧", subtitle: "Volunteer — Make a difference in the community." },
  "hobbies": { title: "その他サークル一覧", subtitle: "Hobbies & Others — Discover new interests." },
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  
  const clubsData = getAllClubs();
  const activeCategory = clubsData.find((club) => slugify(club.category) === slug)?.category;
  
  if (!activeCategory) {
    notFound();
  }

  const typedClubsData = clubsData as ClubDetail[];
  const categoryClubs = typedClubsData.filter((club) => club.category === activeCategory);
  
  const info = categoryInfo[slug] || { title: `${activeCategory}一覧`, subtitle: `Explore clubs in ${activeCategory}` };

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      {/* Breadcrumbs & Title */}
      <div className="mb-10">
        <nav className="flex items-center gap-2 text-sm text-on-surface-variant mb-4">
          <Link href="/" className="hover:text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>home</span>
            Home
          </Link>
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
          <Link href="/clubs" className="hover:text-primary">Categories</Link>
          <span className="material-symbols-outlined text-xs" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>chevron_right</span>
          <span className="text-on-surface font-medium">{activeCategory}</span>
        </nav>
        
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold tracking-tight text-on-surface font-headline mb-2">{info.title}</h1>
            <p className="text-on-surface-variant text-lg">{info.subtitle}</p>
          </div>
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-full text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>filter_list</span>
              Filter
            </button>
            <button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-full text-sm font-medium flex items-center gap-2 hover:bg-surface-variant transition-colors">
              <span className="material-symbols-outlined text-lg" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sort</span>
              Sort
            </button>
          </div>
        </div>
      </div>

      {/* Clubs Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryClubs.map((club) => {
          const isIntra = club.membership?.isIntraUniversity !== false; 
          const targetYears = club.membership?.yearDistribution && club.membership.yearDistribution.length > 0 
            ? "1~4年生" 
            : "全学年";

          return (
            <Link 
              href={`/clubs/${slug}/${club.id}`} 
              key={club.id} 
              className="group bg-surface-container-lowest rounded-3xl overflow-hidden shadow-[0_4px_24px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_32px_rgba(0,0,0,0.08)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-56 overflow-hidden bg-surface-variant">
                <ClubImage 
                  src={club.thumbnail} 
                  alt={club.nameJa} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                
                {club.recruitment && (
                  <div className="absolute top-4 right-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold text-white shadow-sm">
                    Currently Recruiting
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
                  <div className="p-2 text-on-surface-variant group-hover:bg-surface-container-low rounded-full transition-colors flex-shrink-0">
                    <span className="material-symbols-outlined text-xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>link</span>
                  </div>
                </div>
                
                <div className="flex flex-wrap items-center gap-2 mt-auto w-full">
                  <span className="px-2.5 py-1 bg-surface-container-low text-on-surface-variant rounded-full text-xs font-semibold">
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
        })}

        {/* Empty State / Add Suggestion */}
        <div className="border-2 border-dashed border-outline-variant/30 rounded-3xl flex flex-col items-center justify-center p-8 text-center bg-surface-container-low/50 col-span-1 h-[420px] md:h-auto">
          <span className="material-symbols-outlined text-4xl text-outline-variant mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>sports_basketball</span>
          <h3 className="text-lg font-bold text-on-surface mb-2">Can't find your club?</h3>
          <p className="text-sm text-on-surface-variant mb-6">New clubs are added every semester. Contact the council to start your own!</p>
          <button className="text-primary font-bold text-sm hover:underline">Contact Student Council</button>
        </div>
      </div>
    </div>
  );
}
