import Link from 'next/link';
import { slugify } from '@/lib/utils';
import PageHeader from '@/components/layout/PageHeader';

const categories = [
  {
    id: "Ball Sports",
    ja: "球技",
    en: "Ball Sports",
    count: 24,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuCE5MIpvovt1ayVVRQxwDOvsNItl-AaR6Ss9ahl8aIcPBICYjp2fUlQY2Wd2PVTqf_RL-FtlC5FxrFy0OdB2Ydeo9FsPrDFJgbMIC3hcYO0VJ4wNjyB0eaGtP2rAb_eGi4nfixn0sk3AU9ehKYCXKr6lDJuzDBPy9wQcu-8wwu_OarEQLqSJ-Osy9pZFFIlkUJGE2DJ9zovLzld_R44byfGOVaNxAnxqYJj0jLhfZQmYpBRq5WRsXdcLkJnYlqI-mqBY5z3c0zYNykS",
  },
  {
    id: "Track & Field / Martial Arts",
    ja: "陸上・滑走競技",
    en: "Track & Field / Skating",
    count: 12,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD8I_p9IrIT_3YKf6T0lyc0Q4uKFMkgey72TnSIl-isfsO2jgtHXIJXAvG-fUOj8H4JFApbLClLwbT6iGXAovOepAtl25M4Ri4cxOFAotSMVJIv8fHGM-eXoog3Yk0vcJsVOs-wNS4ct-HlIEpUPE31-XBo7mHj8PQEwWA6BGlZHMJO8gZW2D8tkFopJUlX2VNAV_vty3Ey_K49YE7fZRGuYh4qHExU217qCsfvOqFyPZpGGXY_fIp5PzPmW46t1RmOQEOS_sbQmjSI",
  },
  {
    id: "Martial Arts",
    ja: "武道・武術",
    en: "Martial Arts",
    count: 15,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAT3_GifpEMcgmWe-54bSMGP5Z7MAHhO6gepspL4Z40kTkizq8sop90wrdjageDevIM0J4i-xpfHvQZ8EP-Jc1GN4Lp1z4qGNoyONrI0uMsYKpB8aeCY5SIImF235rX1hNHFaW8G3axG-8_5ORhW9nGpSYhDQboXneMlxEktNawMjp8ZJ-Ev6yCM4ESDV3IsUVJvSuVX2IUfH2mLMhlLPrUg7mRjay1ETL3To9L76tD6Iiu4gVmEKjmb0smtoYdT2osZnhNj1CkUQPB",
  },
  {
    id: "Dance & Performance",
    ja: "舞踊・ダンス",
    en: "Dance & Performance",
    count: 18,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuD2SJOuppRsLXr9u3lY853NR6yHlaHHCIJr-d_8nFmfqNKKzym08ZxOORpccs27veg1Z0U8SlxasJFXCanRV7qIuFEQ-LuCsmDX5ZpDamALlMORvop8MpGUPtlbPX6Z6VSmA04VCzWvZrQYk-z43WF6CRZbQVJVAd-OiJFugG5XJR5n7ROQ1uZpvJBxDpLyIiDxY2J8CdFdS8bbkjiqg9sd5ARU1_Krzhk3qxNydNMAbep5M0m-9zccveiUlGN_EiPfKcyDj9Ohv0vB",
  },
  {
    id: "Music & Arts",
    ja: "音楽・芸術",
    en: "Music & Arts",
    count: 38,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAPaHYuKQtX01FXnucaA1UC3Tz8Q3CEmRiES9d8xQuDcBh8iBP2inGgULOJkPnZbSJViGi8bqmzIPkkOkLPMXgLtGi9lxKikzfMVXxr0HbvZ0WjPS4dV1aScDUnXouNaRWXp4W9ksw7lG0r7Ygr10p5sMJvc4QevnnUDmaZwftYyBHzRtXWxRhgRaxwDINLWGvO53HlDYb9EhcA1GVNkXvoZubRufbokcXci5IBiNg0ROJVfc6-wOOQNjeJzghNBTTxypSbGdXad1Fv",
  },
  {
    id: "Japanese Culture",
    ja: "伝統文化",
    en: "Japanese Culture",
    count: 10,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAZHRu5hqi7xHd6IXmdXwAF3ZhqU_wdDW58wHhRyVlma2zx6SlHhrIsFoOU1KnAyIrmfyF8WXeLgBjGHc5gH3pWyrJVD0umpkpM02sX9W7TpmZAnXf9TwhCc4bFbQFQGud7eAZwl05SivDlPc0_8qhrRs9xC-yXhqRBs6AJt4fM6kQVw7ZAOa4t7tP1ogVsQRS9w3wy842retHkeslT_PeBWv4E5VsilO7cZk84GYxJpfvpN_tfq1T0je6wF566i5cZ12N8NveF5ffR",
  },
  {
    id: "Language & Social",
    ja: "語学・社会",
    en: "Language & Social",
    count: 31,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuB0pqhHWxRpwtdXRmDtNHjzDQk36LNiWZWi4aOUdQrSnKw5oAuWSfEM9ViajABvSWPTheT5HINae8c5gQo7vTz8GJM6okExV2A_TvLjyTkom2LYTwsL6pIzJk_aND6WlJK1gJvrMnNWvzhnNDrnJAGVOK5nA2E1BVL6Qd0Q9lfQ0HeFZprJ1hyCcmswkgA0k5Sau0Sm5p4RXU_3HANYJQNL_z8THqzCHswrSOyPsosbzjaw7L0cy3i3-bA6Ips_YL9nZGMLIU37I4GP",
  },
  {
    id: "Volunteer",
    ja: "ボランティア",
    en: "Volunteer",
    count: 8,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuDmxvIM53yLk4kvrWJtplAGESLMyGltAts2EgMdzJxTuP23slqY2oXwJbWtngZBl8wHYAZFObH4BdywxKq1fORiJ3p_68CbADaktv0dZ6_2DY6t_Dv6mf5QrSJj9g96lIbM5wiu9zZtQNadJK_ALuzYIsax_Q7xbAv0zjiqkOS0qR3T7dcVg3pTStrZu2VcesFodwrs3U_G10fusqjKVvhLBV-4kxxCVtmXNef_5eS1l_HvMzLaG4xP-iSI9Fn4-lOg0MTrCCZzDNK9",
  },
  {
    id: "Hobbies",
    ja: "その他",
    en: "Hobbies & Others",
    count: 20,
    img: "https://lh3.googleusercontent.com/aida-public/AB6AXuAxcqZyBJUSG7DFDim3hdaZQxA0evECZBrjRPj7IuyL_PRgCJ-18ltsRdWGRgWmicfPsXjHyC998aY0KA_k335DA7dhOWNq6Zqq3jfdiaUsINEtqEeozQiXQMzgDgmf8rIA39DP8ql9NEM3yB81JBzF38qiQTtzxnAeKaIcu8Gk2jFRKPiCdUHLHreIliYw71KPQbgLY3rR0JpSqoGZk_7wo7A8JidwBlhVud9feuQ7_O8LwhJcVcLVCeDteswLQvhGcHzoUVwmjXnE",
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
