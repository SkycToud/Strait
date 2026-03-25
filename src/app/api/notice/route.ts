import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

const TUFS_STUDENT_URL = 'https://www.tufs.ac.jp/student/';
const BASE_URL = 'https://www.tufs.ac.jp';

export interface NoticeItem {
  date: string;
  datetime: string;
  category: string;
  title: string;
  url: string;
}

function resolveUrl(href: string): string {
  if (!href) return TUFS_STUDENT_URL;
  if (href.startsWith('http://') || href.startsWith('https://')) return href;
  if (href.startsWith('/')) return BASE_URL + href;
  return TUFS_STUDENT_URL + href;
}

export async function GET() {
  try {
    const res = await fetch(TUFS_STUDENT_URL, {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (compatible; Strait/1.0; +https://github.com/SkycToud/Strait)',
        Accept: 'text/html,application/xhtml+xml',
        'Accept-Language': 'ja,en;q=0.9',
      },
      next: { revalidate: 0 }, // キャッシュなし（常に最新を取得）
    });

    if (!res.ok) {
      return NextResponse.json(
        { error: `Failed to fetch TUFS page: ${res.status}` },
        { status: 502 }
      );
    }

    const html = await res.text();
    const $ = cheerio.load(html);

    const items: NoticeItem[] = [];

    // tab_all の topics_list から全お知らせを取得
    $('#tab_all .topics_list dt.topics_list_date').each((_, dtEl) => {
      const $dt = $(dtEl);
      const timeEl = $dt.find('time');
      const date = timeEl.text().trim();
      const datetime = timeEl.attr('datetime') ?? '';

      // dt の次の兄弟要素から label と link を取得
      const $labelDd = $dt.nextAll('dd.topics_list_label').first();
      const $linkDd = $dt.nextAll('dd.topics_list_link').first();

      const category = $labelDd.text().trim();
      const $a = $linkDd.find('a');
      const title = $a.text().trim();
      const href = $a.attr('href') ?? '';
      const url = resolveUrl(href);

      if (title) {
        items.push({ date, datetime, category, title, url });
      }
    });

    return NextResponse.json(
      { items, fetchedAt: new Date().toISOString() },
      {
        headers: {
          // ブラウザキャッシュを無効化し、常にサーバーから取得させる
          'Cache-Control': 'no-store, max-age=0',
        },
      }
    );
  } catch (err) {
    console.error('[/api/notice] Error:', err);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
