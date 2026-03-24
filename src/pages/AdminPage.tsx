import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Edit2, Trash2, Eye, Calendar, Clock, Search } from 'lucide-react';
import type { Article } from '../types';
import { loadArticles, deleteArticle } from '../data/store';

export function AdminPage() {
  const navigate = useNavigate();
  const [articles, setArticles] = useState<Article[]>([]);
  const [search, setSearch] = useState('');
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const refresh = () => setArticles(loadArticles());

  useEffect(() => {
    refresh();
  }, []);

  const filtered = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()))
  );

  const handleDelete = (id: string) => {
    deleteArticle(id);
    setDeleteId(null);
    refresh();
  };

  return (
    <div className="py-10 fade-in">
      <div className="max-w-5xl mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-serif font-bold text-gray-900">文章管理</h1>
            <p className="text-sm text-gray-500 mt-1">共 {articles.length} 篇文章</p>
          </div>
          <button
            onClick={() => navigate('/admin/editor')}
            className="flex items-center gap-2 px-5 py-2.5 bg-primary text-white rounded-lg font-medium hover:bg-primary-dark transition-colors"
          >
            <Plus size={18} />
            写文章
          </button>
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="搜索文章..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-surface border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* Article List */}
        <div className="space-y-3">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <p className="text-lg mb-2">暂无文章</p>
              <p className="text-sm">点击「写文章」开始创作</p>
            </div>
          ) : (
            filtered.map((article) => (
              <div
                key={article.id}
                className="bg-surface border border-border rounded-xl p-5 flex gap-4 hover:border-primary/30 hover:shadow-sm transition-all"
              >
                {/* Cover Thumbnail */}
                {article.coverImage ? (
                  <img
                    src={article.coverImage}
                    alt=""
                    className="w-20 h-16 object-cover rounded-lg flex-shrink-0 hidden sm:block"
                  />
                ) : (
                  <div className="w-20 h-16 bg-gray-100 rounded-lg flex-shrink-0 hidden sm:flex items-center justify-center text-gray-300 text-2xl font-serif">
                    B
                  </div>
                )}

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 mb-1 truncate">{article.title}</h3>
                  <p className="text-sm text-gray-500 mb-2 line-clamp-1">{article.summary}</p>
                  <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      {article.publishedAt}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock size={12} />
                      {article.readingTime} 分钟
                    </span>
                    <div className="flex gap-1">
                      {article.tags.map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-primary/10 text-primary rounded-full"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 flex-shrink-0">
                  <button
                    onClick={() => navigate(`/post/${article.slug}`)}
                    title="预览"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                  >
                    <Eye size={18} />
                  </button>
                  <button
                    onClick={() => navigate(`/admin/editor/${article.id}`)}
                    title="编辑"
                    className="p-2 rounded-lg hover:bg-gray-100 text-gray-500 hover:text-primary transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => setDeleteId(article.id)}
                    title="删除"
                    className="p-2 rounded-lg hover:bg-red-50 text-gray-500 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Delete Confirm Modal */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-surface rounded-xl p-6 max-w-sm w-full shadow-xl fade-in">
            <h3 className="font-semibold text-gray-900 mb-2">确认删除</h3>
            <p className="text-sm text-gray-600 mb-6">
              删除后无法恢复，确定要删除这篇文章吗？
            </p>
            <div className="flex gap-3 justify-end">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 text-sm rounded-lg bg-gray-100 hover:bg-gray-200 transition-colors"
              >
                取消
              </button>
              <button
                onClick={() => handleDelete(deleteId)}
                className="px-4 py-2 text-sm rounded-lg bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                确认删除
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
