const COLORS = [
  'bg-navy-700',
  'bg-clinic-700',
  'bg-teal-600',
  'bg-green-600',
  'bg-amber-500',
  'bg-red-500',
  'bg-navy-500',
  'bg-clinic-500',
];

function initials(name: string) {
  return name
    .replace('Dr. ', '')
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p.charAt(0).toUpperCase())
    .join('');
}

export default function Avatar({ name, photo, size = 36, className = '' }: { name: string; photo?: string; size?: number; className?: string }) {
  if (photo) {
    return (
      <img
        src={photo}
        alt={name}
        style={{ width: size, height: size }}
        className={`rounded-full object-cover object-top border border-line-200 flex-shrink-0 ${className}`}
      />
    );
  }
  const idx = (name.charCodeAt(0) + name.length) % COLORS.length;
  return (
    <span
      style={{ width: size, height: size, fontSize: Math.round(size * 0.34) }}
      className={`inline-flex items-center justify-center rounded-full text-white font-semibold flex-shrink-0 ${COLORS[idx]} ${className}`}
    >
      {initials(name)}
    </span>
  );
}