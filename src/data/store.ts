import type { Article } from '../types';
import { articles as defaultArticles } from './articles';

const STORAGE_KEY = 'blog_articles';

// 从 localStorage 加载文章，若没有则使用默认文章
export function loadArticles(): Article[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      return JSON.parse(raw) as Article[];
    }
  } catch {
    // ignore
  }
  // 首次使用，把示例文章写入 localStorage
  saveArticles(defaultArticles);
  return defaultArticles;
}

export function saveArticles(articles: Article[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(articles));
}

export function createArticle(article: Omit<Article, 'id'>): Article {
  const articles = loadArticles();
  const newArticle: Article = {
    ...article,
    id: Date.now().toString(),
  };
  saveArticles([newArticle, ...articles]);
  return newArticle;
}

export function updateArticle(id: string, updates: Partial<Article>): Article | null {
  const articles = loadArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;
  articles[index] = { ...articles[index], ...updates };
  saveArticles(articles);
  return articles[index];
}

export function deleteArticle(id: string): boolean {
  const articles = loadArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  saveArticles(filtered);
  return true;
}

export function getArticleBySlugFromStore(slug: string): Article | undefined {
  return loadArticles().find((a) => a.slug === slug);
}

// 生成 slug（由标题生成，加时间戳保证唯一）
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .slice(0, 50);
  return `${base}-${Date.now()}`;
}

// 估算阅读时间（按中文 400 字/分钟）
export function estimateReadingTime(content: string): number {
  return Math.max(1, Math.round(content.length / 400));
}
