'use client';

import { useEffect, useState, useCallback } from 'react';
import type { NoticeItem } from '@/app/api/notice/route';

const CATEGORY_COLORS: Record<string, string> = {
  教務: 'bg-primary/10 text-primary',
  留学: 'bg-tertiary-container text-on-tertiary-container',
  学生生活: 'bg-secondary-container text-on-secondary-container',
  キャリア支援: 'bg-error-container/30 text-error',
  その他: 'bg-surface-container-high text-on-surface-variant',
};

function getCategoryStyle(category: string): string {
  return CATEGORY_COLORS[category] ?? 'bg-surface-container-high text-on-surface-variant';
}

function formatDate(dateStr: string): { year: string; monthDay: string } {
  // "2026.03.18" → { year: "2026", monthDay: "03.18" }
  const parts = dateStr.split('.');
  if (parts.length === 3) {
    return { year: parts[0], monthDay: `${parts[1]}.${parts[2]}` };
  }
  return { year: '', monthDay: dateStr };
}

export default function NoticeSection() {
  const [items, setItems] = useState<NoticeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fetchedAt, setFetchedAt] = useState<string | null>(null);

  const fetchNotices = useCallback(async () => {
    try {
      const res = await fetch('/api/notice', { cache: 'no-store' });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setItems(data.items ?? []);
      setFetchedAt(data.fetchedAt ?? null);
      setError(null);
    } catch (e) {
      setError('お知らせの取得に失敗しました。');
      console.error('[NoticeSection]', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchNotices();
  }, [fetchNotices]);

  return (
    <section className="lg:col-span-12">
      {/* Section Header */}
      <div className="mb-4 px-2 flex justify-between items-center">
        <h2 className="text-xl font-bold">
          最新のお知らせ{' '}
          <span className="text-sm font-normal text-on-surface-variant ml-2">Notice</span>
        </h2>
        <a
          href="https://www.tufs.ac.jp/student/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-semibold text-primary hover:underline"
        >
          公式サイトで見る
        </a>
      </div>

      {/* Content */}
      <div className="bg-surface-container-lowest rounded-3xl shadow-sm border border-outline-variant/10 overflow-hidden">
        {loading && (
          <div className="flex flex-col gap-0 divide-y divide-outline-variant/10">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-16 h-4 bg-surface-container-high rounded-full shrink-0" />
                <div className="w-14 h-5 bg-surface-container-high rounded-full shrink-0" />
                <div className="flex-1 h-4 bg-surface-container-high rounded-full" />
              </div>
            ))}
          </div>
        )}

        {!loading && error && (
          <div className="px-6 py-8 text-center text-on-surface-variant text-sm">
            <span className="material-symbols-outlined text-3xl mb-2 block">error_outline</span>
            {error}
            <button
              onClick={fetchNotices}
              className="mt-3 block mx-auto text-primary text-xs font-semibold hover:underline"
            >
              再読み込み
            </button>
          </div>
        )}

        {!loading && !error && items.length === 0 && (
          <div className="px-6 py-8 text-center text-on-surface-variant text-sm">
            現在お知らせはありません。
          </div>
        )}

        {!loading && !error && items.length > 0 && (
          <ul className="divide-y divide-outline-variant/10">
            {items.map((item, index) => {
              const { year, monthDay } = formatDate(item.date);
              return (
                <li key={`${item.datetime}-${index}`}>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-start sm:items-center gap-3 sm:gap-4 px-6 py-4 hover:bg-surface-container-low transition-colors"
                  >
                    {/* Date */}
                    <div className="shrink-0 text-right min-w-[4.5rem]">
                      <span className="text-[10px] text-on-surface-variant block leading-none mb-0.5">
                        {year}
                      </span>
                      <span className="text-sm font-semibold text-on-surface tabular-nums">
                        {monthDay}
                      </span>
                    </div>

                    {/* Category Badge */}
                    {item.category && (
                      <span
                        className={`shrink-0 px-2.5 py-0.5 rounded-full text-xs font-bold ${getCategoryStyle(item.category)}`}
                      >
                        {item.category}
                      </span>
                    )}

                    {/* Title */}
                    <span className="flex-1 text-sm text-on-surface group-hover:text-primary transition-colors leading-snug line-clamp-2 sm:line-clamp-1">
                      {item.title}
                    </span>

                    {/* Arrow */}
                    <span className="material-symbols-outlined text-outline-variant group-hover:text-primary transition-colors text-base shrink-0 hidden sm:block">
                      arrow_forward
                    </span>
                  </a>
                </li>
              );
            })}
          </ul>
        )}

        {/* Footer: last fetched time */}
        {fetchedAt && !loading && (
          <div className="px-6 py-3 border-t border-outline-variant/10 flex justify-between items-center">
            <span className="text-[10px] text-on-surface-variant">
              最終取得:{' '}
              {new Date(fetchedAt).toLocaleString('ja-JP', {
                timeZone: 'Asia/Tokyo',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </span>
            <button
              onClick={() => {
                setLoading(true);
                fetchNotices();
              }}
              className="text-[10px] text-primary font-semibold hover:underline flex items-center gap-1"
            >
              <span className="material-symbols-outlined text-sm">refresh</span>
              更新
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
