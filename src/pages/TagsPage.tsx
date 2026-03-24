import { useState, useEffect } from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { TagBadge } from '../components/blog';
import { ArticleCard } from '../components/blog';
import { tags } from '../data/tags';
import { loadArticles } from '../data/store';
import type { Article } from '../types';

export function TagsPage() {
  return (
    <div className="py-12 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-serif font-bold text-gray-900 mb-4">
            标签云
          </h1>
          <p className="text-gray-600">
            共 {tags.length} 个标签，点击标签查看相关文章
          </p>
        </div>

        {/* Tag Cloud */}
        <div className="flex flex-wrap justify-center gap-4 mb-16">
          {tags.map((tag) => (
            <div
              key={tag.slug}
              className="transform hover:scale-105 transition-transform"
              style={{
                transform: `scale(${1 + tag.count * 0.05})`,
              }}
            >
              <TagBadge name={tag.name} slug={tag.slug} count={tag.count} size="lg" />
            </div>
          ))}
        </div>

        {/* Tag List */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {tags.map((tag) => (
            <a
              key={tag.slug}
              href={`/tags/${tag.slug}`}
              className="flex items-center justify-between p-4 bg-surface border border-border rounded-lg hover:border-primary hover:shadow-md transition-all"
            >
              <div>
                <span className="font-medium text-gray-900">{tag.name}</span>
                <span className="text-sm text-gray-500 ml-2">{tag.count} 篇文章</span>
              </div>
              <div className="flex -space-x-1">
                {Array.from({ length: Math.min(tag.count, 3) }).map((_, i) => (
                  <div
                    key={i}
                    className="w-6 h-6 rounded-full bg-primary/20 border-2 border-white"
                  />
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}

export function TagDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  if (!slug) {
    return <Navigate to="/tags" replace />;
  }

  const tag = tags.find((t) => t.slug.toLowerCase() === slug.toLowerCase());

  useEffect(() => {
    loadArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, [slug]);

  const tagArticles = articles.filter((article) =>
    article.tags.some((t) => t.toLowerCase() === slug.toLowerCase())
  );

  if (!tag && !loading) {
    return <Navigate to="/tags" replace />;
  }

  return (
    <div className="py-12 fade-in">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center mb-12">
          <TagBadge name={tag?.name || slug} size="lg" active />
          <p className="text-gray-600 mt-4">
            共 {tagArticles.length} 篇相关文章
          </p>
        </div>

        {/* Articles Grid */}
        {loading ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-surface rounded-xl border border-border overflow-hidden">
                <div className="h-40 bg-gray-200 animate-pulse" />
                <div className="p-5 space-y-3">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
              </div>
            ))}
          </div>
        ) : tagArticles.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tagArticles.map((article) => (
              <ArticleCard key={article.id} article={article} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-500">该标签下暂无文章</p>
          </div>
        )}
      </div>
    </div>
  );
}
