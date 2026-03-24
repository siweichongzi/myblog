export interface Article {
  id: string;
  slug: string;
  title: string;
  summary: string;
  content: string;
  coverImage?: string;
  tags: string[];
  publishedAt: string;
  readingTime: number;
}

export interface Tag {
  name: string;
  slug: string;
  count: number;
}
