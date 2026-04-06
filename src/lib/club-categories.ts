import { slugify } from '@/lib/utils';

const CATEGORY_SLUG_ALIASES: Record<string, string> = {
  'arts-and-music': 'music-and-arts',
  'language-and-international-exchange': 'language-and-international',
};

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
