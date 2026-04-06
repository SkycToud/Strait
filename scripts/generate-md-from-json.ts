import fs from 'fs';
import path from 'path';

/**
 * clubs.json → src/content/clubs/*.md 生成スクリプト
 *
 * clubs.json の全クラブデータを Markdown (YAML frontmatter) ファイルとして
 * src/content/clubs/ に書き出す。
 *
 * カテゴリ値は page.tsx のカテゴリ体系に合わせて変換する。
 *
 * 使い方: npx tsx scripts/generate-md-from-json.ts
 */

const JSON_DATA_PATH = path.join(process.cwd(), 'src/data/clubs.json');
const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');

// ====== clubs.json のカテゴリ → page.tsx のカテゴリID 変換 ======
// page.tsx で定義されているカテゴリ:
//   Ball Sports, Martial Arts, Arts & Music, Dance & Performance,
//   Other Sports, Volunteer, Language & International,
//   Social Issues, Planning, Others
const CATEGORY_MAP: Record<string, string> = {
  'Ball Sports': 'Ball Sports',
  'Track & Field / Martial Arts': 'Other Sports',
  'Music & Arts': 'Arts & Music',
  'Dance & Performance': 'Dance & Performance',
  'Japanese Culture / Language / Social': 'Others',
  'Volunteer & Other Organizations': 'Volunteer',
  'Martial Arts': 'Martial Arts',
  'Language & Social Studies': 'Language & International',
  'Hobbies': 'Others',
};

