import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';

const PALETTE = [
  { name: 'Primary Navy', token: '#17324D', cls: 'bg-navy-900' },
  { name: 'Navy 800', token: '#24405C', cls: 'bg-navy-800' },
  { name: 'Navy 700', token: '#344F6C', cls: 'bg-navy-700' },
  { name: 'Clinical Blue', token: '#2563A6', cls: 'bg-clinic-700' },
  { name: 'Clinic 500', token: '#3C88C5', cls: 'bg-clinic-500' },
  { name: 'Teal', token: '#148A8A', cls: 'bg-teal-600' },
  { name: 'Success', token: '#23865B', cls: 'bg-green-600' },
  { name: 'Warning', token: '#C58322', cls: 'bg-amber-500' },
  { name: 'Critical', token: '#C2414B', cls: 'bg-red-600' },
  { name: 'Page Background', token: '#F5F7FA', cls: 'bg-canvas-100 border border-line-200' },
  { name: 'Card Background', token: '#FFFFFF', cls: 'bg-white border border-line-200' },
  { name: 'Border', token: '#DDE3EA', cls: 'bg-line-200' },
  { name: 'Primary Text', token: '#17212B', cls: 'bg-ink-900' },
  { name: 'Secondary Text', token: '#5E6B78', cls: 'bg-ink-500' },
];

export default function DesignTokensPage() {
  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Administration', path: '/administration' }, { label: 'Design Tokens' }]}
        title="Design Tokens"
        subtitle="MedCampus 360 US enterprise design system · Northbridge University School of Medicine"
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <Card title="Color Palette" subtitle="US enterprise healthcare aesthetic">
          <div className="grid grid-cols-2 gap-3">
            {PALETTE.map((c) => (
              <div key={c.name} className="border border-line-200 rounded-lg overflow-hidden">
                <div className={`h-12 ${c.cls}`} />
                <div className="p-2.5">
                  <p className="text-[13px] font-medium text-ink-900">{c.name}</p>
                  <p className="text-[11px] text-ink-400 tabular-nums">{c.token}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        <div className="space-y-6">
          <Card title="Typography" subtitle="Inter - the platform typeface">
            <div className="space-y-3">
              {[
                ['Heading', 'text-2xl font-semibold', 'Executive Overview'],
                ['Page title', 'text-xl font-semibold', 'Learner Directory'],
                ['Section title', 'text-sm font-semibold', 'Clinical Rotations'],
                ['Body', 'text-sm', 'Table and paragraph text across the platform.'],
                ['Meta', 'text-xs text-ink-500', 'Secondary labels and supporting copy.'],
                ['Label', 'text-[11px] font-semibold uppercase', 'UPPERCASE FIELD LABELS'],
              ].map(([name, cls, sample]) => (
                <div key={name} className="flex items-center justify-between border-b border-line-50 pb-2">
                  <div>
                    <p className={`${cls} text-ink-900`}>{sample}</p>
                    <p className="text-[10px] text-ink-400 mt-0.5">{name}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Radii, Spacing & Elevation" subtitle="Consistent structure rules">
            <div className="space-y-3 text-sm">
              {[
                ['Card radius', '8-10px (rounded-lg / rounded-xl)'],
                ['Button radius', '6-8px (rounded-md / rounded-lg)'],
                ['Input height', '40-44px (h-10)'],
                ['Content spacing', '24px horizontal · 32px page top'],
                ['Borders over shadows', '1px #DDE3EA subtle borders'],
                ['Status colors', 'Green complete · Amber attention · Red critical'],
              ].map(([k, v]) => (
                <div key={k} className="flex items-center justify-between border-b border-line-50 pb-2">
                  <span className="text-ink-500">{k}</span>
                  <span className="font-medium text-ink-900 text-right text-[13px]">{v}</span>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      <div className="mt-6">
        <Card title="Status Color Semantics" subtitle="Used consistently across the platform">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {[
              { l: 'Approved / Validated / Ready', t: 'bg-green-50 text-green-800 border-green-200', d: 'bg-green-600' },
              { l: 'Submitted / Pending / In Progress', t: 'bg-amber-50 text-amber-800 border-amber-200', d: 'bg-amber-500' },
              { l: 'Revision / Not Eligible / Missing', t: 'bg-red-50 text-red-700 border-red-200', d: 'bg-red-600' },
              { l: 'Draft / Under Review / Grading', t: 'bg-clinic-50 text-clinic-800 border-clinic-200', d: 'bg-clinic-600' },
            ].map((s) => (
              <div key={s.l} className={`flex items-center gap-2.5 rounded-lg border p-3 ${s.t}`}>
                <span className={`w-2.5 h-2.5 rounded-full ${s.d}`} />
                <span className="text-[13px] font-medium">{s.l}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
}