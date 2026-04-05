import fs from 'fs';
import path from 'path';

/**
 * CSV アンケート回答 → clubs.json インポートスクリプト
 *
 * 使い方:
 *   npx tsx scripts/import-csv-survey.ts
 *
 * フィードバック反映:
 *   - 既存カテゴリに該当しないジャンルは "Hobbies"（その他）に分類
 *   - 複数ジャンルがある場合、全てを確認して既存カテゴリに一致する最初のものを採用
 */

const CSV_PATH = path.resolve(
  process.cwd(),
  '..',
  'Downloads',
  'サークル情報掲載用アンケート（回答） - フォームの回答 1 (1).csv'
);
const JSON_DATA_PATH = path.join(process.cwd(), 'src/data/clubs.json');

// ====== サークル名 → 既存ID マッピング ======
const NAME_TO_ID: Record<string, string> = {
  '東京外国語大学KpopカバーダンスサークルSouls': 'kpopcoverdancecircle',
  'ポンダンスサークルAmity': 'pomdancecircle',
  '美術部': 'artclub',
  'GMC': 'gmc',
  'フロアボールクラブ': 'floorballclub',
  '東京外国語大学お笑いサークルXBULL': 'xbull',
  '表千家茶道部': 'omotesenketeaceremony',
  'Mres': 'mres',
  '学生NGO ALPHA': 'alpha',
  '朝鮮舞踊部': 'koreandanceclub',             // 新規
  '地域活性化サークルいもに会': 'regionalrevitalizationcircleimonikai',
  '東京外大アルゼンチンタンゴサークル': 'argentinetangocircle',
  'タップダンスサークルTUPS': 'tapdancesociety',
  'たふえね': 'tafuene',                        // 新規
  'TUFPOST': 'tufpost',
};

// ====== CSVジャンル → 既存カテゴリ マッピング ======
// 既存カテゴリ一覧:
//   Ball Sports, Track & Field / Martial Arts, Music & Arts,
//   Dance & Performance, Japanese Culture / Language / Social,
//   Volunteer & Other Organizations, Martial Arts,
//   Language & Social Studies, Hobbies
//
// 存在しないジャンルは全て "Hobbies"(その他) にフォールバック
const GENRE_TO_CATEGORY: Record<string, string> = {
  '芸術・音楽': 'Music & Arts',
  '舞踊・ダンス': 'Dance & Performance',
  '球技': 'Ball Sports',
  '伝統文化': 'Japanese Culture / Language / Social',
  'ボランティア': 'Volunteer & Other Organizations',
  '語学・国際交流': 'Language & Social Studies',
  '武道': 'Martial Arts',
  '陸上・格闘技': 'Track & Field / Martial Arts',
};
// ↑ 上記にないジャンル（お笑い、社会課題、企画、メディア等）→ "Hobbies"

// ====== CSV パーサー（改行を含むフィールド対応） ======
function parseCSV(text: string): string[][] {
  const rows: string[][] = [];
  let current = '';
  let inQuotes = false;
  let row: string[] = [];

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        current += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        current += ch;
      }
    } else {
      if (ch === '"') {
        inQuotes = true;
      } else if (ch === ',') {
        row.push(current);
        current = '';
      } else if (ch === '\r' || ch === '\n') {
        if (ch === '\r' && text[i + 1] === '\n') i++;
        row.push(current);
        current = '';
        if (row.length > 1) rows.push(row);
        row = [];
      } else {
        current += ch;
      }
    }
  }
  if (current || row.length) {
    row.push(current);
    if (row.length > 1) rows.push(row);
  }
  return rows;
}

// ====== Instagram URL の正規化 ======
function normalizeInstagram(raw: string): string {
  if (!raw) return '';
  raw = raw.trim();
  if (raw.startsWith('http')) return raw;
  const handle = raw.replace(/^@/, '');
  return `https://www.instagram.com/${handle}/`;
}

// ====== X(Twitter) URL の正規化 ======
function normalizeX(raw: string): string {
  if (!raw) return '';
  raw = raw.trim();
  if (raw.startsWith('http')) return raw;
  const handle = raw.replace(/^@/, '');
  return `https://x.com/${handle}`;
}

// ====== 募集対象 → targetGrades 変換 ======
function parseTargetGrades(text: string): string[] {
  if (!text) return [];
  if (text.includes('全学年') || text.includes('どなたでも') || text.includes('誰でも')) {
    return ['1年生', '2年生', '3年生', '4年生'];
  }
  const grades: string[] = [];
  if (text.includes('1') || text.includes('１')) grades.push('1年生');
  if (text.includes('2') || text.includes('２')) grades.push('2年生');
  if (text.includes('3') || text.includes('３')) grades.push('3年生');
  if (text.includes('4') || text.includes('４')) grades.push('4年生');
  return grades.length > 0 ? grades : ['1年生', '2年生', '3年生', '4年生'];
}

// ====== ジャンル → カテゴリ 変換（全ジャンルを参照し最初のマッチを採用） ======
function resolveCategory(genresField: string): string {
  if (!genresField) return 'Hobbies';
  const genres = genresField.split(',').map(g => g.trim()).filter(Boolean);
  for (const genre of genres) {
    if (GENRE_TO_CATEGORY[genre]) {
      return GENRE_TO_CATEGORY[genre];
    }
  }
  // どのジャンルも既存カテゴリにマッチしない場合は "Hobbies"（その他）
  return 'Hobbies';
}

