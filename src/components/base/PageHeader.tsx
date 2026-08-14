import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';

interface Crumb {
  label: string;
  path?: string;
}

interface PageHeaderProps {
  crumbs?: Crumb[];
  title: string;
  subtitle?: string;
  actions?: ReactNode;
}

export default function PageHeader({ crumbs = [], title, subtitle, actions }: PageHeaderProps) {
  return (
    <div className="mb-6">
      {crumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-ink-400 mb-2" aria-label="Breadcrumb">
          {crumbs.map((c, i) => (
            <span key={i} className="flex items-center gap-1.5">
              {i > 0 && <i className="ri-arrow-right-s-line text-sm" />}
              {c.path ? (
                <Link to={c.path} className="hover:text-clinic-700 transition-colors">
                  {c.label}
                </Link>
              ) : (
                <span className={i === crumbs.length - 1 ? 'text-ink-600 font-medium' : ''}>{c.label}</span>
              )}
            </span>
          ))}
        </nav>
      )}
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-ink-900">{title}</h1>
          {subtitle && <p className="text-[13px] text-ink-500 mt-1">{subtitle}</p>}
        </div>
        {actions && <div className="flex flex-wrap items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}