import Link from 'next/link';
import { ExternalLink, Bell } from 'lucide-react';
import type { TufsNewsItem } from '@/app/api/tufs-news/route';

// カテゴリごとの色定義
const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  教務:    { bg: 'bg-primary/10',   text: 'text-primary' },
  留学:    { bg: 'bg-tertiary/10',  text: 'text-tertiary' },
  学生生活: { bg: 'bg-secondary/10', text: 'text-secondary' },
  キャリア支援: { bg: 'bg-orange-500/10', text: 'text-orange-600' },
  その他:  { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

function getCategoryStyle(category: string) {
  return (
    CATEGORY_COLORS[category] ??
    CATEGORY_COLORS['その他']
  );
}

async function fetchNotices(): Promise<TufsNewsItem[]> {
  try {
    const baseUrl =
      process.env.NEXT_PUBLIC_BASE_URL ??
      (process.env.VERCEL_URL
        ? `https://${process.env.VERCEL_URL}`
        : 'http://localhost:3000');

    const res = await fetch(`${baseUrl}/api/tufs-news`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.items ?? [];
  } catch {
    return [];
  }
}

export async function TufsNotices() {
  const notices = await fetchNotices();
  const displayNotices = notices.slice(0, 7);

  return (
    <section className="lg:col-span-12">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <h2 className="text-xl font-bold flex items-center gap-2">
          <Bell className="w-5 h-5 text-primary" />
          在学生向けのお知らせ
        </h2>
        <Link
          href="/notices"
          className="text-sm font-semibold text-primary hover:underline"
        >
          See All
        </Link>
      </div>

      {/* Notice List */}
      <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
        {displayNotices.length === 0 ? (
          <div className="p-8 text-center text-on-surface-variant text-sm">
            お知らせを取得できませんでした
          </div>
        ) : (
          <ul className="divide-y divide-outline-variant/10">
            {displayNotices.map((notice, i) => {
              const style = getCategoryStyle(notice.category);
              return (
                <li key={`${notice.url}-${i}`} className="group">
                  <a
                    href={notice.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-start gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors duration-150"
                  >
                    {/* 日付 */}
                    <time
                      dateTime={notice.date}
                      className="text-xs text-on-surface-variant font-mono whitespace-nowrap pt-0.5 min-w-[72px]"
                    >
                      {notice.date}
                    </time>

                    {/* カテゴリタグ */}
                    {notice.category && (
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap shrink-0 ${style.bg} ${style.text}`}
                      >
                        {notice.category}
                      </span>
                    )}

                    {/* タイトル */}
                    <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors line-clamp-2 flex-1 leading-snug">
                      {notice.title}
                    </span>

                    {/* 外部リンクアイコン */}
                    <ExternalLink className="w-3.5 h-3.5 text-outline shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </a>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </section>
  );
}
