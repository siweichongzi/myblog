import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';
import { ArticleCard } from '../components/blog';
import { TagBadge } from '../components/blog';
import { loadArticles } from '../data/store';
import { tags } from '../data/tags';

export function HomePage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadArticles().then((data) => {
      setArticles(data);
      setLoading(false);
    });
  }, []);

  const featuredArticles = articles.slice(0, 3);
  const popularTags = tags.slice(0, 6);

  return (
    <div className="fade-in">
      {/* Hero Section */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex flex-col md:flex-row items-center gap-12">
            {/* Text Content */}
            <div className="flex-1 text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
                <Sparkles size={14} />
                欢迎来到我的博客
              </div>
              <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 mb-6 leading-tight">
                探索技术的深度
                <br />
                <span className="text-primary">记录生活的美好</span>
              </h1>
              <p className="text-lg text-gray-600 mb-8 max-w-lg mx-auto md:mx-0">
                在这里分享前端技术、读书心得、生活感悟。愿每一篇文章都能带给你一些思考和启发。
              </p>
              <div className="flex flex-wrap gap-4 justify-center md:justify-start">
                <Link
                  to="/articles"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
                >
                  浏览文章
                  <ArrowRight size={18} />
                </Link>
                <Link
                  to="/about"
                  className="inline-flex items-center gap-2 px-6 py-3 border border-border text-gray-700 rounded-lg font-medium hover:border-primary hover:text-primary transition-colors"
                >
                  关于我
                </Link>
              </div>
            </div>

            {/* Avatar */}
            <div className="relative">
              <div className="w-48 h-48 md:w-56 md:h-56 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80"
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="absolute -bottom-4 -right-4 w-24 h-24 bg-accent/20 rounded-full blur-2xl" />
              <div className="absolute -top-4 -left-4 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Articles */}
      <section className="py-12 bg-surface border-y border-border">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-serif font-semibold text-gray-900">最新文章</h2>
            <Link
              to="/articles"
              className="text-sm text-primary hover:text-primary-light font-medium flex items-center gap-1"
            >
              查看全部
              <ArrowRight size={16} />
            </Link>
          </div>

          {loading ? (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="bg-white rounded-xl border border-border overflow-hidden">
                  <div className="h-40 bg-gray-200 animate-pulse" />
                  <div className="p-5 space-y-3">
                    <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-full" />
                    <div className="h-3 bg-gray-100 rounded animate-pulse w-1/2" />
                  </div>
                </div>
              ))}
            </div>
          ) : featuredArticles.length === 0 ? (
            <div className="text-center py-10 text-gray-400">
              <p>暂无文章，<Link to="/admin/editor" className="text-primary underline">去写一篇</Link></p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredArticles.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Tags Section */}
      <section className="py-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <h2 className="text-2xl font-serif font-semibold text-gray-900 mb-8">热门标签</h2>
          <div className="flex flex-wrap gap-3">
            {popularTags.map((tag) => (
              <TagBadge
                key={tag.slug}
                name={tag.name}
                slug={tag.slug}
                count={tag.count}
                size="md"
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
