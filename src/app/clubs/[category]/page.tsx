import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getAllClubs } from '@/lib/clubs';
import { slugify } from '@/lib/utils';
import { ClubDetail } from '@/types/club';
import ClubImage from '@/components/clubs/ClubImage';
import ClubCard from '@/components/clubs/ClubCard';

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
        </div>
      </div>

      {/* Clubs Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {categoryClubs.map((club) => (
          <ClubCard key={club.id} club={club} />
        ))}

      </div>
    </div>
  );
}
