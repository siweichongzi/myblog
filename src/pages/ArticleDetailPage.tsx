import { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { Calendar, Clock, ArrowLeft, Share2 } from 'lucide-react';
import { MarkdownRenderer, TableOfContents, TagBadge } from '../components/blog';
import { loadArticles } from '../data/store';
import type { Article } from '../types';

export function ArticleDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles().then((data) => {
      setArticles(data);
      const found = data.find((a) => a.slug === slug);
      setArticle(found || null);
      setLoading(false);
    });
  }, [slug]);

  if (loading) {
    return (
      <div className="py-12 fade-in">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-24" />
            <div className="h-10 bg-gray-200 rounded w-3/4" />
            <div className="h-4 bg-gray-200 rounded w-48" />
            <div className="h-64 bg-gray-200 rounded-xl" />
          </div>
        </div>
      </div>
    );
  }

  if (!article) {
    return <Navigate to="/" replace />;
  }

  const currentIndex = articles.findIndex((a) => a.slug === slug);
  const prevArticle = currentIndex < articles.length - 1 ? articles[currentIndex + 1] : null;
  const nextArticle = currentIndex > 0 ? articles[currentIndex - 1] : null;

  return (
    <div className="py-12 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="lg:grid lg:grid-cols-[1fr_280px] lg:gap-12">
          {/* Main Content */}
          <article>
            {/* Back Button */}
            <Link
              to="/articles"
              className="inline-flex items-center gap-2 text-gray-600 hover:text-primary mb-8 transition-colors"
            >
              <ArrowLeft size={18} />
              返回文章列表
            </Link>

            {/* Article Header */}
            <header className="mb-8">
              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-4">
                {article.tags.map((tag) => (
                  <TagBadge key={tag} name={tag} size="sm" />
                ))}
              </div>

              {/* Title */}
              <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4 leading-tight">
                {article.title}
              </h1>

              {/* Meta */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                <span className="flex items-center gap-1.5">
                  <Calendar size={16} />
                  {article.publishedAt}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock size={16} />
                  {article.readingTime} 分钟阅读
                </span>
                <button className="flex items-center gap-1.5 hover:text-primary transition-colors ml-auto">
                  <Share2 size={16} />
                  分享
                </button>
              </div>
            </header>

            {/* Cover Image */}
            {article.coverImage && (
              <div className="aspect-[16/9] rounded-xl overflow-hidden mb-8">
                <img
                  src={article.coverImage}
                  alt={article.title}
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Summary */}
            <div className="p-4 bg-primary/5 border-l-4 border-primary rounded-r-lg mb-8">
              <p className="text-gray-700 italic">{article.summary}</p>
            </div>

            {/* Article Content */}
            <MarkdownRenderer content={article.content} />

            {/* Navigation */}
            <nav className="mt-12 pt-8 border-t border-border">
              <div className="flex flex-col sm:flex-row gap-4">
                {prevArticle ? (
                  <Link
                    to={`/post/${prevArticle.slug}`}
                    className="flex-1 p-4 bg-surface border border-border rounded-lg hover:border-primary transition-colors group"
                  >
                    <span className="text-xs text-gray-500 mb-1 block">上一篇</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
                      {prevArticle.title}
                    </span>
                  </Link>
                ) : (
                  <div className="flex-1" />
                )}
                {nextArticle && (
                  <Link
                    to={`/post/${nextArticle.slug}`}
                    className="flex-1 p-4 bg-surface border border-border rounded-lg hover:border-primary transition-colors group text-right"
                  >
                    <span className="text-xs text-gray-500 mb-1 block">下一篇</span>
                    <span className="text-sm font-medium text-gray-700 group-hover:text-primary transition-colors line-clamp-1">
                      {nextArticle.title}
                    </span>
                  </Link>
                )}
              </div>
            </nav>
          </article>

          {/* Sidebar - Table of Contents */}
          <aside className="hidden lg:block">
            <TableOfContents />
          </aside>
        </div>
      </div>
    </div>
  );
}
