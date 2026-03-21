import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

/**
 * 使い方：
 * 1. Google フォームなどからエクスポートした CSV または JSON データを `survey-results.json` などとして一時保存する。
 * 2. このスクリプト内で、そのデータを読み込み、各設問の回答を Markdown の Frontmatter や本文にマッピングする。
 * 3. `npx tsx scripts/import-survey.ts` を実行して、一括で内容を更新する。
 */

const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');

// ダミーデータ: 実際は CSV/JSON ファイルを読み込みます
const mockSurveyResponses = [
  {
    clubId: 'kemari-miyabi',
    newPhilosophy: '「鞠を蹴り、世界を繋ぐ。」勝敗を競うのではなく、相手を思いやる気持ちを育みます。',
    newFee: '5,000円（半期）',
    // 外部URLの画像が指定された場合の処理例
    thumbnailUrl: 'https://example.com/images/kemari.jpg' 
  }
];

function updateClubsFromSurvey() {
  mockSurveyResponses.forEach(res => {
    const filePath = path.join(CONTENT_DIR, `${res.clubId}.md`);
    if (!fs.existsSync(filePath)) {
      console.warn(`Club ${res.clubId} not found, skipping.`);
      return;
    }

    const rawFile = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(rawFile);
    
    // Frontmatter(YAML設定部分) の更新
    if (parsed.data.overview) {
      parsed.data.overview.philosophy = res.newPhilosophy;
    }
    if (parsed.data.recruitment) {
      parsed.data.recruitment.annualFee = res.newFee;
    }

    // サムネイル画像の更新（外部URLをそのまま使う場合）
    if (res.thumbnailUrl) {
      parsed.data.thumbnail = res.thumbnailUrl;
    }
    // ※ 手動で /public/images/clubs/ に保存した画像名（例: new-kemari.jpg）を使う場合:
    // parsed.data.thumbnail = `/images/clubs/${res.imageFileName}`;

    // 書き戻し
    const newFileContent = matter.stringify(parsed.content, parsed.data);
    fs.writeFileSync(filePath, newFileContent, 'utf-8');
    console.log(`Updated ${res.clubId}.md`);
  });

  console.log('Survey import completed.');
}

updateClubsFromSurvey();
