export const revalidate = 3600;

export interface TufsNewsItem {
  date: string;
  category: string;
  title: string;
  url: string;
}

// URLパスからカテゴリ名を判定
function categoryFromUrl(url: string): string {
  if (url.includes('/NEWS/education/') || url.includes('/education/')) return '教務';
  if (url.includes('/NEWS/study_abroad/') || url.includes('/studyabroad/') || url.includes('/留学')) return '留学';
  if (url.includes('/NEWS/career/') || url.includes('/careersupport/')) return 'キャリア支援';
  if (url.includes('/NEWS/student_life/') || url.includes('/extraordinary/') || url.includes('/dorm/')) return '学生生活';
  if (url.includes('/NEWS/other/')) return 'その他';
  if (url.includes('/tuition_scholarship/scholarship/')) return '留学';
  if (url.includes('/library/')) return 'その他';
  if (url.includes('/pg-support/') || url.includes('/pg/')) return '教務';
  return 'その他';
}

// ファイル名の日付パターン YYMMDD → YYYY.MM.DD
function dateFromUrl(url: string): string {
  // パターン1: /260304_1.html → 2026.03.04
  const fileMatch = url.match(/\/(\d{2})(\d{2})(\d{2})_?\d*\.(html|pdf)$/i);
  if (fileMatch) {
    const [, yy, mm, dd] = fileMatch;
    return `20${yy}.${mm}.${dd}`;
  }
  // パターン2: /2026/03/... など
  const pathMatch = url.match(/\/(20\d{2})\/(\d{2})\//);
  if (pathMatch) {
    return `${pathMatch[1]}.${pathMatch[2]}.--`;
  }
  return '';
}

export async function GET() {
  try {
    const res = await fetch('https://www.tufs.ac.jp/student/NEWS/index.html', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json({ items: [], error: 'Fetch failed' }, { status: 502 });
    }

    const html = await res.text();
    const items = parseNewsItems(html);

    return Response.json({ items });
  } catch {
    return Response.json({ items: [], error: 'Internal error' }, { status: 500 });
  }
}

function parseNewsItems(html: string): TufsNewsItem[] {
  const items: TufsNewsItem[] = [];
  const seen = new Set<string>();

  // <a href="...">タイトル</a> を全件抽出
  const linkPattern = /<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/gi;
  let match: RegExpExecArray | null;

  while ((match = linkPattern.exec(html)) !== null) {
    let url = match[1].trim();
    const rawTitle = match[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

    if (!rawTitle || rawTitle.length < 5) continue;

    // 相対URL → 絶対URL
    if (url.startsWith('/')) {
      url = `https://www.tufs.ac.jp${url}`;
    } else if (!url.startsWith('http')) {
      continue;
    }

    // TUFSドメイン外は除外
    if (!url.includes('tufs.ac.jp')) continue;

    // ナビリンク・フッターなどを除外（パスが短すぎるもの）
    const urlPath = new URL(url).pathname;
    if (urlPath.split('/').filter(Boolean).length < 2) continue;

    // 重複除外
    if (seen.has(url)) continue;
    seen.add(url);

    const category = categoryFromUrl(url);
    const date = dateFromUrl(url);

    items.push({ date, category, title: rawTitle, url });
  }

  // 日付の新しい順にソート（日付なしは末尾）
  items.sort((a, b) => {
    if (!a.date && !b.date) return 0;
    if (!a.date) return 1;
    if (!b.date) return -1;
    return b.date.localeCompare(a.date);
  });

  return items;
}
