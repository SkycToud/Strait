import Link from 'next/link';
import { slugify } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';

const categories = [
  {
    id: "Ball Sports",
    ja: "球技",
    en: "Ball Sports",
    count: 24,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fball-sports.jpg?alt=media&token=f894549f-ebb9-4bb1-9d85-7f737a10e041",
  },
  {
    id: "Track & Field / Martial Arts",
    ja: "陸上・滑走競技",
    en: "Track & Field / Skating",
    count: 12,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Ftrack-field-martial-arts.jpg?alt=media&token=6c9d1586-3f11-4bcc-a752-fd712313824e",
  },
  {
    id: "Martial Arts",
    ja: "武道・武術",
    en: "Martial Arts",
    count: 15,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fmartial-arts.jpg?alt=media&token=fa0fd7bf-ad83-4aee-b653-9125f0c7bb98",
  },
  {
    id: "Dance & Performance",
    ja: "舞踊・ダンス",
    en: "Dance & Performance",
    count: 18,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fdance-performance.jpg?alt=media&token=9a0e5ee1-e0d9-45fd-a827-3d0af8339eea",
  },
  {
    id: "Music & Arts",
    ja: "音楽・芸術",
    en: "Music & Arts",
    count: 38,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fmusic-arts.jpg?alt=media&token=a9509e0f-7737-4026-81e3-cd4b87c14720",
  },
  {
    id: "Japanese Culture",
    ja: "伝統文化",
    en: "Japanese Culture",
    count: 10,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fjapanese-culture.jpg?alt=media&token=a120af12-9fa1-4698-8ade-4a703ac72112",
  },
  {
    id: "Language & Social",
    ja: "語学・社会",
    en: "Language & Social",
    count: 31,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Flanguage-social.jpg?alt=media&token=e59b78b8-566a-4e2c-bdce-b1d2f8736d51",
  },
  {
    id: "Volunteer",
    ja: "ボランティア",
    en: "Volunteer",
    count: 8,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fvolunteer.jpg?alt=media&token=44b1c98b-9645-4361-a824-7890bf8c0a07",
  },
  {
    id: "Hobbies",
    ja: "その他",
    en: "Hobbies & Others",
    count: 20,
    img: "https://firebasestorage.googleapis.com/v0/b/strait-infomation.firebasestorage.app/o/images%2Fcategories%2Fhobbies.jpg?alt=media&token=f7a1624b-0c40-41b7-ad1d-eba81304478c",
  }
];

export default function ClubsPage() {
  return (
    <div className="max-w-[1200px] mx-auto w-full">
      <div className="flex flex-col gap-12">
      <section className="flex-1">
        {/* Hero Header */}
        <PageHeader
          title="サークル情報"
          subtitle="Club Information"
          description="カテゴリ別にサークルを探してみよう。"
        />

        {/* Category Section */}
        <div className="mb-8 mt-12">
          <h2 className="text-2xl font-bold text-on-surface tracking-tight">カテゴリ</h2>
          <p className="text-sm text-on-surface-variant">Explore organizations by their activity type</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((category) => (
            <Link 
              href={`/clubs/${slugify(category.id)}`} 
              key={category.id}
              className="group bg-surface-container-lowest rounded-xl overflow-hidden shadow-[0_4px_12px_-2px_rgba(46,51,58,0.08)] transition-all duration-300 hover:-translate-y-1 block"
            >
              <div className="aspect-video w-full overflow-hidden">
                <img 
                  alt={category.en} 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                  src={category.img}
                />
              </div>
              <div className="p-5">
                <h3 className="text-xl font-bold text-on-surface mb-1">{category.ja}</h3>
                <p className="text-xs text-on-surface-variant mb-4 uppercase tracking-wider font-medium">{category.en}</p>
                
                <div className="flex items-center gap-2 px-3 py-1 bg-secondary-container/50 w-fit rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-primary"></span>
                  <span className="text-[10px] font-bold text-on-secondary-container uppercase">{category.count} Organizations</span>
                </div>
              </div>
            </Link>
          ))}
        </div>

        {/* Latest Activity Section */}
        <div className="mt-20">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-bold text-on-surface tracking-tight">新着</h2>
              <p className="text-sm text-on-surface-variant">Check out what's happening around campus circles</p>
            </div>
            <button className="text-sm font-bold text-primary flex items-center gap-1 hover:underline">
              View All <span className="material-symbols-outlined text-sm" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>arrow_forward</span>
            </button>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-colors">
              <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>theater_comedy</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary-dim uppercase tracking-widest">Performance</span>
                <h4 className="font-bold text-on-surface">劇団「外大座」新歓公演決定</h4>
                <p className="text-xs text-on-surface-variant line-clamp-1">Coming up on April 15th at the Arena...</p>
              </div>
            </div>
            
            <div className="flex items-center gap-4 p-4 bg-surface-container-low rounded-xl group cursor-pointer hover:bg-surface-container-high transition-colors">
              <div className="w-16 h-16 rounded-lg bg-white shadow-sm flex-shrink-0 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary" style={{ fontVariationSettings: "'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24" }}>menu_book</span>
              </div>
              <div>
                <span className="text-[10px] font-bold text-primary-dim uppercase tracking-widest">Language</span>
                <h4 className="font-bold text-on-surface">Arabic Cafe: Weekly Meeting</h4>
                <p className="text-xs text-on-surface-variant line-clamp-1">Join us for cultural exchange every Friday...</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
    </div>
  );
}
