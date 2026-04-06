import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const CONTENT_DIR = path.join(process.cwd(), 'src/content/clubs');
const FULL_GRADE_LIST = ['1年生', '2年生', '3年生', '4年生', '院生'];

function main() {
  if (!fs.existsSync(CONTENT_DIR)) {
    console.error('❌ content directory not found:', CONTENT_DIR);
    process.exit(1);
  }

  const files = fs.readdirSync(CONTENT_DIR).filter((file) => file.endsWith('.md'));

  let updated = 0;
  for (const file of files) {
    const filePath = path.join(CONTENT_DIR, file);
    const raw = fs.readFileSync(filePath, 'utf-8');
    const parsed = matter(raw);
    const data = parsed.data as Record<string, any>;

    const recruitment = data.recruitment as Record<string, any> | undefined;
    if (!recruitment || typeof recruitment !== 'object') {
      continue;
    }

    const targetAudience = typeof recruitment.targetAudience === 'string'
      ? recruitment.targetAudience
      : '';

    if (!targetAudience.includes('全学年')) {
      continue;
    }

    const currentGrades = Array.isArray(recruitment.targetGrades)
      ? recruitment.targetGrades
      : [];

    const isAlreadyNormalized =
      currentGrades.length === FULL_GRADE_LIST.length &&
      FULL_GRADE_LIST.every((grade, idx) => currentGrades[idx] === grade);

    if (isAlreadyNormalized) {
      continue;
    }

    recruitment.targetGrades = [...FULL_GRADE_LIST];
    data.recruitment = recruitment;

    const next = matter.stringify(parsed.content, data, { lineWidth: -1 } as any);
    fs.writeFileSync(filePath, next, 'utf-8');
    updated++;
    console.log(`✅ normalized: ${file}`);
  }

  console.log(`🎉 done. updated ${updated} files.`);
}

main();