// ====== YAML エスケープ ======
function yamlString(value: string | undefined | null): string {
  if (!value) return "''";
  // 複数行がある場合は |- (block scalar) を使う
  if (value.includes('\n')) {
    return '|-\n' + value.split('\n').map(line => '    ' + line).join('\n');
  }
  // 特殊文字を含む場合はクォート
  if (
    value.includes(':') || value.includes('#') || value.includes('{') ||
    value.includes('}') || value.includes('[') || value.includes(']') ||
    value.includes(',') || value.includes('&') || value.includes('*') ||
    value.includes('?') || value.includes('|') || value.includes('-') ||
    value.includes('<') || value.includes('>') || value.includes('=') ||
    value.includes('!') || value.includes('%') || value.includes('@') ||
    value.includes('`') || value.startsWith("'") || value.startsWith('"') ||
    /^\d/.test(value) || value === 'true' || value === 'false' ||
    value === 'null' || value === 'yes' || value === 'no'
  ) {
    // シングルクォートでエスケープ（内部の ' は '' に）
    return "'" + value.replace(/'/g, "''") + "'";
  }
  return value;
}

function yamlMultilineString(value: string | undefined | null, indent: number): string {
  if (!value) return "''";
  const prefix = ' '.repeat(indent);
  if (value.includes('\n')) {
    return '|-\n' + value.split('\n').map(line => prefix + line).join('\n');
  }
  return yamlString(value);
}

// ====== Markdown ファイル生成 ======
function generateMarkdown(club: any): string {
  const category = CATEGORY_MAP[club.category] || 'Others';

  const lines: string[] = [];
  lines.push('---');
  lines.push(`nameJa: ${yamlString(club.nameJa)}`);
  lines.push(`nameEn: ${yamlString(club.nameEn || '')}`);
  lines.push(`category: ${yamlString(category)}`);
  lines.push(`description: ${yamlString(club.description || '')}`);

  if (club.isSample) {
    lines.push(`isSample: true`);
  }

  if (club.thumbnail) {
    lines.push(`thumbnail: ${yamlString(club.thumbnail)}`);
  }

  if (club.instagram) {
    lines.push(`instagram: ${yamlString(club.instagram)}`);
  }

  if (club.xUrl) {
    lines.push(`xUrl: ${yamlString(club.xUrl)}`);
  }

  if (club.metadata) {
    lines.push(`metadata: ${yamlString(club.metadata)}`);
  }

  // overview
  lines.push('overview:');
  lines.push(`  philosophy: ${yamlMultilineString(club.overview?.philosophy, 4)}`);
  if (club.overview?.guidelines) {
    lines.push(`  guidelines: ${yamlMultilineString(club.overview.guidelines, 4)}`);
  }
  lines.push(`  activities: ${yamlMultilineString(club.overview?.activities, 4)}`);

  // operations
  lines.push('operations:');
  lines.push('  executiveMembers:');
  const execs = club.operations?.executiveMembers || ['準備中'];
  execs.forEach((member: string) => {
    lines.push(`    - ${yamlString(member)}`);
  });
  lines.push(`  organization: ${yamlMultilineString(club.operations?.organization, 4)}`);

  // membership
  lines.push('membership:');
  lines.push(`  memberCount: ${club.membership?.memberCount || 0}`);
  lines.push('  yearDistribution:');
  const yearDist = club.membership?.yearDistribution || ['準備中'];
  yearDist.forEach((entry: string) => {
    lines.push(`    - ${yamlString(entry)}`);
  });
  lines.push(`  isIntraUniversity: ${club.membership?.isIntraUniversity ? 'true' : 'false'}`);
  if (club.membership?.demographics) {
    lines.push(`  demographics: ${yamlMultilineString(club.membership.demographics, 4)}`);
  }

  // schedule
  lines.push('schedule:');
  lines.push(`  frequency: ${yamlString(club.schedule?.frequency || '準備中')}`);
  lines.push(`  location: ${yamlString(club.schedule?.location || '準備中')}`);
  lines.push('  annualPlan:');
  const plans = club.schedule?.annualPlan || ['準備中'];
  plans.forEach((plan: string) => {
    lines.push(`    - ${yamlString(plan)}`);
  });

  // recruitment
  lines.push('recruitment:');
  lines.push(`  appeal: ${yamlMultilineString(club.recruitment?.appeal, 4)}`);
  lines.push(`  challenges: ${yamlMultilineString(club.recruitment?.challenges, 4)}`);
  lines.push(`  applicationFlow: ${yamlMultilineString(club.recruitment?.applicationFlow, 4)}`);
  lines.push(`  welcomeEvents: ${yamlMultilineString(club.recruitment?.welcomeEvents, 4)}`);
  if (club.recruitment?.applicationDeadline) {
    lines.push(`  applicationDeadline: ${yamlString(club.recruitment.applicationDeadline)}`);
  }
  lines.push(`  annualFee: ${yamlString(club.recruitment?.annualFee || '準備中')}`);
  lines.push(`  hasSelection: ${club.recruitment?.hasSelection ? 'true' : 'false'}`);
  lines.push(`  targetAudience: ${yamlMultilineString(club.recruitment?.targetAudience, 4)}`);
  lines.push('  contact:');
  lines.push(`    facebook: ${yamlString(club.recruitment?.contact?.facebook || '')}`);
  lines.push(`    website: ${yamlString(club.recruitment?.contact?.website || '')}`);
  lines.push(`    line: ${yamlString(club.recruitment?.contact?.line || '')}`);

  // targetGrades
  const grades = club.recruitment?.targetGrades || [];
  if (grades.length > 0) {
    lines.push('  targetGrades:');
    grades.forEach((grade: string) => {
      lines.push(`    - ${yamlString(grade)}`);
    });
  } else {
    lines.push('  targetGrades: []');
  }

  // lastUpdated
  lines.push(`lastUpdated: ${yamlString(club.lastUpdated || new Date().toISOString().split('T')[0])}`);

  lines.push('---');
  lines.push('');

  return lines.join('\n');
}

// ====== メイン ======
function main() {
  console.log('🚀 clubs.json → Markdown 生成を開始...\n');

  if (!fs.existsSync(JSON_DATA_PATH)) {
    console.error('❌ clubs.json が見つかりません:', JSON_DATA_PATH);
    process.exit(1);
  }

  // 出力ディレクトリ作成
  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  const clubsData = JSON.parse(fs.readFileSync(JSON_DATA_PATH, 'utf-8'));
  let count = 0;
  let errorCount = 0;

  clubsData.forEach((club: any) => {
    try {
      const markdown = generateMarkdown(club);
      const filePath = path.join(CONTENT_DIR, `${club.id}.md`);
      fs.writeFileSync(filePath, markdown, 'utf-8');
      count++;

      const category = CATEGORY_MAP[club.category] || 'Others';
      console.log(`✅ ${club.id}.md (${club.nameJa}) → ${category}`);
    } catch (error) {
      errorCount++;
      console.error(`❌ ${club.id}: ${error}`);
    }
  });

  console.log(`\n🎉 完了!`);
  console.log(`   生成: ${count}件`);
  console.log(`   エラー: ${errorCount}件`);
  console.log(`   出力先: ${CONTENT_DIR}`);
}

main();
