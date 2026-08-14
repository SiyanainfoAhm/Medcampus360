interface KpiCardProps {
  label: string;
  value: string;
  sub?: string;
  icon: string;
  tone?: 'navy' | 'blue' | 'teal' | 'green' | 'amber' | 'red' | 'neutral';
  onClick?: () => void;
}

const ICON_TONES = {
  navy: 'bg-navy-900 text-white',
  blue: 'bg-clinic-700 text-white',
  teal: 'bg-teal-600 text-white',
  green: 'bg-green-600 text-white',
  amber: 'bg-amber-500 text-white',
  red: 'bg-red-600 text-white',
  neutral: 'bg-canvas-200 text-ink-600',
};

export default function KpiCard({ label, value, sub, icon, tone = 'navy', onClick }: KpiCardProps) {
  const Comp = onClick ? 'button' : 'div';
  return (
    <Comp
      onClick={onClick}
      className={`w-full text-left bg-white border border-line-200 rounded-lg p-4 flex flex-col gap-3 ${onClick ? 'hover:border-navy-300 hover:bg-canvas-50 transition-colors cursor-pointer' : ''}`}
    >
      <div className="flex items-center justify-between">
        <span className={`w-9 h-9 rounded-md flex items-center justify-center flex-shrink-0 ${ICON_TONES[tone]}`}>
          <i className={`${icon} text-base`} />
        </span>
        {onClick && (
          <span className="text-[11px] text-clinic-700 font-medium flex items-center gap-0.5">
            View
            <i className="ri-arrow-right-line text-xs" />
          </span>
        )}
      </div>
      <div>
        <p className="text-[26px] font-semibold text-ink-900 leading-none tabular-nums">{value}</p>
        <p className="text-[13px] text-ink-500 mt-1.5 font-medium">{label}</p>
        {sub && <p className="text-[11px] text-ink-400 mt-0.5">{sub}</p>}
      </div>
    </Comp>
  );
}