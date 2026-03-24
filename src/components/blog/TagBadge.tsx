import { Link } from 'react-router-dom';

interface TagBadgeProps {
  name: string;
  slug?: string;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
  active?: boolean;
}

export function TagBadge({ name, slug, count, size = 'md', active = false }: TagBadgeProps) {
  const sizeStyles = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  const baseStyles = `
    inline-flex items-center gap-1.5 rounded-full font-medium
    transition-all duration-200
    ${sizeStyles[size]}
    ${active 
      ? 'bg-primary text-white' 
      : 'bg-gray-100 text-gray-700 hover:bg-primary hover:text-white'
    }
  `;

  const content = (
    <>
      <span>{name}</span>
      {count !== undefined && (
        <span className={`px-1.5 py-0.5 rounded-full text-xs ${active ? 'bg-white/20' : 'bg-gray-200'}`}>
          {count}
        </span>
      )}
    </>
  );

  if (slug) {
    return (
      <Link to={`/tags/${slug}`} className={baseStyles}>
        {content}
      </Link>
    );
  }

  return <span className={baseStyles}>{content}</span>;
}
