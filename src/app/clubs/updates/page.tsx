import Link from 'next/link';
import { getRecentlyUpdatedClubs } from '@/lib/clubs';
import { toCategoryLabelJa, toCategorySlug } from '@/lib/club-categories';
import PageHeader from '@/components/layout/PageHeader';

export default async function ClubUpdatesPage() {
  const recentClubs = await getRecentlyUpdatedClubs(30);

  return (
    <div className="max-w-7xl mx-auto w-full pb-16 px-4 sm:px-6">
      <PageHeader
        title="新着サークル情報"
        subtitle="Recently Updated Clubs"
        description="過去30日以内に更新されたサークル情報の一覧です。"
      />

      <div className="mt-8">
        {recentClubs.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {recentClubs.map((club) => (
              <Link
                key={club.id}
                href={`/clubs/${toCategorySlug(club.categories[0] || 'others')}/${club.id}`}
                className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-colors"
              >
                <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {club.thumbnail ? (
                    <img src={club.thumbnail} alt={club.nameJa} className="w-full h-full object-cover" />
                  ) : (
                    <span className="material-symbols-outlined text-primary text-2xl" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>groups</span>
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <span className="inline-flex max-w-full items-center gap-1.5 rounded-full bg-primary/12 px-2.5 py-1 text-[10px] md:text-xs font-bold text-primary leading-none tracking-normal">
                    {club.categories.map(toCategoryLabelJa).join(' ・ ')}
                  </span>
                  <h4 className="font-bold text-base text-on-surface truncate">{club.nameJa}</h4>
                  <p className="text-xs text-on-surface-variant">更新日: {club.lastUpdated}</p>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="p-8 bg-surface-container-low rounded-xl text-center">
            <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-4" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>update</span>
            <p className="text-on-surface-variant">過去30日以内に更新されたサークルはありません</p>
          </div>
        )}
      </div>

      <div className="mt-12 pt-8 border-t border-outline-variant/10">
        <Link 
          href="/clubs"
          className="inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline"
        >
          <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_back</span>
          サークル情報トップへ戻る
        </Link>
      </div>
    </div>
  );
}
