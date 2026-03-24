import type { Article } from '../types';

// ==================== 配置 ====================
// GitHub 数据仓库配置（存储在 localStorage 中）
const GITHUB_CONFIG_KEY = 'blog_github_config';

export interface GitHubConfig {
  owner: string;       // GitHub 用户名，如 "siweichongzi"
  repo: string;        // 仓库名，如 "myblog-data"
  branch: string;      // 分支名，如 "main"
  token: string;       // Personal Access Token
}

export interface StoreState {
  articles: Article[];
  loaded: boolean;
  config: GitHubConfig | null;
  error: string | null;
}

// 内存缓存（避免频繁请求）
let articlesCache: Article[] | null = null;
let configCache: GitHubConfig | null = null;

// ==================== GitHub API ====================

function getGitHubHeaders(token: string) {
  return {
    'Authorization': `token ${token}`,
    'Accept': 'application/vnd.github.v3+json',
    'Content-Type': 'application/json',
  };
}

// 获取 GitHub 文件 SHA（用于更新）
async function getFileSha(owner: string, repo: string, path: string, branch: string, token: string): Promise<string | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  try {
    const res = await fetch(url, { headers: getGitHubHeaders(token) });
    if (res.ok) {
      const data = await res.json();
      return data.sha || null;
    }
  } catch { /* ignore */ }
  return null;
}

// 读取 GitHub 文件内容
async function readGitHubFile<T>(owner: string, repo: string, path: string, branch: string, token: string): Promise<T | null> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`;
  try {
    const res = await fetch(url, { headers: getGitHubHeaders(token) });
    if (res.ok) {
      const data = await res.json();
      if (data.content) {
        const content = atob(data.content.replace(/\n/g, ''));
        return JSON.parse(content) as T;
      }
    }
  } catch { /* ignore */ }
  return null;
}

// 写入 GitHub 文件
async function writeGitHubFile(
  owner: string, repo: string, path: string, branch: string,
  content: string, message: string, token: string
): Promise<boolean> {
  const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}`;
  const sha = await getFileSha(owner, repo, path, branch, token);
  
  const body: Record<string, string> = {
    message,
    content: btoa(unescape(encodeURIComponent(content))),
    branch,
  };
  if (sha) body.sha = sha;

  try {
    const res = await fetch(url, {
      method: 'PUT',
      headers: getGitHubHeaders(token),
      body: JSON.stringify(body),
    });
    return res.ok;
  } catch {
    return false;
  }
}

// ==================== 配置管理 ====================

export function loadGitHubConfig(): GitHubConfig | null {
  if (configCache) return configCache;
  try {
    const raw = localStorage.getItem(GITHUB_CONFIG_KEY);
    if (raw) {
      configCache = JSON.parse(raw) as GitHubConfig;
      return configCache;
    }
  } catch { /* ignore */ }
  return null;
}

export function saveGitHubConfig(config: GitHubConfig): void {
  configCache = config;
  localStorage.setItem(GITHUB_CONFIG_KEY, JSON.stringify(config));
}

export function clearGitHubConfig(): void {
  configCache = null;
  localStorage.removeItem(GITHUB_CONFIG_KEY);
}

// 检查是否已配置 GitHub
export function isGitHubConfigured(): boolean {
  const config = loadGitHubConfig();
  return !!(config && config.owner && config.repo && config.token);
}

// ==================== 文章读写（核心逻辑） ====================

const ARTICLES_PATH = 'articles.json';

export async function loadArticles(): Promise<Article[]> {
  // 优先返回缓存
  if (articlesCache) return articlesCache;

  const config = loadGitHubConfig();

  if (config) {
    try {
      // 从 GitHub API 读取（带 token，可以访问私有仓库）
      const articles = await readGitHubFile<Article[]>(
        config.owner, config.repo, ARTICLES_PATH, config.branch, config.token
      );
      if (articles && Array.isArray(articles)) {
        articlesCache = articles;
        return articles;
      }
    } catch (e) {
      console.error('从 GitHub 加载文章失败:', e);
    }
  }

  // 如果没有配置或加载失败，返回空数组
  articlesCache = [];
  return [];
}

// 保存所有文章到 GitHub
async function saveAllArticles(articles: Article[]): Promise<boolean> {
  const config = loadGitHubConfig();
  if (!config) {
    console.error('未配置 GitHub，无法保存文章');
    return false;
  }

  const success = await writeGitHubFile(
    config.owner, config.repo, ARTICLES_PATH, config.branch,
    JSON.stringify(articles, null, 2),
    `更新文章：共 ${articles.length} 篇`,
    config.token
  );

  if (success) {
    articlesCache = articles;
  }
  return success;
}

// 乐观更新：先更新本地缓存，再保存到 GitHub
export async function createArticle(article: Omit<Article, 'id'>): Promise<Article | null> {
  const articles = await loadArticles();
  const newArticle: Article = {
    ...article,
    id: `local-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
  };
  const updated = [newArticle, ...articles];
  articlesCache = updated;
  
  const ok = await saveAllArticles(updated);
  return ok ? newArticle : null;
}

export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  let articles = await loadArticles();
  const index = articles.findIndex((a) => a.id === id);
  if (index === -1) return null;
  
  articles[index] = { ...articles[index], ...updates };
  articlesCache = articles;
  
  const ok = await saveAllArticles(articles);
  return ok ? articles[index] : null;
}

export async function deleteArticle(id: string): Promise<boolean> {
  const articles = await loadArticles();
  const filtered = articles.filter((a) => a.id !== id);
  if (filtered.length === articles.length) return false;
  
  articlesCache = filtered;
  return await saveAllArticles(filtered);
}

export function getArticleBySlugFromStore(slug: string): Article | undefined {
  if (!articlesCache) return undefined;
  return articlesCache.find((a) => a.slug === slug);
}

// 生成 slug
export function generateSlug(title: string): string {
  const base = title
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '')
    .slice(0, 50);
  return `${base}-${Date.now()}`;
}

// 估算阅读时间
export function estimateReadingTime(content: string): number {
  return Math.max(1, Math.round(content.length / 400));
}

// 手动刷新文章缓存
export async function refreshArticles(): Promise<Article[]> {
  articlesCache = null;
  return await loadArticles();
}
