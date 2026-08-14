import type { ReactNode } from 'react';

interface ModalProps {
  title: string;
  subtitle?: string;
  onClose: () => void;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  footer?: ReactNode;
}

const SIZES = {
  sm: 'max-w-md',
  md: 'max-w-lg',
  lg: 'max-w-2xl',
  xl: 'max-w-4xl',
  '2xl': 'max-w-6xl',
};

export default function Modal({ title, subtitle, onClose, children, size = 'lg', footer }: ModalProps) {
  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-ink-950/45" onClick={onClose} />
      <div className={`relative w-full ${SIZES[size]} bg-white rounded-xl border border-line-200 shadow-pop max-h-[92vh] flex flex-col animate-fade-in`}>
        <div className="flex items-start justify-between px-6 py-4 border-b border-line-100 flex-shrink-0">
          <div>
            <h3 className="text-[15px] font-semibold text-ink-900">{title}</h3>
            {subtitle && <p className="text-xs text-ink-500 mt-0.5">{subtitle}</p>}
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-canvas-100 text-ink-400 hover:text-ink-600 flex-shrink-0"
            aria-label="Close"
          >
            <i className="ri-close-line text-base" />
          </button>
        </div>
        <div className="px-6 py-5 overflow-y-auto flex-1">{children}</div>
        {footer && (
          <div className="px-6 py-4 border-t border-line-100 flex items-center justify-end gap-3 flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </div>
  );
}