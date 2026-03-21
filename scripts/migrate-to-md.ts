import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

// Migration script to convert clubs.json to individual markdown files

const DATA_PATH = path.join(process.cwd(), 'src/data/clubs.json');
const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');

// Ensure directory exists
if (!fs.existsSync(CONTENT_DIR)) {
  fs.mkdirSync(CONTENT_DIR, { recursive: true });
}

// Read JSON
const clubsData = JSON.parse(fs.readFileSync(DATA_PATH, 'utf-8'));

clubsData.forEach((club: any) => {
  const { id, ...rest } = club;
  
  // We'll keep all structured data in frontmatter
  // For long text fields that might need line breaks, we use string formats
  // that map nicely to YAML.
  
  const content = `
<!-- 
  Markdown Body: 今後必要であればここに自由記述を増やせます。
  現状の各項目（理念や活動内容など）は上の "overview" などの設定項目で管理しています。
-->
`.trim();

  // Create frontmatter object
  const fileContent = matter.stringify(content, rest);

  const filePath = path.join(CONTENT_DIR, `${id}.md`);
  fs.writeFileSync(filePath, fileContent, 'utf-8');
  console.log(`Created ${filePath}`);
});

console.log('Migration complete. Please check src/content/clubs/');
