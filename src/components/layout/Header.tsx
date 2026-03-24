import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Search, PenSquare } from 'lucide-react';
import { useState, useEffect } from 'react';
import { loadArticles } from '../../data/store';
import type { Article } from '../../types';

const navLinks = [
  { name: '首页', path: '/' },
  { name: '文章', path: '/articles' },
  { name: '标签', path: '/tags' },
  { name: '关于', path: '/about' },
];

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    loadArticles().then((articles) => {
      if (searchQuery.length > 1) {
        const results = articles.filter(
          (a: Article) =>
            a.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            a.summary.toLowerCase().includes(searchQuery.toLowerCase())
        ).slice(0, 5);
        setSearchResults(results);
      } else {
        setSearchResults([]);
      }
    });
  }, [searchQuery]);

  return (
    <header className="sticky top-0 z-50 bg-surface/95 backdrop-blur-sm border-b border-border">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-white font-serif font-bold text-lg transition-transform group-hover:scale-105">
              B
            </div>
            <span className="font-serif font-semibold text-lg text-gray-900 hidden sm:block">
              博客主题
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium transition-colors relative ${
                  location.pathname === link.path
                    ? 'text-primary'
                    : 'text-gray-600 hover:text-primary'
                }`}
              >
                {link.name}
                {location.pathname === link.path && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full" />
                )}
              </Link>
            ))}
          </nav>

          {/* Right Actions */}
          <div className="flex items-center gap-2">
            {/* Search */}
            <button
              onClick={() => { setIsSearchOpen(!isSearchOpen); setSearchQuery(''); }}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600 hover:text-primary"
              aria-label="搜索"
            >
              <Search size={20} />
            </button>

            {/* Write Button */}
            <Link
              to="/admin/editor"
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 bg-primary text-white rounded-lg text-sm font-medium hover:bg-primary-dark transition-colors"
            >
              <PenSquare size={15} />
              写文章
            </Link>

            {/* Admin */}
            <Link
              to="/admin"
              className={`hidden md:block text-sm font-medium px-3 py-1.5 rounded-lg transition-colors ${
                location.pathname.startsWith('/admin')
                  ? 'bg-primary/10 text-primary'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              管理
            </Link>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-600"
              aria-label="菜单"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Search Bar */}
        {isSearchOpen && (
          <div className="py-3 border-t border-border fade-in">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              <input
                type="text"
                placeholder="搜索文章..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
                autoFocus
              />
            </div>
            {/* Search Results Dropdown */}
            {searchResults.length > 0 && (
              <div className="mt-2 bg-surface border border-border rounded-lg shadow-lg overflow-hidden">
                {searchResults.map((article) => (
                  <button
                    key={article.id}
                    onClick={() => {
                      navigate(`/post/${article.slug}`);
                      setIsSearchOpen(false);
                      setSearchQuery('');
                    }}
                    className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors border-b border-border last:border-b-0"
                  >
                    <p className="text-sm font-medium text-gray-900">{article.title}</p>
                    <p className="text-xs text-gray-500 mt-0.5 line-clamp-1">{article.summary}</p>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <nav className="md:hidden py-4 border-t border-border fade-in">
            <div className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    location.pathname === link.path
                      ? 'bg-primary/10 text-primary'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
              <Link
                to="/admin/editor"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-white bg-primary hover:bg-primary-dark transition-colors flex items-center gap-2"
              >
                <PenSquare size={15} />
                写文章
              </Link>
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-100 transition-colors"
              >
                文章管理
              </Link>
            </div>
          </nav>
        )}
      </div>
    </header>
  );
}
