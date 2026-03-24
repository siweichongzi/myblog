import { useEffect, useState } from 'react';

interface TocItem {
  id: string;
  text: string;
  level: number;
}

export function TableOfContents() {
  const [activeId, setActiveId] = useState<string>('');
  const [tocItems, setTocItems] = useState<TocItem[]>([]);

  // 扫描 DOM 中由 MarkdownRenderer 渲染出的标题（它们已带有 id）
  useEffect(() => {
    // 延迟一帧，确保 Markdown 已渲染完毕
    const timer = setTimeout(() => {
      const headings = document.querySelectorAll<HTMLElement>(
        '.markdown-content h1, .markdown-content h2, .markdown-content h3, .markdown-content h4'
      );
      const items: TocItem[] = Array.from(headings)
        .filter((h) => h.id) // 只取有 id 的标题
        .map((h) => ({
          id: h.id,
          text: h.textContent?.trim() || '',
          level: parseInt(h.tagName.charAt(1)),
        }));
      setTocItems(items);
    }, 100);
    return () => clearTimeout(timer);
  }, []); // 文章页面只渲染一次，挂载后扫描即可

  // IntersectionObserver：高亮当前可见标题
  useEffect(() => {
    if (tocItems.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        // 取第一个进入视口的标题作为当前激活项
        const visible = entries.find((e) => e.isIntersecting);
        if (visible) setActiveId(visible.target.id);
      },
      { rootMargin: '-80px 0px -60% 0px' }
    );

    tocItems.forEach(({ id }) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [tocItems]);

  if (tocItems.length === 0) return null;

  const scrollToHeading = (id: string) => {
    const el = document.getElementById(id);
    if (!el) return;
    // scroll-mt-24 (96px) + 额外 8px 余量
    const top = el.getBoundingClientRect().top + window.scrollY - 104;
    window.scrollTo({ top, behavior: 'smooth' });
  };

  return (
    <nav className="sticky top-24 max-h-[calc(100vh-8rem)] overflow-y-auto p-4 bg-surface border border-border rounded-xl">
      <h4 className="text-sm font-semibold text-gray-900 mb-3">目录</h4>
      <ul className="space-y-1.5">
        {tocItems.map((item) => (
          <li
            key={item.id}
            onClick={() => scrollToHeading(item.id)}
            className={`
              text-sm transition-colors cursor-pointer leading-snug
              ${item.level === 3 ? 'pl-4' : item.level === 4 ? 'pl-7' : ''}
              ${activeId === item.id
                ? 'text-primary font-medium'
                : 'text-gray-500 hover:text-primary'
              }
            `}
          >
            <span
              className={`inline-block w-1.5 h-1.5 rounded-full mr-2 flex-shrink-0 align-middle ${
                activeId === item.id ? 'bg-primary' : 'bg-gray-300'
              }`}
            />
            {item.text}
          </li>
        ))}
      </ul>
    </nav>
  );
}
