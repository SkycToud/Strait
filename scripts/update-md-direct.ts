import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// CSV Path
const CSV_PATH = path.resolve(
  process.cwd(),
  '..',
  'Downloads',
  'サークル情報掲載用アンケート1.csv'
);

const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');

// Mapping CSV Name to MD File Basename
const NAME_TO_MD: Record<string, string> = {
  '東京外国語大学KpopカバーダンスサークルSouls': 'souls',
  'ポンダンスサークルAmity': 'amity',
  '美術部': 'art', // assuming art.md but it's not in ls-files... let me use what's there
  'GMC': 'gmc',
  'フロアボールクラブ': 'floorball',
  '東京外国語大学お笑いサークルXBULL': 'xbull',
  '表千家茶道部': 'omotesenke',
  'Mres': 'mres',
  '学生NGO ALPHA': 'alpha',
  '朝鮮舞踊部': 'koreandance',
  '地域活性化サークルいもに会': 'imoni',
  '東京外大アルゼンチンタンゴサークル': 'argentinetango',
  'タップダンスサークルTUPS': 'tups',
  'たふえね': 'tafuene',
  'TUFPOST': 'tufpost',
  'フィリピン民族舞踊団': 'philippinefolkdanceclub',
};

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

// CSV Parser
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

function normalizeInstagram(raw: string): string {
  if (!raw) return '';
  raw = raw.trim();
  if (raw.startsWith('http')) return raw;
  const handle = raw.replace(/^@/, '');
  return `https://www.instagram.com/${handle}/`;
}

function normalizeX(raw: string): string {
  if (!raw) return '';
  raw = raw.trim();
  if (raw.startsWith('http')) return raw;
  const handle = raw.replace(/^@/, '');
  return `https://x.com/${handle}`;
}

function parseTargetGrades(text: string): string[] {
  if (!text) return [];
  if (text.includes('全学年')) {
    return ['1年生', '2年生', '3年生', '4年生', '院生'];
  }
  const grades: string[] = [];
  if (text.includes('1') || text.includes('１')) grades.push('1年生');
  if (text.includes('2') || text.includes('２')) grades.push('2年生');
  if (text.includes('3') || text.includes('３')) grades.push('3年生');
  if (text.includes('4') || text.includes('４')) grades.push('4年生');
  return grades.length > 0 ? grades : ['1年生', '2年生', '3年生', '4年生'];
}

function resolveCategory(genresField: string): string {
  if (!genresField) return 'Hobbies';
  const genres = genresField.split(',').map(g => g.trim()).filter(Boolean);
  for (const genre of genres) {
    if (GENRE_TO_CATEGORY[genre]) return GENRE_TO_CATEGORY[genre];
  }
  return 'Hobbies';
}

function main() {
  console.log('🚀 Updating src/content/clubs directly from CSV...');

  if (!fs.existsSync(CSV_PATH)) {
    console.error('❌ CSV file not found:', CSV_PATH);
    process.exit(1);
  }

  const csvText = fs.readFileSync(CSV_PATH, 'utf-8');
  const rows = parseCSV(csvText);
  const dataRows = rows.slice(1);

  let updatedCount = 0;
  let addedCount = 0;

  if (!fs.existsSync(CONTENT_DIR)) {
    fs.mkdirSync(CONTENT_DIR, { recursive: true });
  }

  dataRows.forEach((cols) => {
    const clubName       = cols[1]?.trim();
    if (!clubName) return;

    const mdBasename = NAME_TO_MD[clubName];
    if (!mdBasename) {
      console.warn(`⚠️ No mapping for: "${clubName}"`);
      return;
    }

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

    const category = resolveCategory(genres);

    const yearDist: string[] = [];
    if (year1 > 0) yearDist.push(`1年生: ${year1}人`);
    if (year2 > 0) yearDist.push(`2年生: ${year2}人`);
    if (year3 > 0) yearDist.push(`3年生: ${year3}人`);
    if (year4 > 0) yearDist.push(`4年生: ${year4}人`);

    const planArray = annualPlan ? annualPlan.split('\n').map((l: string) => l.trim()).filter(Boolean) : [];
    
    const targetGrades = parseTargetGrades(targetAudience);

    const mdPath = path.join(CONTENT_DIR, `${mdBasename}.md`);
    let fileContent = '';
    let parsedData: any = { data: {}, content: '' };

    if (fs.existsSync(mdPath)) {
      fileContent = fs.readFileSync(mdPath, 'utf-8');
      parsedData = matter(fileContent);
    } else {
      parsedData.data = { nameJa: clubName };
      addedCount++;
    }

    const data = parsedData.data;

    // Apply basic info
    data.category = category;
    if (description) data.description = description;

    // Apply links
    const inst = normalizeInstagram(instagramRaw);
    if (inst) data.instagram = inst;
    
    const x = normalizeX(xRaw);
    if (x) data.xUrl = x;

    // Overview
    data.overview = data.overview || {};
    if (philosophy) data.overview.philosophy = philosophy;
    if (activities) data.overview.activities = activities;

    // Operations
    data.operations = data.operations || {};
    if (executiveGen) data.operations.executiveMembers = [executiveGen];
    if (organization) data.operations.organization = organization;

    // Membership
    data.membership = data.membership || {};
    data.membership.memberCount = memberCount;
    if (yearDist.length) data.membership.yearDistribution = yearDist;
    data.membership.isIntraUniversity = isIntra?.includes('可能') || false;

    // Schedule
    data.schedule = data.schedule || {};
    if (frequency) data.schedule.frequency = frequency;
    if (location) data.schedule.location = location;
    if (planArray.length) data.schedule.annualPlan = planArray;

    // Recruitment
    data.recruitment = data.recruitment || {};
    if (appeal) data.recruitment.appeal = appeal;
    if (challenges) data.recruitment.challenges = challenges;
    if (welcomeEvents) {
      data.recruitment.welcomeEvents = welcomeEvents;
      data.recruitment.applicationFlow = welcomeEvents;
    }
    if (annualFee) data.recruitment.annualFee = annualFee;
    data.recruitment.hasSelection = !(hasSelection?.includes('なし') ?? true);
    if (targetAudience) data.recruitment.targetAudience = targetAudience;
    if (targetGrades.length) data.recruitment.targetGrades = targetGrades;
    
    data.recruitment.contact = data.recruitment.contact || {};
    if (website) data.recruitment.contact.website = website;
    if (facebook) data.recruitment.contact.facebook = facebook;
    if (line) data.recruitment.contact.line = line;

    data.lastUpdated = new Date().toISOString().split('T')[0];

    // Write back
    const newContent = matter.stringify(parsedData.content, data, { lineWidth: -1 } as any);
    fs.writeFileSync(mdPath, newContent, 'utf-8');
    
    updatedCount++;
    console.log(`✅ Processed: ${mdBasename}.md`);
  });

  console.log(`\n🎉 Done! Updated: ${updatedCount}, Created: ${addedCount}`);
}

main();
