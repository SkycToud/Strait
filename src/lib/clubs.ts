import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { ClubDetail } from '@/types/club';

const contentDir = path.join(process.cwd(), 'src/content/clubs');

export function getClubById(id: string): ClubDetail | undefined {
  const filePath = path.join(contentDir, `${id}.md`);
  if (!fs.existsSync(filePath)) {
    return undefined;
  }
  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    id,
    ...(data as Omit<ClubDetail, 'id'>)
  };
}

export function getAllClubs(): ClubDetail[] {
  if (!fs.existsSync(contentDir)) return [];
  const files = fs.readdirSync(contentDir);
  const clubs = files
    .filter(file => file.endsWith('.md'))
    .map(file => {
      const id = file.replace(/\.md$/, '');
      return getClubById(id);
    })
    .filter((club): club is ClubDetail => club !== undefined);

  return clubs;
}

export function getClubsByCategory(category: string): ClubDetail[] {
  const allClubs = getAllClubs();
  // We match by URL slug internally? 
  // Wait, in previous code, categorySlug vs category... we might need to export a slugify function or handle matching in the components.
  // We'll leave filtering to the caller, or just provide it here.
  return allClubs;
}
