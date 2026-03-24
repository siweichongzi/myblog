import { Github, Mail, Rss } from 'lucide-react';

export function Footer() {
  return (
    <footer className="mt-auto border-t border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          {/* Copyright */}
          <div className="text-sm text-gray-500">
            © 2024 博客主题. 用心记录生活
          </div>

          {/* Social Links */}
          <div className="flex items-center gap-4">
            <a
              href="https://github.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
              aria-label="GitHub"
            >
              <Github size={20} />
            </a>
            <a
              href="mailto:hello@example.com"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
              aria-label="邮箱"
            >
              <Mail size={20} />
            </a>
            <a
              href="/rss.xml"
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors text-gray-500 hover:text-primary"
              aria-label="RSS"
            >
              <Rss size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
