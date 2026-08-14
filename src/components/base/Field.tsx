import type { ReactNode } from 'react';

interface FieldProps {
  label: string;
  required?: boolean;
  children: ReactNode;
  className?: string;
  hint?: string;
}

export const inputCls =
  'w-full h-10 px-3 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500 focus:border-transparent bg-white text-ink-900 placeholder:text-ink-400';

export const selectCls =
  'w-full h-10 px-3 text-sm border border-line-200 rounded-md focus:outline-none focus:ring-2 focus:ring-clinic-500 bg-white text-ink-900';

export const btnPrimaryCls =
  'inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-white bg-navy-900 hover:bg-navy-800 rounded-md whitespace-nowrap transition-colors cursor-pointer';

export const btnSecondaryCls =
  'inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-ink-700 bg-white border border-line-200 hover:bg-canvas-50 rounded-md whitespace-nowrap transition-colors cursor-pointer';

export const btnDangerCls =
  'inline-flex items-center gap-1.5 h-10 px-4 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md whitespace-nowrap transition-colors cursor-pointer';

export function Field({ label, required, children, className = '', hint }: FieldProps) {
  return (
    <div className={className}>
      <label className="text-xs font-semibold text-ink-700 mb-1.5 block">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {hint && <p className="text-[11px] text-ink-400 mt-1">{hint}</p>}
    </div>
  );
}