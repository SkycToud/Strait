export const revalidate = 3600; // 1時間ごとに再取得

export interface TufsNotice {
  date: string;
  category: string;
  title: string;
  url: string;
}

export async function GET() {
  try {
    const res = await fetch('https://www.tufs.ac.jp/student/', {
      headers: {
        'User-Agent':
          'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'ja,en;q=0.9',
      },
      next: { revalidate: 3600 },
    });

    if (!res.ok) {
      return Response.json({ notices: [], error: 'Fetch failed' }, { status: 502 });
    }

    const html = await res.text();
    const notices = parseNotices(html);

    return Response.json({ notices });
  } catch {
    return Response.json({ notices: [], error: 'Internal error' }, { status: 500 });
  }
}

function parseNotices(html: string): TufsNotice[] {
  const notices: TufsNotice[] = [];

  /**
   * TUFSの学生ページのNoticeリストは以下のような構造:
   *   <li>
   *     <time datetime="2026.03.18">2026.03.18</time>
   *     <span class="tag ...">教務</span>
   *     <a href="/...">タイトル</a>
   *   </li>
   *
   * もしくは単純に:
   *   <li><span class="date">2026.03.18</span><span class="tag">教務</span><a href="...">...</a></li>
   *
   * 汎用的な正規表現で取得する。
   */

  // <li> ブロック内から日付・カテゴリ・リンクを抽出するパターン
  const liPattern = /<li[^>]*>([\s\S]*?)<\/li>/gi;
  let liMatch: RegExpExecArray | null;

  while ((liMatch = liPattern.exec(html)) !== null) {
    const liContent = liMatch[1];

    // 日付の抽出 (<time> タグ or テキストパターン YYYY.MM.DD)
    const dateMatch =
      liContent.match(/<time[^>]*>\s*(\d{4}\.\d{2}\.\d{2})\s*<\/time>/i) ||
      liContent.match(/(\d{4}\.\d{2}\.\d{2})/);
    if (!dateMatch) continue;
    const date = dateMatch[1];

    // リンクの抽出
    const linkMatch = liContent.match(/<a\s[^>]*href=["']([^"']+)["'][^>]*>([\s\S]*?)<\/a>/i);
    if (!linkMatch) continue;

    let url = linkMatch[1].trim();
    // 相対URLを絶対URLに変換
    if (url.startsWith('/')) {
      url = `https://www.tufs.ac.jp${url}`;
    } else if (!url.startsWith('http')) {
      continue;
    }

    // タイトルのクリーンアップ（HTMLタグ除去・改行除去）
    const title = linkMatch[2]
      .replace(/<[^>]+>/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!title || title.length < 3) continue;

    // カテゴリの抽出（タグスパン内テキスト）
    const categoryMatch = liContent.match(
      /<span[^>]*class=["'][^"']*tag[^"']*["'][^>]*>([\s\S]*?)<\/span>/i
    );
    const category = categoryMatch
      ? categoryMatch[1].replace(/<[^>]+>/g, '').trim()
      : '';

    notices.push({ date, category, title, url });
  }

  // 重複を除去し最新20件を返す
  const seen = new Set<string>();
  const deduped = notices.filter((n) => {
    const key = n.url;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  return deduped.slice(0, 20);
}