// ====== メイン処理 ======
function main() {
  console.log('🚀 CSVインポートを開始...\n');

  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSVファイルが見つかりません:', CSV_PATH);
    process.exit(1);
  }

  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvText);
  const dataRows = rows.slice(1); // ヘッダーをスキップ

  // clubs.json を読み込み
  const clubsData = JSON.parse(fs.readFileSync(JSON_DATA_PATH, 'utf-8'));
  let updatedCount = 0;
  let addedCount = 0;

  dataRows.forEach((cols) => {
    // CSVカラムのインデックス（ヘッダー行の順番に対応）
    const clubName       = cols[1]?.trim();
    const philosophy     = cols[4]?.trim();
    const activities     = cols[5]?.trim();
    const executiveGen   = cols[6]?.trim();
    const organization   = cols[7]?.trim();
    const memberCount    = parseInt(cols[8]) || 0;
    const year1          = parseInt(cols[9]) || 0;
    const year2          = parseInt(cols[10]) || 0;
    const year3          = parseInt(cols[11]) || 0;
    const year4          = parseInt(cols[12]) || 0;
    const isIntra        = cols[13]?.trim();
    const frequency      = cols[14]?.trim();
    const location       = cols[15]?.trim();
    const appeal         = cols[16]?.trim();
    const challenges     = cols[17]?.trim();
    const annualPlan     = cols[18]?.trim();
    const welcomeEvents  = cols[19]?.trim();
    const annualFee      = cols[20]?.trim();
    const hasSelection   = cols[21]?.trim();
    const targetAudience = cols[22]?.trim();
    const website        = cols[23]?.trim();
    const instagramRaw   = cols[24]?.trim();
    const xRaw           = cols[25]?.trim();
    const facebook       = cols[26]?.trim();
    const line           = cols[27]?.trim();
    const genres         = cols[28]?.trim();
    const description    = cols[29]?.trim();

    if (!clubName) return;

    const clubId = NAME_TO_ID[clubName];
    if (!clubId) {
      console.warn(`⚠️  マッピングなし（スキップ）: "${clubName}"`);
      return;
    }

    // カテゴリ決定（全ジャンルを確認、マッチなしは Hobbies）
    const category = resolveCategory(genres);

    // yearDistribution 構築
    const yearDist: string[] = [];
    if (year1 > 0) yearDist.push(`1年生: ${year1}人`);
    if (year2 > 0) yearDist.push(`2年生: ${year2}人`);
    if (year3 > 0) yearDist.push(`3年生: ${year3}人`);
    if (year4 > 0) yearDist.push(`4年生: ${year4}人`);

    // annualPlan を配列に
    const planArray = annualPlan
      ? annualPlan.split('\n').map((l: string) => l.trim()).filter(Boolean)
      : [];

    // 更新データ構築
    const updateData: Record<string, any> = {
      category,
      description: description || '',
      overview: {
        philosophy: philosophy || '',
        activities: activities || '',
      },
      operations: {
        executiveMembers: [executiveGen || ''],
        organization: organization || '',
      },
      membership: {
        memberCount,
        yearDistribution: yearDist,
        isIntraUniversity: isIntra?.includes('可能') || false,
      },
      schedule: {
        frequency: frequency || '',
        location: location || '',
        annualPlan: planArray,
      },
      recruitment: {
        appeal: appeal || '',
        challenges: challenges || '',
        welcomeEvents: welcomeEvents || '',
        applicationFlow: welcomeEvents || '',
        annualFee: annualFee || '',
        hasSelection: !(hasSelection?.includes('なし') ?? true),
        targetAudience: targetAudience || '',
        targetGrades: parseTargetGrades(targetAudience),
        contact: {
          website: website || '',
          facebook: facebook || '',
          line: line || '',
        },
      },
      lastUpdated: new Date().toISOString().split('T')[0],
    };

    // Instagram
    const instagramUrl = normalizeInstagram(instagramRaw);
    if (instagramUrl) updateData.instagram = instagramUrl;

    // X(Twitter)
    const xUrl = normalizeX(xRaw);
    if (xUrl) updateData.xUrl = xUrl;

    // 既存クラブを検索
    const existingIdx = clubsData.findIndex((c: any) => c.id === clubId);

    if (existingIdx >= 0) {
      // 既存クラブを更新（既存フィールドを保持しつつマージ）
      const existing = clubsData[existingIdx];
      clubsData[existingIdx] = {
        ...existing,
        ...updateData,
        // thumbnail は既存を維持（Google Drive URLは直接使えない）
        thumbnail: existing.thumbnail,
        // nameJa/nameEn は既存を維持
        nameJa: existing.nameJa,
        nameEn: existing.nameEn,
        id: existing.id,
        overview: { ...existing.overview, ...updateData.overview },
        operations: { ...existing.operations, ...updateData.operations },
        membership: { ...existing.membership, ...updateData.membership },
        schedule: { ...existing.schedule, ...updateData.schedule },
        recruitment: {
          ...existing.recruitment,
          ...updateData.recruitment,
          contact: {
            ...existing.recruitment?.contact,
            ...updateData.recruitment.contact,
          },
        },
      };
      updatedCount++;
      console.log(`✅ 更新: ${clubId} (${clubName}) → カテゴリ: ${category}`);
    } else {
      // 新規クラブを追加
      clubsData.push({
        id: clubId,
        nameJa: clubName,
        nameEn: '', // 手動で英語名を追加する必要あり
        ...updateData,
      });
      addedCount++;
      console.log(`🆕 新規追加: ${clubId} (${clubName}) → カテゴリ: ${category}`);
    }
  });

  // 書き戻し
  fs.writeFileSync(JSON_DATA_PATH, JSON.stringify(clubsData, null, 2), 'utf-8');
  console.log(`\n🎉 完了!`);
  console.log(`   更新: ${updatedCount}件`);
  console.log(`   新規追加: ${addedCount}件`);
  console.log(`   合計クラブ数: ${clubsData.length}件`);
}

main();
