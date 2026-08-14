import type { ReactNode } from 'react';

export default function Card({ title, subtitle, actions, children, className = '', bodyClass = 'p-5' }: { title?: string; subtitle?: string; actions?: ReactNode; children: ReactNode; className?: string; bodyClass?: string }) {
  return (
    <div className={`bg-white border border-line-200 rounded-lg overflow-hidden ${className}`}>
      {(title || actions) && (
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-line-100">
          <div>
            <h3 className="text-sm font-semibold text-ink-900">{title}</h3>
            {subtitle && <p className="text-xs text-ink-400 mt-0.5">{subtitle}</p>}
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      )}
      <div className={bodyClass}>{children}</div>
    </div>
  );
}