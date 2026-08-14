export default function ProgressBar({
  value,
  tone = 'clinic',
  height = 6,
  label,
}: {
  value: number;
  tone?: 'clinic' | 'green' | 'amber' | 'red' | 'navy' | 'teal';
  height?: number;
  label?: string;
}) {
  const colors = {
    clinic: 'bg-clinic-600',
    green: 'bg-green-600',
    amber: 'bg-amber-500',
    red: 'bg-red-600',
    navy: 'bg-navy-900',
    teal: 'bg-teal-600',
  };
  return (
    <div className="flex items-center gap-2">
      <div className="w-full bg-canvas-200 rounded-full overflow-hidden" style={{ height }}>
        <div className={`h-full rounded-full ${colors[tone]} transition-all duration-500`} style={{ width: `${Math.min(100, Math.max(0, value))}%` }} />
      </div>
      {label && <span className="text-xs font-medium text-ink-600 tabular-nums whitespace-nowrap">{label}</span>}
    </div>
  );
}