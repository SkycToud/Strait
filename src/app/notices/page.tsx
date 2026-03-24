'use client';

import { useState, useEffect, useMemo } from 'react';
import { ExternalLink, Bell, ChevronRight } from 'lucide-react';
import type { TufsNewsItem } from '@/app/api/tufs-news/route';
import PageHeader from '@/components/layout/PageHeader';

const CATEGORIES = ['すべて', '教務', '留学', '学生生活', 'キャリア支援', 'その他'] as const;

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
  教務:       { bg: 'bg-primary/10',         text: 'text-primary' },
  留学:       { bg: 'bg-tertiary/10',         text: 'text-tertiary' },
  学生生活:   { bg: 'bg-secondary/10',        text: 'text-secondary' },
  キャリア支援: { bg: 'bg-orange-500/10',     text: 'text-orange-600' },
  その他:     { bg: 'bg-surface-container-high', text: 'text-on-surface-variant' },
};

function getCategoryStyle(category: string) {
  return CATEGORY_COLORS[category] ?? CATEGORY_COLORS['その他'];
}

export default function NoticesPage() {
  const [items, setItems] = useState<TufsNewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>('すべて');

  useEffect(() => {
    fetch('/api/tufs-news')
      .then((r) => {
        if (!r.ok) throw new Error();
        return r.json();
      })
      .then((data) => setItems(data.items ?? []))
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const filtered = useMemo(() => {
    if (activeCategory === 'すべて') return items;
    return items.filter((item) => item.category === activeCategory);
  }, [items, activeCategory]);

  return (
    <>
      {/* Page Header */}
      <PageHeader
        title="お知らせ"
        subtitle="Notices"
        description="東京外国語大学 在学生向けお知らせ一覧"
      />

      {/* Category Tabs */}
      <div className="flex gap-2 flex-wrap mb-6">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition-all duration-200 ${
              activeCategory === cat
                ? 'bg-primary text-white shadow-md shadow-primary/20'
                : 'bg-surface-container-low text-on-surface-variant hover:bg-surface-container hover:text-on-surface'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Content */}
      {loading && (
        <div className="space-y-3">
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="h-14 rounded-2xl bg-surface-container-low animate-pulse"
              style={{ animationDelay: `${i * 40}ms` }}
            />
          ))}
        </div>
      )}

      {error && (
        <div className="flex flex-col items-center justify-center py-20 text-on-surface-variant gap-3">
          <Bell className="w-10 h-10 opacity-30" />
          <p className="text-sm">お知らせを取得できませんでした</p>
          <a
            href="https://www.tufs.ac.jp/student/NEWS/index.html"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary text-sm hover:underline flex items-center gap-1"
          >
            公式サイトで確認 <ExternalLink className="w-3.5 h-3.5" />
          </a>
        </div>
      )}

      {!loading && !error && (
        <>
          <p className="text-xs text-on-surface-variant mb-4 px-1">
            {filtered.length} 件
          </p>

          <div className="bg-surface-container-lowest rounded-3xl border border-outline-variant/10 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-on-surface-variant text-sm">
                このカテゴリのお知らせはありません
              </div>
            ) : (
              <ul className="divide-y divide-outline-variant/10">
                {filtered.map((item, i) => {
                  const style = getCategoryStyle(item.category);
                  return (
                    <li key={`${item.url}-${i}`} className="group">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-3 px-5 py-4 hover:bg-surface-container-low transition-colors duration-150"
                      >
                        {/* 日付 */}
                        {item.date && (
                          <time
                            dateTime={item.date}
                            className="text-xs text-on-surface-variant font-mono whitespace-nowrap pt-0.5 min-w-[72px] shrink-0"
                          >
                            {item.date}
                          </time>
                        )}

                        {/* カテゴリバッジ */}
                        <span
                          className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap shrink-0 mt-0.5 ${style.bg} ${style.text}`}
                        >
                          {item.category}
                        </span>

                        {/* タイトル */}
                        <span className="text-sm font-medium text-on-surface group-hover:text-primary transition-colors flex-1 leading-snug">
                          {item.title}
                        </span>

                        {/* 矢印アイコン */}
                        <ChevronRight className="w-4 h-4 text-outline shrink-0 mt-0.5 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </>
      )}
    </>
  );
}
