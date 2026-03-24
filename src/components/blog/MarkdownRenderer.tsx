import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';

interface MarkdownRendererProps {
  content: string;
}

// 将标题文本转换为合法的 id（处理中文、英文、数字）
function slugifyHeading(text: string, index: number): string {
  const base = text
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w\u4e00-\u9fa5-]/g, '');
  return base ? `${base}-${index}` : `heading-${index}`;
}

// 用于计数，确保每次渲染 id 唯一
const counters: Record<string, number> = {};

function getHeadingId(text: string): string {
  const key = text.trim();
  counters[key] = (counters[key] ?? -1) + 1;
  return slugifyHeading(key, counters[key]);
}

// 在渲染前重置计数器（每次文章内容变化都重置）
function resetCounters() {
  Object.keys(counters).forEach((k) => delete counters[k]);
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  // 每次内容变化重置 id 计数
  resetCounters();

  return (
    <div className="markdown-content">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          h1: ({ children }) => {
            const text = String(children);
            const id = getHeadingId(text);
            return (
              <h1
                id={id}
                className="text-3xl font-serif font-bold text-gray-900 mb-6 mt-10 pb-3 border-b border-border scroll-mt-24"
              >
                {children}
              </h1>
            );
          },
          h2: ({ children }) => {
            const text = String(children);
            const id = getHeadingId(text);
            return (
              <h2
                id={id}
                className="text-2xl font-serif font-semibold text-gray-900 mb-4 mt-8 pb-2 border-b border-border scroll-mt-24"
              >
                {children}
              </h2>
            );
          },
          h3: ({ children }) => {
            const text = String(children);
            const id = getHeadingId(text);
            return (
              <h3
                id={id}
                className="text-xl font-serif font-semibold text-gray-900 mb-3 mt-6 scroll-mt-24"
              >
                {children}
              </h3>
            );
          },
          h4: ({ children }) => {
            const text = String(children);
            const id = getHeadingId(text);
            return (
              <h4
                id={id}
                className="text-lg font-serif font-medium text-gray-900 mb-2 mt-4 scroll-mt-24"
              >
                {children}
              </h4>
            );
          },
          p: ({ children }) => (
            <p className="mb-4 text-gray-700 leading-relaxed">{children}</p>
          ),
          ul: ({ children }) => (
            <ul className="mb-4 pl-6 list-disc space-y-2">{children}</ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 pl-6 list-decimal space-y-2">{children}</ol>
          ),
          li: ({ children }) => (
            <li className="text-gray-700">{children}</li>
          ),
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary pl-4 py-3 my-6 bg-gray-50 italic text-gray-600 rounded-r-lg">
              {children}
            </blockquote>
          ),
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary-light underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          img: ({ src, alt }) => (
            <img
              src={src}
              alt={alt || ''}
              className="rounded-lg my-6 max-w-full mx-auto"
            />
          ),
          code: ({ className, children, ...props }) => {
            const isInline = !className;
            if (isInline) {
              return (
                <code className="font-mono text-sm bg-gray-100 px-1.5 py-0.5 rounded text-primary" {...props}>
                  {children}
                </code>
              );
            }
            return (
              <code className={`${className} font-mono`} {...props}>
                {children}
              </code>
            );
          },
          pre: ({ children }) => (
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto my-6 text-sm">
              {children}
            </pre>
          ),
          table: ({ children }) => (
            <div className="overflow-x-auto my-6">
              <table className="w-full border-collapse">{children}</table>
            </div>
          ),
          th: ({ children }) => (
            <th className="border border-gray-200 px-4 py-2 text-left bg-gray-50 font-medium text-gray-900">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="border border-gray-200 px-4 py-2 text-gray-700">
              {children}
            </td>
          ),
          hr: () => <hr className="my-8 border-gray-200" />,
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
