import ClubList from '@/components/clubs/ClubList';
import clubsData from '@/data/clubs.json';
import { slugify } from '@/lib/utils';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export function generateStaticParams() {
  const categories = Array.from(new Set(clubsData.map((club) => club.category)));
  return categories.map((category) => ({
    category: slugify(category),
  }));
}

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category: slug } = await params;
  
  const activeCategory = clubsData.find((club) => slugify(club.category) === slug)?.category;
  
  if (!activeCategory) {
    return <div className="p-10 text-center font-bold">Category not found</div>;
  }

  // Cast imported JSON data to the exact type
  const typedClubsData = clubsData as Array<{
    id: string;
    nameJa: string;
    nameEn: string;
    category: string;
    description: string;
    instagram?: string;
    xUrl?: string;
    metadata?: string;
  }>;

  const categoryClubs = typedClubsData.filter((club) => club.category === activeCategory);

  return (
    <div className="space-y-8 animate-fade-in relative z-10">
      <div className="p-2 mb-2">
        <Link href="/clubs" className="inline-flex items-center gap-2 text-sm font-bold text-foreground/80 hover:text-accent mb-6 transition-colors">
          <ArrowLeft className="w-4 h-4" /> カテゴリ一覧へ戻る
        </Link>
        <h1 className="text-3xl font-extrabold text-foreground flex flex-col sm:flex-row sm:items-baseline gap-2">
          {activeCategory}
          <span className="text-lg text-foreground/60 font-medium">({categoryClubs.length} 団体)</span>
        </h1>
      </div>

      <ClubList clubs={categoryClubs} />
    </div>
  );
}
