import type { Tag } from '../types';

export const tags: Tag[] = [
  { name: '技术', slug: '技术', count: 3 },
  { name: 'React', slug: 'react', count: 1 },
  { name: '前端', slug: '前端', count: 2 },
  { name: '设计', slug: '设计', count: 2 },
  { name: '读书', slug: '读书', count: 1 },
  { name: '生活', slug: '生活', count: 2 },
  { name: '随笔', slug: '随笔', count: 2 },
  { name: '教程', slug: '教程', count: 2 },
];

export const getTagBySlug = (slug: string): Tag | undefined => {
  return tags.find(tag => tag.slug.toLowerCase() === slug.toLowerCase());
};
