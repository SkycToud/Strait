import { notFound } from 'next/navigation';
import { getAllClubs } from '@/lib/clubs';
import { isKnownCategorySlug, normalizeCategorySlug, toCategorySlug } from '@/lib/club-categories';
import { ClubDetail } from '@/types/club';
import ClubCard from '@/components/clubs/ClubCard';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  const clubsData = getAllClubs();
  const categories = Array.from(new Set(clubsData.flatMap((club) => club.categories.map(toCategorySlug))));
  return categories.map((category) => ({
    category,
  }));
}

const categoryInfo: Record<string, { title: string, subtitle: string }> = {
  "ball-sports": { title: "球技サークル一覧", subtitle: "Ball Sports — Explore your passion on the court and field." },
  "martial-arts": { title: "武道・武術サークル一覧", subtitle: "Martial Arts — Master traditional combat arts." },
  "music-and-arts": { title: "芸術・音楽サークル一覧", subtitle: "Arts & Music — Express yourself through creativity." },
  "dance-and-performance": { title: "舞踊・ダンスサークル一覧", subtitle: "Dance & Performance — Move to the rhythm." },
  "other-sports": { title: "その他スポーツサークル一覧", subtitle: "Other Sports — Discover diverse athletic activities." },
  "volunteer": { title: "ボランティアサークル一覧", subtitle: "Volunteer — Make a difference in the community." },
  "language-and-international": { title: "語学・国際交流サークル一覧", subtitle: "Language & International Exchange — Connect with the world." },
  "social-issues": { title: "社会課題サークル一覧", subtitle: "Social Issues — Address challenges in society." },
  "planning": { title: "企画サークル一覧", subtitle: "Planning & Events — Create memorable experiences." },
  "others": { title: "その他サークル一覧", subtitle: "Others — Discover new interests." },
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  const normalizedSlug = normalizeCategorySlug(slug);
  
  const clubsData = getAllClubs();
  const activeCategory = clubsData
    .find((club) => (club.categorySlugs ?? []).includes(normalizedSlug) || club.categories.some((cat) => toCategorySlug(cat) === normalizedSlug))
    ?.categories?.[0];
  
  if (!activeCategory && !isKnownCategorySlug(normalizedSlug)) {
    notFound();
  }

  const typedClubsData = clubsData as ClubDetail[];
  const categoryClubs = typedClubsData.filter((club) => {
    const slugs = club.categorySlugs ?? club.categories.map((cat) => toCategorySlug(cat));
    return slugs.includes(normalizedSlug);
  });
  
  const info = categoryInfo[normalizedSlug] || { title: `${activeCategory ?? 'サークル'}一覧`, subtitle: `Explore clubs in ${activeCategory ?? 'this category'}` };

  return (
    <div className="max-w-7xl mx-auto w-full pb-16">
      {/* Title */}
      <div className="mb-10">
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
          <ClubCard key={club.id} club={club} categorySlug={normalizedSlug} />
        ))}
      </div>

      {/* Navigation - Bottom */}
      <div className="mt-16 pt-8 border-t border-outline-variant/10">
        <div className="flex flex-wrap gap-8 items-center border-l-4 border-primary pl-6 py-2">
          <Link 
            href="/clubs" 
            className="group flex items-center gap-3 text-sm font-bold text-on-surface-variant hover:text-primary transition-all"
          >
            <div className="p-2 rounded-full border border-outline-variant group-hover:bg-primary-container group-hover:border-primary transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span>サークル情報ホーム</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
