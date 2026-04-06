import { slugify } from '@/lib/utils';

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  'arts-and-music': 'music-and-arts',
  'language-and-international-exchange': 'language-and-international',
};

const CATEGORY_LABEL_JA_BY_SLUG: Record<string, string> = {
  'ball-sports': '球技',
  'martial-arts': '武道・武術',
  'music-and-arts': '芸術・音楽',
  'dance-and-performance': '舞踊・ダンス',
  'other-sports': 'その他スポーツ',
  'volunteer': 'ボランティア',
  'language-and-international': '語学・国際交流',
  'social-issues': '社会課題',
  'planning': '企画',
  'others': 'その他',
};

const KNOWN_CATEGORY_LABELS_JA = new Set(Object.values(CATEGORY_LABEL_JA_BY_SLUG));

export const KNOWN_CATEGORY_SLUGS = [
  'ball-sports',
  'martial-arts',
  'music-and-arts',
  'dance-and-performance',
  'other-sports',
  'volunteer',
  'language-and-international',
  'social-issues',
  'planning',
  'others',
] as const;

export function normalizeCategorySlug(slug: string) {
  return CATEGORY_SLUG_ALIASES[slug] ?? slug;
}

export function toCategorySlug(category: string) {
  return normalizeCategorySlug(slugify(category));
}

export function isKnownCategorySlug(slug: string) {
  return (KNOWN_CATEGORY_SLUGS as readonly string[]).includes(slug);
}

export function toCategoryLabelJa(category: string) {
  const normalizedCategory = category.trim();
  if (!normalizedCategory) return category;
  if (KNOWN_CATEGORY_LABELS_JA.has(normalizedCategory)) return normalizedCategory;

  const slug = toCategorySlug(normalizedCategory);
  return CATEGORY_LABEL_JA_BY_SLUG[slug] ?? normalizedCategory;
}
