import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// CSV Path
const CSV_PATH = 'c:\\Users\\fujit\\Downloads\\サークル情報掲載用アンケート（回答） - シート5.csv';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');

// Fallback mapping is no longer primary, as we use cols[0] as ID
const NAME_TO_MD: Record<string, string> = {
  // Existing files for safety
  '学生NGO ALPHA': 'alpha',
  'ポンダンスサークルAmity': 'amity',
  '美術部': 'art',
  'GMC': 'gmc',
  'フロアボールクラブ': 'floorball',
  '東京外国語大学お笑いサークルXBULL': 'xbull',
  '表千家茶道部': 'omotesenke',
  'Mres': 'mres',
  '朝鮮舞踊部': 'koreandance',
  '地域活性化サークルいもに会': 'imoni',
  '東京外大アルゼンチンタンゴサークル': 'argentinetango',
  'タップダンスサークルTUPS': 'tups',
  'たふえね': 'tafuene',
  'TUFPOST': 'tufpost',
  'フィリピン民族舞踊団': 'philippinefolkdanceclub',
  '東京外国語大学KpopカバーダンスサークルSouls': 'souls',
};

const GENRE_TO_CATEGORY: Record<string, string> = {
  '球技': 'Ball Sports',
  '武道・武術': 'Martial Arts',
  '武道': 'Martial Arts',
  '美術・音楽': 'Music & Arts',
  '芸術・音楽': 'Music & Arts',
  '舞踊・ダンス': 'Dance & Performance',
  'その他スポーツ': 'Other Sports',
  'ボランティア': 'Volunteer',
  '語学・国際交流': 'Language & International',
  '社会課題': 'Social Issues',
  '企画': 'Planning',
  '学術': 'Academic',
  '演劇': 'Theater',
  '娯楽': 'Others',
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

function resolveCategory(genresField: string): string[] {
  if (!genresField) return ['Others'];
  const genres = genresField.split(',').map(g => g.trim()).filter(Boolean);
  const categories = genres.map(genre => GENRE_TO_CATEGORY[genre] || 'Others');
  // Return unique categories
  return Array.from(new Set(categories));
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
    const id             = cols[0]?.trim();
    const clubName       = cols[1]?.trim();
    if (!id || !clubName) return;

    // Use ID as basename, fallback to name mapping if ID is missing (shouldn't happen with our check)
    const mdBasename = id || NAME_TO_MD[clubName];
    if (!mdBasename) {
      console.warn(`⚠️ No mapping or ID for: "${clubName}"`);
      return;
    }

    // Indices based on the 31-column CSV
    // 0:id, 1:nameJa, 2:thumbnail (EXCLUDED), 3:description, 4:philosophy, 5:activities, 
    // 6:executiveMembers, 7:organization, 8:memberCount, 9-13:yearDistribution (1,2,3,4,M)
    // 14:isIntra, 15:frequency, 16:location, 17:appeal, 18:challenges, 19:annualPlan
    // 20:welcomeEvents, 21:applicationDeadline, 22:annualFee, 23:hasSelection
    // 24:targetAudience, 25:website, 26:instagram, 27:xUrl, 28:facebook, 29:line, 30:category

    const description    = cols[3]?.trim();
    const philosophy     = cols[4]?.trim();
    const activities     = cols[5]?.trim();
    const executiveGen   = cols[6]?.trim();
    const organization   = cols[7]?.trim();
    const memberCount    = parseInt(cols[8]) || 0;
    const year1          = parseInt(cols[9]) || 0;
    const year2          = parseInt(cols[10]) || 0;
    const year3          = parseInt(cols[11]) || 0;
    const year4          = parseInt(cols[12]) || 0;
    const yearM          = parseInt(cols[13]) || 0;
    const isIntra        = cols[14]?.trim();
    const frequency      = cols[15]?.trim();
    const location       = cols[16]?.trim();
    const appeal         = cols[17]?.trim();
    const challenges     = cols[18]?.trim();
    const annualPlan     = cols[19]?.trim();
    const welcomeEvents  = cols[20]?.trim();
    const deadline       = cols[21]?.trim();
    const annualFee      = cols[22]?.trim();
    const hasSelection   = cols[23]?.trim();
    const targetAudience = cols[24]?.trim();
    const website        = cols[25]?.trim();
    const instagramRaw   = cols[26]?.trim();
    const xRaw           = cols[27]?.trim();
    const facebook       = cols[28]?.trim();
    const line           = cols[29]?.trim();
    const genres         = cols[30]?.trim();

    const categories = resolveCategory(genres);

    const yearDist: string[] = [];
    if (year1 > 0) yearDist.push(`1年生: ${year1}人`);
    if (year2 > 0) yearDist.push(`2年生: ${year2}人`);
    if (year3 > 0) yearDist.push(`3年生: ${year3}人`);
    if (year4 > 0) yearDist.push(`4年生: ${year4}人`);
    if (yearM > 0) yearDist.push(`院生: ${yearM}人`);

    const planArray = annualPlan ? annualPlan.split('\n').map((l: string) => l.trim()).filter(Boolean) : [];
    const targetGrades = parseTargetGrades(targetAudience);

    const mdPath = path.join(CONTENT_DIR, `${mdBasename}.md`);
    let fileContent = '';
    let parsedData: any = { data: {}, content: '' };

    if (fs.existsSync(mdPath)) {
      fileContent = fs.readFileSync(mdPath, 'utf-8');
      parsedData = matter(fileContent);
    } else {
      parsedData.data = { 
        nameJa: clubName,
        nameEn: mdBasename.charAt(0).toUpperCase() + mdBasename.slice(1), // Placeholder
        thumbnail: ''
      };
      addedCount++;
    }

    const data = parsedData.data;

    // Apply basic info
    data.nameJa = clubName;
    data.category = categories;
    if (description) data.description = description;

    // Note: data.thumbnail is NOT updated as per user request.

    // Overview
    data.overview = data.overview || {};
    if (philosophy) data.overview.philosophy = philosophy;
    if (activities) data.overview.activities = activities;
    data.overview.guidelines = data.overview.guidelines || "準備中";

    // Operations
    data.operations = data.operations || {};
    if (executiveGen) {
      data.operations.executiveMembers = executiveGen.split(/[、,]/).map(s => s.trim()).filter(Boolean);
    }
    if (organization) data.operations.organization = organization;

    // Membership
    data.membership = data.membership || {};
    data.membership.memberCount = memberCount;
    if (yearDist.length) data.membership.yearDistribution = yearDist;
    data.membership.isIntraUniversity = isIntra?.includes('不可') || false; // CSV says "不可（本学学生のみ）" for true

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
    if (deadline) data.recruitment.applicationDeadline = deadline;
    if (annualFee) data.recruitment.annualFee = annualFee;
    data.recruitment.hasSelection = !(hasSelection?.includes('なし') ?? true);
    if (targetAudience) data.recruitment.targetAudience = targetAudience;
    if (targetGrades.length) data.recruitment.targetGrades = targetGrades;
    
    data.recruitment.contact = data.recruitment.contact || {};
    if (website) data.recruitment.contact.website = website;
    if (facebook) data.recruitment.contact.facebook = facebook;
    if (line) data.recruitment.contact.line = line;
    
    const inst = normalizeInstagram(instagramRaw);
    if (inst) data.recruitment.contact.instagram = inst;
    
    const x = normalizeX(xRaw);
    if (x) data.recruitment.contact.xUrl = x;

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
