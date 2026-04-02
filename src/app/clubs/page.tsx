import Link from 'next/link';
import { slugify } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';
import { getRecentlyUpdatedClubs } from '@/lib/clubs';

const categories = [
  {
    id: "Ball Sports",
    ja: "球技",
    en: "Ball Sports",
    img: "",
  },
  {
    id: "Martial Arts",
    ja: "武道・武術",
    en: "Martial Arts",
    img: "",
  },
  {
    id: "Arts & Music",
    ja: "芸術・音楽",
    en: "Arts & Music",
    img: "",
  },
  {
    id: "Dance & Performance",
    ja: "舞踊・ダンス",
    en: "Dance & Performance",
    img: "",
  },
  {
    id: "Other Sports",
    ja: "その他スポーツ",
    en: "Other Sports",
    img: "",
  },
  {
    id: "Volunteer",
    ja: "ボランティア",
    en: "Volunteer",
    img: "",
  },
  {
    id: "Language & International",
    ja: "語学・国際交流",
    en: "Language & International Exchange",
    img: "",
  },
  {
    id: "Social Issues",
    ja: "社会課題",
    en: "Social Issues",
    img: "",
  },
  {
    id: "Planning",
    ja: "企画",
    en: "Planning & Events",
    img: "",
  },
  {
    id: "Others",
    ja: "その他",
    en: "Others",
    img: "",
  }
];

export default async function ClubsPage() {
  const recentClubs = getRecentlyUpdatedClubs(30, 4);
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col gap-12">
        <section className="flex-1">
          {/* Hero Header */}
          <PageHeader
            title="サークル情報"
            subtitle="Club Information"
            description="サークル情報を確認することができます。"
          />

          {/* Category Section */}
          <div className="mb-4 md:mb-8 mt-6 md:mt-12 flex items-end justify-between">
            <div>
              <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">カテゴリ</h2>
            </div>
            <Link
              href="/clubs/all"
              className="text-xs md:text-sm font-bold text-primary flex items-center gap-1 hover:underline px-3 md:px-4 py-1.5 md:py-2 bg-primary/5 rounded-full transition-colors"
            >
              <span className="hidden md:inline">サークル一覧</span>
              <span className="md:hidden">一覧へ</span>
              <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6">
            {categories.map((category) => (
              <Link
                href={`/clubs/${slugify(category.id)}`}
                key={category.id}
                className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_12px_-2px_rgba(46,51,58,0.08)] transition-all duration-300 hover:-translate-y-1 block"
              >
                <div className="aspect-video w-full overflow-hidden bg-surface-container flex items-center justify-center">
                  {category.img ? (
                    <img
                      alt={category.en}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      src={category.img}
                    />
                  ) : (
                    <span className="material-symbols-outlined text-4xl text-on-surface-variant">category</span>
                  )}
                </div>
                <div className="p-3 md:p-5">
                  <h3 className="text-sm md:text-xl font-bold text-on-surface mb-0.5 md:mb-1">{category.ja}</h3>
                  <p className="text-[9px] md:text-xs text-on-surface-variant mb-1 md:mb-4 uppercase tracking-wider font-medium line-clamp-1">{category.en}</p>

                </div>
              </Link>
            ))}
          </div>

          {/* Latest Activity Section */}
          <div className="mt-12 md:mt-20">
            <div className="flex items-end justify-between mb-4 md:mb-8">
              <div>
                <h2 className="text-xl md:text-2xl font-bold text-on-surface tracking-tight">新着</h2>
              </div>
              <Link 
                href="/clubs/updates"
                className="text-xs md:text-sm font-bold text-primary flex items-center gap-1 hover:underline"
              >
                View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
              </Link>
            </div>

            {recentClubs.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
                {recentClubs.map((club) => (
                  <Link
                    key={club.id}
                    href={`/clubs/${slugify(club.category)}/${club.id}`}
                    className="flex items-center gap-3 md:gap-4 p-3 md:p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-colors"
                  >
                    <div className="w-12 h-12 md:w-16 md:h-16 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                      {club.thumbnail ? (
                        <img src={club.thumbnail} alt={club.nameJa} className="w-full h-full object-cover" />
                      ) : (
                        <span className="material-symbols-outlined text-primary text-xl md:text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>groups</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] md:text-[10px] font-bold text-primary-dim uppercase tracking-widest">{club.category}</span>
                      <h4 className="font-bold text-sm md:text-base text-on-surface truncate">{club.nameJa}</h4>
                      <p className="text-[10px] md:text-xs text-on-surface-variant">更新日: {club.lastUpdated}</p>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="p-6 bg-surface-container-low rounded-xl text-center">
                <p className="text-on-surface-variant">最近の更新はありません</p>
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
