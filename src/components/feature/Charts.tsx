import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend } from 'recharts';

export const CHART_COLORS = ['#17324D', '#2563A6', '#148A8A', '#23865B', '#C58322', '#C2414B', '#5E6B78', '#3C88C5'];

interface LineDef {
  key: string;
  name: string;
  color: string;
}

export function TrendChart({ data, lines, height = 220, yDomain }: { data: Record<string, string | number>[]; lines: LineDef[]; height?: number; yDomain?: [number, number] }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          {lines.map((l) => (
            <linearGradient key={l.key} id={`grad-${l.key}`} x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={l.color} stopOpacity={0.18} />
              <stop offset="95%" stopColor={l.color} stopOpacity={0.02} />
            </linearGradient>
          ))}
        </defs>
        <CartesianGrid stroke="#EDF0F4" vertical={false} />
        <XAxis dataKey="label" tick={{ fontSize: 11, fill: '#5E6B78' }} tickLine={false} axisLine={{ stroke: '#DDE3EA' }} />
        <YAxis tick={{ fontSize: 11, fill: '#5E6B78' }} tickLine={false} axisLine={false} domain={yDomain || [0, 'auto']} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DDE3EA' }} />
        {lines.map((l) => (
          <Area key={l.key} type="monotone" dataKey={l.key} name={l.name} stroke={l.color} strokeWidth={2} fill={`url(#grad-${l.key})`} />
        ))}
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function SimpleBarChart({ data, bars, xKey, height = 220, stacked }: { data: Record<string, string | number>[]; bars: LineDef[]; xKey: string; height?: number; stacked?: boolean }) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <CartesianGrid stroke="#EDF0F4" vertical={false} />
        <XAxis dataKey={xKey} tick={{ fontSize: 11, fill: '#5E6B78' }} tickLine={false} axisLine={{ stroke: '#DDE3EA' }} interval={0} />
        <YAxis tick={{ fontSize: 11, fill: '#5E6B78' }} tickLine={false} axisLine={false} />
        <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DDE3EA' }} cursor={{ fill: '#F5F7FA' }} />
        {bars.map((b) => (
          <Bar key={b.key} dataKey={b.key} name={b.name} fill={b.color} radius={[3, 3, 0, 0]} maxBarSize={38} stackId={stacked ? 'a' : undefined} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

interface DonutDatum {
  name: string;
  value: number;
  color: string;
}

export function DonutChart({ data, height = 200, centerValue, centerLabel }: { data: DonutDatum[]; height?: number; centerValue?: string; centerLabel?: string }) {
  const total = data.reduce((s, d) => s + d.value, 0) || 1;
  return (
    <div className="relative" style={{ height }}>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie data={data} dataKey="value" nameKey="name" innerRadius="62%" outerRadius="85%" paddingAngle={2} strokeWidth={0}>
            {data.map((d) => (
              <Cell key={d.name} fill={d.color} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ fontSize: 12, borderRadius: 8, border: '1px solid #DDE3EA' }} formatter={(v: number) => [`${v}`, '']} />
          <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: 12, color: '#5E6B78' }} />
        </PieChart>
      </ResponsiveContainer>
      {centerValue && (
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none" style={{ paddingBottom: 20 }}>
          <span className="text-xl font-semibold text-ink-900 tabular-nums">{centerValue}</span>
          {centerLabel && <span className="text-[11px] text-ink-400">{centerLabel}</span>}
        </div>
      )}
      <div className="sr-only">Total: {total}</div>
    </div>
  );
}