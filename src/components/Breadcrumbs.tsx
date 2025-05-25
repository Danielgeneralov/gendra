import Link from 'next/link';
import StructuredData from './SEO/StructuredData';

export interface BreadcrumbItem {
  label: string;
  href: string;
}

export interface BreadcrumbsProps {
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = '' }: BreadcrumbsProps) {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.label,
      "item": `https://www.gogendra.com${item.href}`
    }))
  };

  return (
    <>
      <StructuredData data={structuredData} />
      <nav aria-label="Breadcrumb" className={`text-sm mb-4 ${className}`}>
        <ol className="flex flex-wrap items-center space-x-2">
          {items.map((item, index) => (
            <li key={item.href} className="flex items-center">
              {index > 0 && <span className="mx-2 text-gray-400">/</span>}
              {index === items.length - 1 ? (
                <span className="text-blue-600">{item.label}</span>
              ) : (
                <Link href={item.href} className="text-gray-600 hover:text-blue-600">
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
    </>
  );
} 