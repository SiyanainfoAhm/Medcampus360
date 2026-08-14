import { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import PageHeader from '@/components/base/PageHeader';
import Card from '@/components/base/Card';
import KpiCard from '@/components/base/KpiCard';
import StatusBadge from '@/components/base/StatusBadge';
import { DonutChart, SimpleBarChart, CHART_COLORS } from '@/components/feature/Charts';
import { useAppData } from '@/context/AppDataContext';
import { useToast } from '@/context/ToastContext';
import { COMPLIANCE_CATEGORIES } from '@/mocks/compliance';
import { printHtml, LETTERHEAD } from '@/utils/print';
import { btnPrimaryCls, btnSecondaryCls } from '@/components/base/Field';

export default function CompliancePage() {
  const navigate = useNavigate();
  const { complianceIndicators, evidence, addAudit } = useAppData();
  const { toast } = useToast();

  const counts = useMemo(
    () => ({
      Ready: complianceIndicators.filter((c) => c.status === 'Ready').length,
      'Attention Required': complianceIndicators.filter((c) => c.status === 'Attention Required').length,
      'Evidence Missing': complianceIndicators.filter((c) => c.status === 'Evidence Missing').length,
      'Under Review': complianceIndicators.filter((c) => c.status === 'Under Review').length,
    }),
    [complianceIndicators]
  );

  const readiness = useMemo(() => {
    const colors: Record<string, string> = { Ready: '#23865B', 'Attention Required': '#C58322', 'Evidence Missing': '#C2414B', 'Under Review': '#2563A6' };
    return (['Ready', 'Attention Required', 'Evidence Missing', 'Under Review'] as const).map((s) => ({ name: s, value: counts[s], color: colors[s] }));
  }, [counts]);

  const byCategory = useMemo(
    () =>
      COMPLIANCE_CATEGORIES.map((cat) => ({
        label: cat.split(' ')[0],
        value: complianceIndicators.filter((c) => c.category === cat && c.status === 'Ready').length,
      })),
    [complianceIndicators]
  );

  const exportEvidencePack = () => {
    addAudit({ user: 'Rachel Kim', role: 'Compliance Administrator', module: 'Compliance', action: 'Export', record: 'Accreditation Evidence Pack', ipDevice: '192.168.1.41 · Desktop', outcome: 'Success' });
    const rows = evidence
      .map(
        (e) =>
          `<tr><td>${e.title}</td><td>${e.type}</td><td>${e.uploadedBy}</td><td>${e.uploadedAt}</td><td><span class="badge ${e.status === 'Approved' ? 'g' : 'a'}">${e.status}</span></td></tr>`
      )
      .join('');
    printHtml(
      'Accreditation Evidence Pack',
      `${LETTERHEAD}
      <div class="doc-title">Accreditation Evidence Pack</div>
      <p style="font-size:13px;">Prepared for institutional accreditation readiness review. Academic Year 2026-2027 · Status reflects the current evidence store.</p>
      <div class="meta">
        <div class="item"><div class="label">Evidence records</div><div class="value">${evidence.length}</div></div>
        <div class="item"><div class="label">Indicators tracked</div><div class="value">${complianceIndicators.length}</div></div>
        <div class="item"><div class="label">Ready</div><div class="value">${counts.Ready}</div></div>
      </div>
      <table>
        <tr><th>Evidence title</th><th>Type</th><th>Uploaded by</th><th>Date</th><th>Status</th></tr>
        ${rows}
      </table>
      <div class="footer">Northbridge University School of Medicine · MedCampus 360 · Readiness status — not an accreditation claim.</div>`
    );
  };

  return (
    <div className="animate-fade-in">
      <PageHeader
        crumbs={[{ label: 'Compliance' }, { label: 'Compliance Readiness' }]}
        title="Compliance & Accreditation"
        subtitle="Readiness and evidence status across 10 institutional categories · Northbridge University School of Medicine"
        actions={
          <>
            <button onClick={exportEvidencePack} className={btnSecondaryCls}><i className="ri-archive-line" /> Export Evidence Pack</button>
            <button onClick={() => { toast('Compliance report opened'); navigate('/reports?report=RPT-11'); }} className={btnPrimaryCls}><i className="ri-file-chart-line" /> Compliance Report</button>
          </>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <KpiCard label="Ready" value={String(counts.Ready)} sub="Indicators on track" icon="ri-shield-check-line" tone="green" onClick={() => navigate('/compliance?status=Ready')} />
        <KpiCard label="Attention Required" value={String(counts['Attention Required'])} sub="Corrective action active" icon="ri-alert-line" tone="amber" onClick={() => navigate('/compliance?status=Attention Required')} />
        <KpiCard label="Evidence Missing" value={String(counts['Evidence Missing'])} sub="Upload required" icon="ri-file-warning-line" tone="red" onClick={() => navigate('/compliance?status=Evidence Missing')} />
        <KpiCard label="Under Review" value={String(counts['Under Review'])} sub="Awaiting review" icon="ri-time-line" tone="blue" onClick={() => navigate('/compliance?status=Under Review')} />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-6">
        <Card title="Overall Readiness" subtitle="Evidence status across all indicators">
          <DonutChart data={readiness} centerValue={`${complianceIndicators.length}`} centerLabel="indicators" />
        </Card>
        <Card title="Readiness by Category" subtitle="Ready indicators per category">
          <SimpleBarChart data={byCategory} xKey="label" bars={[{ key: 'value', name: 'Ready', color: CHART_COLORS[3] }]} height={240} />
        </Card>
        <Card title="Categories & Owners" subtitle="Responsibility across institutional teams">
          <div className="space-y-2">
            {COMPLIANCE_CATEGORIES.map((c, i) => (
              <div key={c} className="flex items-center gap-3 border border-line-200 rounded-lg p-2.5">
                <span className="w-7 h-7 rounded-md bg-navy-900 text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0">{i + 1}</span>
                <p className="text-[13px] font-medium text-ink-800 flex-1">{c}</p>
                <StatusBadge status={complianceIndicators.filter((x) => x.category === c).some((x) => x.status === 'Evidence Missing') ? 'Evidence Missing' : complianceIndicators.filter((x) => x.category === c).some((x) => x.status !== 'Ready') ? 'Attention Required' : 'Ready'} />
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card title="Indicator Register" subtitle="Click an indicator to open its full detail with evidence and approval history" bodyClass="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left" style={{ minWidth: 900 }}>
            <thead>
              <tr className="border-b border-line-100">
                {['Code', 'Requirement', 'Category', 'Owner', 'Period', 'Evidence', 'Status', 'Next review'].map((h) => (
                  <th key={h} className="px-4 py-2.5 text-[11px] font-semibold text-ink-500 uppercase tracking-wide whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {complianceIndicators.map((c) => (
                <tr key={c.id} className="border-b border-line-50 last:border-0 cursor-pointer hover:bg-canvas-50 transition-colors" onClick={() => navigate(`/compliance/${c.id}`)}>
                  <td className="px-4 py-3 text-xs font-semibold text-navy-800">{c.code}</td>
                  <td className="px-4 py-3 text-sm font-medium text-ink-900 max-w-[280px] truncate">{c.name}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{c.category}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600">{c.owner}</td>
                  <td className="px-4 py-3 text-[13px] text-ink-600 whitespace-nowrap">{c.reportingPeriod}</td>
                  <td className="px-4 py-3 text-sm tabular-nums">{c.evidenceCount}</td>
                  <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                  <td className="px-4 py-3 text-[13px] text-ink-600 whitespace-nowrap">{c.nextReview}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}