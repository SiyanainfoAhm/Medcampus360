export type Tone = 'neutral' | 'navy' | 'blue' | 'teal' | 'green' | 'amber' | 'red';

const TONES: Record<Tone, string> = {
  neutral: 'bg-canvas-100 text-ink-600 border-line-200',
  navy: 'bg-navy-50 text-navy-800 border-navy-200',
  blue: 'bg-clinic-50 text-clinic-800 border-clinic-200',
  teal: 'bg-teal-50 text-teal-800 border-teal-200',
  green: 'bg-green-50 text-green-800 border-green-200',
  amber: 'bg-amber-50 text-amber-800 border-amber-200',
  red: 'bg-red-50 text-red-700 border-red-200',
};

const DOTS: Record<Tone, string> = {
  neutral: 'bg-ink-400',
  navy: 'bg-navy-600',
  blue: 'bg-clinic-600',
  teal: 'bg-teal-600',
  green: 'bg-green-600',
  amber: 'bg-amber-500',
  red: 'bg-red-600',
};

export function toneFor(status: string): Tone {
  const s = status.toLowerCase();
  if (['approved', 'validated', 'ready', 'competency credited', 'exceeds expectation', 'achieved', 'active', 'success', 'eligible', 'present', 'released', 'successful'].some((k) => s.includes(k))) return 'green';
  if (['attention required', 'submitted', 'pending', 'scheduled', 'in progress', 'awaiting release', 'needs review', 'under review', 'late', 'on track', 'conditionally eligible', 'warning'].some((k) => s.includes(k))) return 'amber';
  if (['revision requested', 'absent', 'not eligible', 'evidence missing', 'denied', 'failed', 'cancelled', 'overdue', 'probation', 'critical'].some((k) => s.includes(k))) return 'red';
  if (['review required', 'draft', 'grading', 'inactive'].some((k) => s.includes(k))) return 'blue';
  return 'neutral';
}

export default function StatusBadge({ status, tone }: { status: string; tone?: Tone }) {
  const t = tone || toneFor(status);
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border whitespace-nowrap ${TONES[t]}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${DOTS[t]}`} />
      {status}
    </span>
  );
}