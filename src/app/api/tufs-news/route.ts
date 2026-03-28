export const revalidate = 3600;

export interface TufsNewsItem {
  date: string;
  category: string;
  title: string;
  url: string;
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

/**
 * TUFSのお知らせページは以下のHTML構造:
 *
 * <dl class="topics_list">
 *   <dt class="topics_list_date"><time datetime="2026-03-27 16:37:00">2026.03.27</time></dt>
 *   <dd class="topics_list_label">学生生活</dd>
 *   <dd class="topics_list_link"><a href="...">タイトル</a><span class="topics_list_new">NEW</span></dd>
 *   ...繰り返し...
 * </dl>
 */
function parseNewsItems(html: string): TufsNewsItem[] {
  const items: TufsNewsItem[] = [];
  const seen = new Set<string>();

  // topics_list の dl ブロックを抽出
  const dlMatch = html.match(/<dl\s[^>]*class=["'][^"']*topics_list[^"']*["'][^>]*>([\s\S]*?)<\/dl>/i);
  if (!dlMatch) return items;

  const dlContent = dlMatch[1];

  // dt/dd の並びを順番に処理
  // 各ニュース項目は: dt.topics_list_date → dd.topics_list_label → dd.topics_list_link
  const tagPattern = /<(dt|dd)\s[^>]*class=["']([^"']+)["'][^>]*>([\s\S]*?)<\/\1>/gi;
  let tagMatch: RegExpExecArray | null;

  let currentDate = '';
  let currentCategory = '';

  while ((tagMatch = tagPattern.exec(dlContent)) !== null) {
    const className = tagMatch[2];
    const innerHtml = tagMatch[3];

    if (className.includes('topics_list_date')) {
      // <time datetime="2026-03-27 16:37:00">2026.03.27</time>
      const timeMatch = innerHtml.match(/<time[^>]*>([\s\S]*?)<\/time>/i);
      currentDate = timeMatch
        ? timeMatch[1].replace(/<[^>]+>/g, '').trim()
        : innerHtml.replace(/<[^>]+>/g, '').trim();
    } else if (className.includes('topics_list_label')) {
      currentCategory = innerHtml.replace(/<[^>]+>/g, '').trim();
    } else if (className.includes('topics_list_link')) {
      // <a href="URL">タイトル</a>
      const linkMatch = innerHtml.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
      if (!linkMatch) continue;

      let url = linkMatch[1].trim();
      const rawTitle = linkMatch[2].replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();

      if (!rawTitle || rawTitle.length < 3) continue;

      // 相対URL → 絶対URL
      if (url.startsWith('/')) {
        url = `https://www.tufs.ac.jp${url}`;
      } else if (!url.startsWith('http')) {
        url = `https://www.tufs.ac.jp/student/NEWS/${url}`;
      }

      // 重複除外
      if (seen.has(url)) continue;
      seen.add(url);

      items.push({
        date: currentDate,
        category: currentCategory || 'その他',
        title: rawTitle,
        url,
      });
    }
  }

  return items;
}
